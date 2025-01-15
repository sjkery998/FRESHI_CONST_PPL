import express from 'express';
import cors from 'cors';
import Midtrans from 'midtrans-client';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import http from 'http';
import { Server } from 'socket.io';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { db, auth, ref, set, get, update, remove, runTransaction, specifiedTakeData, setTransToSuccess, universalDataFunction, getDataFromNode } from './serverConfigFb.js';

dotenv.config();

const app = express();
const port = 5000;

// Setup HTTP server dan WebSocket server
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());

let snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.VITE_MIDTRANS_SERVER_KEY,
    clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY,
});

console.log("Hallo");

app.get('/hello', (req, res) => {
    res.status(200).send('Hallo');
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const productName = req.params.namaProduct;
        const uploadDir = path.join(__dirname, 'uploads', productName);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const productName = req.params.namaProduct;
        const ext = path.extname(file.originalname);
        cb(null, productName + ext);
    }
});

const upload = multer({ storage: storage });

app.post('/api/productImage/:namaProduct', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    const productName = req.params.namaProduct;
    const fileExtension = path.extname(req.file.originalname)
    const filePath = `/${productName}/${productName}${fileExtension}`;
    res.json({ message: 'File uploaded successfully', fileUrl: filePath });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/getImage/:productName/:filename', (req, res) => {
    const { productName, filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', productName, filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'File tidak ditemukan' });
        }
    });
});

// 
const WEBHOOK_PATH = process.env.VITE_MIDTRANS_WEBHOOK;
app.post(WEBHOOK_PATH, (req, res) => {
    const notificationJson = req.body;

    snap.transaction.notification(notificationJson)
        .then(async (statusResponse) => {
            if (statusResponse) {
                console.log(statusResponse);
                const order_id = statusResponse.order_id;
                if (statusResponse.transaction_status === "pending") {
                    await universalDataFunction("update", `Transactions/${order_id}`, `recipt`, statusResponse)
                }

                if (statusResponse.transaction_status === "settlement") {
                    async function updateTransaction() {
                        let result = null;

                        await runTransaction(ref(db, `/Transactions/${order_id}`), (currentData) => {
                            if (currentData) {
                                currentData.status = "diproses";
                                currentData.recipt = statusResponse;
                            } else {
                                currentData = {
                                    status: "diproses",
                                    recipt: statusResponse
                                };
                            }
                            result = currentData;
                            return currentData;
                        });

                        return result;
                    }

                    const transactionData = await updateTransaction();

                    const dataDashboard = await getDataFromNode(`Stores/${transactionData.Id_Toko}/dashboard`);
                    const newDashboardData = {
                        prSoldCounts: Number(dataDashboard?.prSoldCounts || 0) + 1,
                        recentIncome: Number(transactionData.recipt?.gross_amount || 0),
                        recentTransaction: {
                            recentIncome: Number(transactionData.recipt?.gross_amount || 0),
                            recentTransactionId: transactionData.Id_Transaksi || "",
                        },
                        totalSellings: Number(dataDashboard?.totalSellings || 0) + Number(transactionData.recipt?.gross_amount || 0),
                        trSuccessCount: Number(dataDashboard?.trSuccessCount || 0) + 1,
                    };

                    await universalDataFunction("update", `Stores/${transactionData.Id_Toko}`, `Transactions.${transactionData.Id_Transaksi}`, transactionData);
                    await universalDataFunction("update", `Stores/${transactionData.Id_Toko}`, `dashboard`, newDashboardData);
                }

                // io.emit('transactionStatus', statusResponse);
            }
        })
        .catch(error => {
            console.error('Error in handling notification:', error);
        });

    res.status(200).send('Notification received');
});

app.get('/checkPayment/midtrans/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const url = `https://api.sandbox.midtrans.com/v2/${orderId}/status/`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Basic ${process.env.VITE_MIDTRANS_AUTHORIZATION}`
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        res.json(json);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tokenizer', async (req, res) => {
    const { id, orderId, productName, price, quantity, serviceCost, deliveryCost } = req.body;

    try {
        const itemTotal = Number(price) * Number(quantity);
        let parameter = {
            item_details: [
                {
                    id: id,
                    name: productName,
                    price: Number(price),
                    quantity: Number(quantity),
                },
                {
                    id: "service-cost",
                    name: "Service Cost",
                    price: Number(serviceCost),
                    quantity: 1,
                },
                {
                    id: "delivery-cost",
                    name: "Delivery Cost",
                    price: Number(deliveryCost),
                    quantity: 1,
                },
            ],
            transaction_details: {
                order_id: orderId,
                gross_amount: itemTotal + Number(serviceCost) + Number(deliveryCost),
            },
        };

        const token = await snap.createTransactionToken(parameter);
        return res.status(200).json(token);
    } catch (error) {
        console.error("Error dari Midtrans:", error);
        return res.status(500).json({
            error: 'Terjadi kesalahan saat membuat token transaksi',
            details: error.message
        });
    }
});

// Menjalankan server dengan WebSocket dan HTTP
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

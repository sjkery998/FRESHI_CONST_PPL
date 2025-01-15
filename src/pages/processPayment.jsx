import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth/authcontext";
import { useLocation, useNavigate } from "react-router-dom";
import { getDataFromNode, setNewTrStatus, setTransToSuccess, specifiedTakeData, universalDataFunction, universalTakeData } from "../jsx/dataController";
import { getUserId } from "../jsx/webAuth";

function ProcessPayment() {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const idTransaksi = queryParams.get('transactionId');
    const [snapScr, setSnapScr] = useState(null);  // State untuk memeriksa apakah script sudah dimuat

    useEffect(() => {
        // Cek jika user belum login
        if (!userLoggedIn) {
            navigate("/"); // Redirect ke halaman utama jika tidak login
        } else {
            if (token) {
                // Cek jika script belum ada di halaman
                const existingScript = document.getElementById("snap-midtrans");
                if (!existingScript) {
                    const script = document.createElement('script');
                    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
                    script.id = "snap-midtrans";  // Tambahkan ID supaya bisa dicek jika sudah dimuat
                    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
                    document.head.appendChild(script);

                    // Setelah script selesai dimuat
                    script.onload = () => {
                        console.log('Script Snap berhasil dimuat.');
                        setSnapScr(true);  // Set snapScr menjadi true setelah script dimuat
                    };

                    // Jika ada error saat memuat script
                    script.onerror = () => {
                        console.error('Gagal memuat script Snap.');
                    };

                    // Tambahkan script ke dalam head
                } else {
                    console.log('Script Snap sudah dimuat sebelumnya.');
                    setSnapScr(true);  // Jika script sudah ada, set snapScr langsung true
                }
            } else {
                navigate(-1); // Kembali jika token tidak ada
            }
        }
    }, [userLoggedIn, token, navigate]);

    // Setelah script dimuat, jalankan pembayaran
    useEffect(() => {
        if (snapScr && token) {
            window.snap.pay(token, {
                onSuccess: async function (result) {
                    // // console.log(result);
                    // await setTransToSuccess(idTransaksi, await getUserId(), result)
                    //     .then((rev) => {
                    //         if (rev) {
                    //             // console.log('Pembayaran berhasil:', result);
                    //         }
                    //     })
                    //     .catch((error) => {
                    //         console.error("Failed to update transaction:", error);
                    //     });
                    navigate("/history", { replace: true });
                },
                onPending: async function (result) {
                    // await universalDataFunction("update", `Transactions`, `${idTransaksi}.status`, "pending")


                    // let TrData = {
                    //     ...trdata,
                    //     status: "pending",
                    //     recipt: result,
                    //     Id_Transaksi: result.order_id
                    // }
                    // // await setNewTrStatus(TrData, idTransaksi, result)
                    // console.log('Pembayaran tertunda:', TrData);
                    navigate("/history", { replace: true });

                },
                onError: function (result) {
                    console.log('Terjadi kesalahan:', result);
                },
                onClose: function () {
                    navigate("/history", { replace: true });
                }
            });
        }
    }, [snapScr, token]);  // Tunggu hingga script dimuat dan token tersedia

    return (
        <>
            <div id="snap-container"></div>
        </>
    );
}

export default ProcessPayment;

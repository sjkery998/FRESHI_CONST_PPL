import { onValue } from 'firebase/database';
import { db, ref, get, set, update, remove, runTransaction } from './firebaseConfig.jsx'
import { getUserId } from './webAuth.jsx';
import Swal from 'sweetalert2';

function universalDataFunction(operation, model, fields, data) {
    const dbRef = ref(db, `${model}`);
    if (!Array.isArray(fields)) {
        fields = [fields];
    }
    if (!Array.isArray(data)) {
        data = [data];
    }
    if (operation === "update") {

        runTransaction(dbRef, (currentData) => {
            if (currentData === null) {
                currentData = {};
            }
            fields.forEach((field, index) => {
                const fieldParts = field.split(".");
                let temp = currentData;
                fieldParts.forEach((part, i) => {
                    if (i === fieldParts.length - 1) {
                        temp[part] = data[index];
                    } else {
                        temp[part] = temp[part] || {};
                        temp = temp[part];
                    }
                });
            });
            return currentData;
        }).then(() => {
            console.log(`${model} updated successfully!`);
        }).catch((error) => {
            console.error(`Error updating ${model}:`, error);
        });
    }
}

async function specifiedTakeData(node, id, key) {
    try {

        if (Array.isArray(key)) {
            const dbRef = ref(db, `${node}/${id}`);
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                let result = {};
                key.forEach(k => {
                    if (snapshot.val()[k] !== undefined) {
                        result[k] = snapshot.val()[k];
                    } else {
                        result[k] = null;
                    }
                });
                return result;
            } else {
                return null;
            }
        } else {

            const dbRef = ref(db, `${node}/${id}/${key}`);
            const snapshot = await get(dbRef);
            return snapshot.exists() ? snapshot.val() : null;
        }
    } catch (error) {
        console.error("Error mengambil data:", error);
        return null;
    }
}

const universalTakeData = async (path) => {
    try {
        const pathFirebase = path.replace(/\./g, "/");
        const dbRef = ref(db, pathFirebase);
        const snapshot = await get(dbRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error mengambil data:", error);
        return null;
    }
}

function generateRandomAlphanumeric(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
}

// 

async function setAccountData(PayUsername, PayEmail, PayUserId) {
    const dataUserReg = {
        "AccountType": "Customer",
        "Address": "Alamat Anda",
        "Chats": {},
        "Date_Registered": generateCurrentTime(),
        "Date_Verified": generateCurrentTime(),
        "Email": PayEmail ? PayEmail : "Email Anda",
        "FavProd": {},
        "FavStore": {},
        "LastLogin": generateCurrentTime(),
        "PhoneNumber": "+62",
        "ProfilePictureURL": "/public/images/storeAvatar.png",
        "Status": "active",
        "StoreId": "",
        "Transactions": {},
        "UpdatedAt": generateCurrentTime(),
        "UserId": PayUserId ? PayUserId : "",
        "Username": PayUsername ? PayUsername : "Nama Anda",
    }
    await set(ref(db, `Accounts/${PayUserId}`), dataUserReg);
}

async function registerToSeller(UserId) {
    const newStoreId = generateRandomAlphanumeric();
    const storeRegistration = {
        "Created_At": generateCurrentTime(),
        "Products": {
            "Items": [],
            "Total": 0
        },
        "StoreAddress": "Alamat Toko Anda",
        "StoreDesc": "Deskripsi Toko Anda",
        "StoreId": newStoreId,
        "StoreName": "Nama Toko Anda",
        "StoreThumbnail": "/public/images/storeBack.png",
        "Transactions": {},
        "UpdatedAt": generateCurrentTime(),
        "UserId": UserId,
        "category": "Kategori Toko Anda",
        "dashboard": {
            "prSoldCounts": 0,
            "recentIncome": 0,
            "recentTransaction": {
                "recentIncome": 0,
                "recentTransactionId": ""
            },
            "totalSellings": 0,
            "trSuccessCount": 0,
        },
        "follower": {
            "items": {},
            "total": 0
        },
        "rating": {
            "items": {},
            "rating": 5
        },
        "visitor": 0,
    }
    Swal.fire({
        icon: "success",
        title: "Anda Yakin Ingin Mendaftar Menjadi Penjual?",
        text: "Data toko akan di generate dengan data default, lanjutkan untuk merubah data toko",
        showCancelButton: true,
        cancelButtonText: "Batal",
        confirmButtonText: "Lanjutkan",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await set(ref(db, `Stores/${newStoreId}`), storeRegistration);
            await set(ref(db, `Accounts/${UserId}/StoreId`), newStoreId);
            await set(ref(db, `Accounts/${UserId}/AccountType`), "Seller");
            window.location.href = "/storeManagement";
        } else {

        }
    })
}

async function toAddNewProduct(newProdData) {
    const newId = generateRandomAlphanumeric()
    // console.log(prodAddData);
    const formData = new FormData();
    formData.append('image', newProdData.image);
    try {
        const response = await fetch(`https://926b-114-10-100-65.ngrok-free.app/api/productImage/${newId}`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            const prodAddData = {
                "desc": newProdData.desc,
                "detail": newProdData.detail,
                "id": newId,
                "image": data.fileUrl,
                "name": newProdData.name,
                "price": newProdData.price || 0,
                "quantity": `${newProdData.quantity}|Kg`,
                "rating": {
                    "Items": {
                        [newProdData.userId]: 5
                    },
                    "Rating": 5,
                    "Total": 0,
                },
                "stock": newProdData.stock,
                "storeId": newProdData.storeId,
                "storeName": newProdData.storeName,
            }

            await set(ref(db, `Products/${prodAddData.id}`), prodAddData).then(async () => {
                console.log("Berhasil menambah data");
                const itemsRef = ref(db, `Stores/${prodAddData.storeId}/Products/Items`);
                try {
                    await runTransaction(itemsRef, (items) => {
                        if (items) {
                            if (!items.includes(prodAddData.id)) {
                                items.push(prodAddData.id);
                            }
                        } else {
                            items = [prodAddData.id];
                        }
                        return items;
                    });
                    if(itemsRef){
                        const Total = await getDataFromNode(`Stores/${prodAddData.storeId}/Products/Items`);
                        console.log(Total)
                        console.log(Total.length)
                        await set(ref(db, `Stores/${prodAddData.storeId}/Products/Total`), Total.length)
                    }
                    console.log("Item berhasil ditambahkan!");
                } catch (error) {
                    console.error("Gagal menambahkan item:", error);
                }
            });
        } else {
            alert('Gagal upload file');
        }
    } catch (error) {
        console.error('Error:', error);
    }

}


async function addProdToFav(userId, prodId, val) {
    universalDataFunction("update", `Accounts/${userId}`, `FavProduct.${prodId}`, val)
}
async function addStoreToFav(userId, storeId, val) {
    if (await specifiedTakeData("Accounts", userId, "StoreId") !== storeId) {
        await universalDataFunction("update", `Accounts/${userId}`, `FavStore.${storeId}`, val === false ? null : val)
        const followerCounts = await specifiedTakeData("Stores", storeId, "follower/total");
        const newFollowerCounts = val === false ? followerCounts - 1 : followerCounts + 1;
        await universalDataFunction("update", `Stores/${storeId}`, `follower.items.${userId}`, true);
        await universalDataFunction("update", `Stores/${storeId}`, `follower.total`, newFollowerCounts);
    }
}
async function addVisitoreStore(userId, storeId) {
    if (await specifiedTakeData("Accounts", userId, "StoreId") !== storeId) {
        const visitCount = await specifiedTakeData("Stores", storeId, "visitor");
        const newVisitCount = visitCount + 1;
        await universalDataFunction("update", `Stores/${storeId}`, `visitor`, newVisitCount);
    }
}




async function addTransaction(data) {

    const servCost = data.Biaya_Layanan + data.Biaya_Pengiriman;
    const totalP = data.Harga_Produk * data.Jumlah_Beli;
    const transactionData = {
        ...data,
        "Tanggal_Masuk": generateCurrentTime(),
        "Id_Transaksi": "Tr-" + generateRandomAlphanumeric(),
        "Total_Biaya": Number(servCost) + Number(totalP)
    };
    await set(ref(db, "Transactions/" + transactionData.Id_Transaksi), transactionData).then(async (dtran) => {
        const transactionRef = ref(db, `Accounts/${data.Id_User}/Transactions`);
        await runTransaction(transactionRef, (currentData) => {
            if (currentData === null) {
                return { [transactionData.Id_Transaksi]: "true" };
            } else {
                currentData[transactionData.Id_Transaksi] = "true";
                return currentData;
            }
        });
    });
    console.log("Transaksi berhasil disimpan!");
    return transactionData;

}

async function payNow(tranData, apiSecretKey) {
    // const idOrder = generateRandomAlphanumeric();
    const midData = {
        id: tranData.Id_Produk,
        productName: tranData.Nama_Produk,
        price: tranData.Harga_Produk,
        quantity: tranData.Jumlah_Beli,
        deliveryCost: tranData.Biaya_Pengiriman,
        serviceCost: tranData.Biaya_Layanan,
        orderId: tranData.Id_Transaksi,
        transactionId: tranData.Id_Transaksi
    };
    try {
        return fetch('api/tokenizer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiSecretKey}`,
            },
            body: JSON.stringify(midData),
        }).then(response => response.json()).then(async data => {

            if (data) {

                const tokens = data;
                await universalDataFunction("update", `Stores/${tranData.Id_Toko}`, `Transactions.${tranData.Id_Transaksi}`, tranData);


                return tokens;



            } else {
                console.error('Token is missing:', data);
                alert('Failed to generate transaction token.');
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('Error generating token.');
        });

    } catch (error) {
        console.error("Error in addTransaction:", error);
    }
}

const getDataFromNode = async (pathh) => (await get(ref(db, pathh))).val();

async function setNewTrStatus(data, id, result) {
    console.log(id)
    console.log(result.order_id)
    console.log(id === result.order_id)
    // await universalDataFunction("update", `Transactions/${result.order_id}`, `recipt`, result)
    // await universalDataFunction("update", `Transactions`, `${id}`, null)
    // await universalDataFunction("update", `Accounts/${await getUserId()}`, `Transactions.${id}`, null)
    // await universalDataFunction("update", `Accounts/${await getUserId()}`, `Transactions.${result.order_id}`, "pending")
}

async function setTransToSuccess(idTransaksi, userId, recipt) {

    try {

        await runTransaction(ref(db, `/Transactions/${idTransaksi}`), (currentData) => {
            if (currentData) {

                currentData.status = "diproses";
                currentData.recipt = recipt;
            } else {

                currentData = {
                    status: "diproses",
                    recipt: recipt
                };
            }
            return currentData;
        });


        await runTransaction(ref(db, `/Accounts/${userId}/Transactions/${idTransaksi}`), (currentData) => {
            if (currentData) {

                currentData = "diproses";
            } else {

                currentData = "diproses";
            }
            return currentData;
        });

        return true;
    } catch (error) {
        console.error("Error in setTransToSuccess:", error);
        throw error;
    }
}

async function autoSuccessTranChecker(transactionId) {
    const status = await specifiedTakeData("Transactions", `${transactionId}/recipt`, "transaction_status");
    const order_Id = await specifiedTakeData("Transactions", `${transactionId}/recipt`, "order_id");
    if (status !== "settlement") {
        console.log("belum di bayar");
        if (order_Id) {
            console.log(order_Id);
            try {
                const response = await fetch(`/checkPayment/midtrans/${order_Id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.transaction_status === "settlement") {
                    console.log('Data from backend:', data.transaction_status);
                    await setTransToSuccess(transactionId, await getUserId(), data);
                    return true;
                }
            } catch (error) {
                console.error("Error in addTransaction:", error);
            }


        }

    } else {
        console.log("sudah di bayar");
    }
}

const checkHasChat = async (targetId) => {
    try {
        const chats = await specifiedTakeData("Accounts", await getUserId(), "Chats");

        for (const [chatId, chatData] of Object.entries(chats)) {
            if (chatData.chatType === "personal") {
                console.log(chatId);
                if (chatData.target?.id === targetId) {
                    return { status: true, ChatId: chatId };
                }
            }
        }

        return { status: false, ChatId: generateRandomAlphanumeric() };
    } catch (error) {
        console.error("Error in checkHasChat:", error);
        return null;
    }
};


const chatIdValidator = async (chatId) => {
    try {
        const userId = await getUserId();
        const id = await specifiedTakeData("Accounts", `${userId}/Chats/${chatId}`, "id");

        if (id === chatId) {
            const user = await specifiedTakeData("Chats", `${chatId}/participants`, userId);
            if (user) {
                console.log("ada");
                return true;
            }
        }

        return false; // Jika kondisi tidak terpenuhi
    } catch (error) {
        console.error("Error in chatIdValidator:", error);
        return false; // Jika terjadi error
    }
};

const chatMessageListener = async (chatId, callback) => {
    if (await chatIdValidator(chatId)) {
        const unsubscribe = onValue(ref(db, `Chats/${chatId}/messages`), (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
        return unsubscribe;
    } else {
        return null;
    }
};

const userChatsListener = async (callback) => {
    try {
        const userId = await getUserId();
        if (!userId) return null;

        // Listener pada path user chats
        const unsubscribe = onValue(ref(db, `Accounts/${userId}/Chats`), (snapshot) => {
            const data = snapshot.val();
            callback(data || {}); // Fallback ke objek kosong jika data null
        });

        // Kembalikan fungsi untuk menghentikan listener
        return unsubscribe;
    } catch (error) {
        console.error("Error setting up userChatsListener:", error);
        return null;
    }
};

const sendMessage = async (chatId, message) => {
    if (await chatIdValidator(chatId)) {
        let lastIndex = await specifiedTakeData("Chats", chatId, "lastIndex");
        lastIndex = String(lastIndex).padStart(6, '0');
        console.log(lastIndex)
        const userId = await getUserId();
        const msgId = `${lastIndex}-${generateRandomAlphanumeric()}`;
        const participants = await specifiedTakeData("Chats", chatId, 'participants');
        const targetId = participants ? Object.keys(participants).find(id => id !== userId) : null;


        await set(ref(db, `/Accounts/${userId}/Chats/${chatId}/lastMessage`), {
            sender: userId,
            text: message,
            time: new Date().toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
        })
        await set(ref(db, `/Accounts/${targetId}/Chats/${chatId}/lastMessage`), {
            sender: userId,
            text: message,
            time: new Date().toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
        })
        await set(ref(db, `/Chats/${chatId}/messages/${msgId}`), {
            id: msgId,
            senderId: userId,
            isRead: false,
            message: message,
            time: new Date().toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
            date: new Date().toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),


        }).then(async () => {
            await set(ref(db, `/Chats/${chatId}/lastIndex`), Number(lastIndex) + 1);
        })
    } else if (await chatIdValidator(chatId) === "undefined" || await chatIdValidator(chatId) === false && chatId.includes("discussProd")) {
        const newChatId = chatId
        const targetId = await specifiedTakeData("Stores", chatId.split("-")[2], 'UserId')
        const targetName = await specifiedTakeData("Accounts", targetId, "Username")
        console.log(targetId);
        const lastIndex = 0;
        const userId = await getUserId();
        const userName = await specifiedTakeData("Accounts", userId, "Username")
        await set(ref(db, `/Accounts/${userId}/Chats/${newChatId}`), {

            chatType: "discussProduct",
            id: newChatId,
            lastMessage: {
                sender: userId,
                text: message,
                time: new Date().toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
            },
            target: {
                id: targetId,
                name: targetName
            }

        })
        await set(ref(db, `/Accounts/${targetId}/Chats/${newChatId}`), {

            chatType: "discussProduct",
            id: newChatId,
            lastMessage: {
                sender: userId,
                text: message,
                time: new Date().toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
            },
            target: {
                id: userId,
                name: userName
            }

        })
        const msgId = `${String(lastIndex).padStart(6, '0')}-${generateRandomAlphanumeric()}`;
        await set(ref(db, `/Chats/${newChatId}`), {
            chatType: "discussProduct",
            lastIndex: lastIndex,
            participants: {
                [targetId]: targetName,
                [userId]: userName
            },
            unreadCount: 1,
            messages: {
                [msgId]: {
                    id: msgId,
                    senderId: userId,
                    isRead: false,
                    message: message,
                    time: new Date().toLocaleString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }),
                    date: new Date().toLocaleString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    }),
                }
            }
        }).then(async () => {
            await set(ref(db, `/Chats/${newChatId}/lastIndex`), Number(lastIndex) + 1);
            window.location.reload();
        })
    } else {
        console.log("Beton")
        const lastIndex = 0;
        const targetId = await specifiedTakeData("Stores", chatId.split("-")[1], 'UserId')
        const targetName = await specifiedTakeData("Accounts", targetId, "Username")
        const userId = await getUserId();
        const userName = await specifiedTakeData("Accounts", userId, "Username")
        console.table({ target: targetId, user: userId })

        await set(ref(db, `/Accounts/${userId}/Chats/${chatId}`), {

            chatType: "personal",
            id: chatId,
            lastMessage: {
                sender: userId,
                text: message,
                time: new Date().toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
            },
            target: {
                id: targetId,
                name: targetName
            }

        })
        await set(ref(db, `/Accounts/${targetId}/Chats/${chatId}`), {

            chatType: "personal",
            id: chatId,
            lastMessage: {
                sender: userId,
                text: message,
                time: new Date().toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
            },
            target: {
                id: userId,
                name: userName
            }

        })
        const msgId = `${String(lastIndex).padStart(6, '0')}-${generateRandomAlphanumeric()}`;
        await set(ref(db, `/Chats/${chatId}`), {
            chatType: "discussProduct",
            lastIndex: lastIndex,
            participants: {
                [targetId]: targetName,
                [userId]: userName
            },
            unreadCount: 1,
            messages: {
                [msgId]: {
                    id: msgId,
                    senderId: userId,
                    isRead: false,
                    message: message,
                    time: new Date().toLocaleString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }),
                    date: new Date().toLocaleString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    }),
                }
            }
        }).then(async () => {
            await set(ref(db, `/Chats/${chatId}/lastIndex`), Number(lastIndex) + 1);
            window.location.reload();
        })

    }

}

async function isUserHasStore(userId) {
    const storeId = await specifiedTakeData("Accounts", userId, "StoreId");
    if (storeId) {
        return storeId
    } else {
        return null;
    }
}



async function isSelfOwnStore(storeId) {
    const isHave = await specifiedTakeData("Accounts", await getUserId(), "StoreId");
    // console.log(storeData)
    if (isHave === storeId) {
        Swal.fire({
            title: "Peringatan!",
            text: "Tidak dapat menambah milikmu sendiri ke favorit",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Oke",
            timer: 1000,
            timerProgressBar: true,
        });
        return true;
    } else {
        return false
    }
}


export { getDataFromNode, universalDataFunction, universalTakeData, specifiedTakeData, generateCurrentTime, generateRandomAlphanumeric, addProdToFav, addStoreToFav, addTransaction, payNow, setTransToSuccess, autoSuccessTranChecker, chatMessageListener, sendMessage, chatIdValidator, isUserHasStore, setNewTrStatus, checkHasChat, isSelfOwnStore, userChatsListener, addVisitoreStore, setAccountData, registerToSeller, toAddNewProduct }
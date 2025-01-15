import { chatIdValidator, specifiedTakeData, universalTakeData } from "./dataController.jsx";
import { getUserId } from "./webAuth.jsx";

async function getProductsData() {
    try {
        const data = await universalTakeData("Products");
        return data;
    } catch (error) {
        console.error("Error fetching products data:", error);
        return [];
    }
}

async function getStoresData() {
    try {
        const data = await universalTakeData("Stores");
        return data;
    } catch (error) {
        console.error("Error fetching stores data:", error);
        return [];
    }
}

async function getUserData() {
    try {
        const userId = await getUserId();
        if (!userId) return null;
        const data = await universalTakeData(`Accounts/${userId}`);
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

async function getUserChats() {
    try {
        const userId = await getUserId();
        if (!userId) return null;
        const chatData = await universalTakeData(`Accounts/${userId}/Chats`);
        return chatData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

async function getUserChatData(chatId) {
    console.log(chatId)
    try {
        if(await chatIdValidator(chatId)){
            const chatData = await universalTakeData(`Chats/${chatId}`);
            return chatData;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

async function getHistoryData() {
    try {
        const userId = await getUserId();
        if (!userId) return null;
        const transactions = await universalTakeData(`Accounts/${userId}/Transactions`);
        if (!transactions) return null;
        const finalData = {};
        for (const [trid, val] of Object.entries(transactions)) {
            const transactionData = await universalTakeData(`Transactions/${trid}`);
            if (transactionData) {
                
                finalData[trid] = {
                    ...transactionData,
                    Gambar_Produk : await specifiedTakeData("Products", transactionData.Id_Produk, "image"),
                    Rating : await specifiedTakeData("Products", transactionData.Id_Produk, "rating/Rating"),
                };
            }
        }

        return finalData;
    } catch (error) {
        console.error("Error fetching history data:", error);
        return null;
    }
}


async function getStoreData(storeId) {
    try {
        const storeData = await universalTakeData(`Stores/${storeId}`);
        console.log(storeData)
        
        if (!storeData.Products || !storeData.Products.Items) {
            return { StoreData: storeData, StoreProducts: [] };
        }
        const storeProducts = await Promise.all(
            storeData.Products.Items.map(async (productId) => {
                if (!productId) return null;
                return await universalTakeData(`Products/${productId}`);
            })
        );

        return {
            StoreData: storeData,
            StoreProducts: storeProducts.filter(product => product !== null),
        };
    } catch (error) {
        console.error("Error fetching store data:", error);
        return { StoreData: {}, StoreProducts: [] };
    }
}


async function getFavData() {
    try {
        const userId = await getUserId();
        if (!userId) return { FavProducts: [], FavStores: [] };

        const [favProd, favStore] = await Promise.all([
            universalTakeData(`Accounts/${userId}/FavProduct`),
            universalTakeData(`Accounts/${userId}/FavStore`),
        ]);

        const productIds = favProd ? Object.keys(favProd) : [];
        const storeIds = favStore ? Object.keys(favStore) : [];

        const [favProducts, favStores] = await Promise.all([
            Promise.all(
                productIds.map(async (productId) => {
                    return await universalTakeData(`Products/${productId}`);
                })
            ),
            Promise.all(
                storeIds.map(async (storeId) => {
                    return await universalTakeData(`Stores/${storeId}`);
                })
            ),
        ]);

        return {
            FavProducts: favProducts,
            FavStores: favStores,
        };
    } catch (error) {
        console.error("Error fetching favorite data:", error);
        return { FavProducts: [], FavStores: [] };
    }
}

// Mengambil data produk, toko, dan user secara asinkron
const productsData = await getProductsData();
const storesData = await getStoresData();
const userData = await getUserData();
const userChats = await getUserChats();
// const historiesData = await getHistoryData();


// console.log(userChats)




const notificationsData = [
    { id: 1, title: "Pesanan Diproses", message: "Pesanan Anda sedang diproses dan akan segera dikirim.", timestamp: "2025-01-01 09:00", isRead: false, type: "order" },
    { id: 2, title: "Diskon Spesial", message: "Dapatkan diskon 20% untuk produk buah segar hari ini!", timestamp: "2025-01-01 08:30", isRead: false, type: "promo" },
    { id: 3, title: "Pembayaran Berhasil", message: "Pembayaran Anda telah diterima. Terima kasih telah berbelanja!", timestamp: "2025-01-01 08:00", isRead: true, type: "payment" },
    { id: 4, title: "Pengiriman Dimulai", message: "Pesanan Anda sedang dalam perjalanan ke lokasi Anda.", timestamp: "2024-12-31 18:45", isRead: false, type: "delivery" },
    { id: 5, title: "Pesanan Diterima", message: "Pesanan Anda telah diterima. Semoga Anda puas dengan produk kami!", timestamp: "2024-12-31 17:30", isRead: true, type: "order" },
    { id: 6, title: "Notifikasi Sistem", message: "Sistem akan diperbarui pada 2 Januari pukul 03.00 WIB.", timestamp: "2024-12-30 15:00", isRead: true, type: "system" },
    { id: 7, title: "Pengingat Promo", message: "Promo akhir tahun akan segera berakhir! Jangan sampai terlewat.", timestamp: "2024-12-30 10:00", isRead: false, type: "promo" },
    { id: 8, title: "Ulasan Produk", message: "Berikan ulasan Anda untuk pesanan terbaru dan dapatkan poin reward!", timestamp: "2024-12-29 12:30", isRead: true, type: "feedback" },
    { id: 9, title: "Poin Reward", message: "Anda mendapatkan 50 poin reward atas pembelian terbaru Anda.", timestamp: "2024-12-29 10:00", isRead: false, type: "reward" },
    { id: 10, title: "Produk Baru", message: "Produk apel Fuji baru saja tersedia di toko kami!", timestamp: "2024-12-28 14:15", isRead: true, type: "product" },
    { id: 11, title: "Pesanan Gagal", message: "Pesanan Anda gagal diproses karena masalah pembayaran.", timestamp: "2024-12-27 16:00", isRead: true, type: "error" },
    { id: 12, title: "Voucher Anda", message: "Anda memiliki voucher Rp50.000 yang akan segera kadaluarsa.", timestamp: "2024-12-27 08:45", isRead: false, type: "voucher" },
    { id: 13, title: "Selamat Tahun Baru!", message: "Semoga tahun baru ini membawa kebahagiaan dan kesuksesan untuk Anda.", timestamp: "2025-01-01 00:00", isRead: true, type: "greeting" },
    { id: 14, title: "Cek Ongkir", message: "Gratis ongkir untuk pembelian di atas Rp200.000 hari ini saja!", timestamp: "2024-12-26 09:00", isRead: false, type: "promo" },
    { id: 15, title: "Pesanan Dibatalkan", message: "Pesanan Anda telah dibatalkan sesuai permintaan.", timestamp: "2024-12-25 18:00", isRead: true, type: "order" }
];


// Ekspor fungsi dan data
export { productsData, storesData, getUserId, notificationsData,  getStoreData, getFavData,userData, userChats, getHistoryData, getUserChatData, getUserChats};

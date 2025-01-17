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
];


// Ekspor fungsi dan data
export { productsData, storesData, getUserId, notificationsData,  getStoreData, getFavData,userData, userChats, getHistoryData, getUserChatData, getUserChats};

import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { deleteStoreProduct, generateRandomAlphanumeric, specifiedTakeData, toAddNewProduct, universalDataFunction, universalTakeData } from '../dataController';
import { getUserId } from '../webAuth';
import { get, onValue, ref } from 'firebase/database';
import { db } from '../firebaseConfig';

const getDataFromNode = async (pathh) => (await get(ref(db, pathh))).val();

const getStoreId = async () => {
    if (await getUserId() !== null) {
        try {
            const storeId = await specifiedTakeData("Accounts", await getUserId(), "StoreId");
            if (storeId) {
                return storeId;
            }
        } catch (error) {
            console.error("Error fetching user or store data:", error);
        }
    }
    return null;
}

async function StoreProductsData(productIds) {
    if (productIds) {
        const productsData = await Promise.all(
            productIds.map(async (productId) => {
                return await universalTakeData(`Products/${productId}`);
            })
        );
        return productsData
    } else {
        return []
    }
    // console.log(productsObject);
}


async function storeManagementDataFetch(callback) {
    try {
        const userId = await getUserId();
        if (!userId) throw new Error("User not logged in");

        const storeId = await getStoreId();
        if (!storeId) throw new Error("Store ID not found");

        const storeRef = ref(db, `Stores/${storeId}`);
        // Set up listener menggunakan onValue
        const unsubscribe = onValue(storeRef, (snapshot) => {
            const sData = snapshot.val();
            if (!sData) return;

            const storeData = {
                storeId: sData.StoreId || "",
                storeUserId: sData.UserId || "",
                storeThumbnail: sData.StoreThumbnail || "",
                storeName: sData.StoreName || "",
                storeAddr: sData.StoreAddress || "",
                storeCategory: sData.category || "",
                storeDesc: sData.StoreDesc || "",
                storeRating: sData.rating ? sData.rating.rating : 0,
                storeProdTotal: sData.Products ? sData.Products.Total : 0,
                storeSoldCount: sData.dashboard ? sData.dashboard.prSoldCounts : 0,
            };

            const dashboardData = {
                totalSelling: sData.dashboard ? sData.dashboard.totalSellings : 0,
                trSuccessCount: sData.dashboard ? sData.dashboard.trSuccessCount : 0,
                visitor: sData.visitor || 0,
                prSoldCount: sData.dashboard ? sData.dashboard.prSoldCounts : 0,
                totalFollower: sData.follower ? sData.follower.total : 0,
                recentTransactionId: sData.dashboard ? sData.dashboard.recentTransaction.recentTransactionId : "",
                recentIncome: sData.dashboard ? sData.dashboard.recentTransaction.recentIncome : 0,
            };

            const transactionData = sData.Transactions
                ? Object.values(sData.Transactions).map((tra) => ({
                    traId: tra.Id_Transaksi,
                    traIdProd: tra.Id_Produk,
                    traNameProd: tra.Nama_Produk,
                    traTime: tra.Tanggal_Masuk,
                    traCustomerName: tra.Nama,
                    traCustomerId: tra.Id_User,
                    traEnterDate: tra.Tanggal_Masuk,
                    traStatus: tra.status,
                    traSettledTime: tra.recipt ? tra.recipt.settlement_time : "",
                    traTotalPay: tra.Total_Biaya,
                    traPaymentDetail: {
                        traPaymentType: tra.recipt ? tra.recipt.payment_type : "",
                        traVaBank: tra.recipt ? tra.recipt.va_numbers[0].bank : "",
                        traVaNumber: tra.recipt ? tra.recipt.va_numbers[0].va_number : "",
                    },
                }))
                : [];
            const productIds = sData.Products.Items;
            const storeManagementData = {
                storeData,
                dashboardData,
                transactionData,
                productIds,
            };
            console.log(storeManagementData)
            // Kirim data ke callback
            callback(storeManagementData);
        });
        // Kembalikan fungsi unsubscribe
        return unsubscribe;
    } catch (error) {
        console.error("Error setting up listener:", error);
        return null;
    }
}





const handleAddProduct = async (storeName, isEdit, idProd, refreshItem) => {
    let toEditData
    if(isEdit){
        console.log(isEdit)
        toEditData = await universalTakeData(`Products.${idProd}`)
    }
    withReactContent(Swal).fire({
        title: isEdit ? "Edit Data Produk" : '<span class="swal-title">Tambah Produk Baru</span>',
        html: (
            <div className="swal-container" style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                <label htmlFor="productName">Nama Produk</label>
                <input
                    id="productName"
                    className="swal2-input styled-input"
                    placeholder="Masukkan nama produk"
                    defaultValue={toEditData?.name || ""}
                    style={{ margin: "0", width: "100%", marginBottom: "0.5rem" }}
                />
                <label htmlFor="productDesc">Deskripsi</label>
                <input
                    id="productDesc"
                    className="swal2-input styled-input"
                    placeholder="Masukkan tagline"
                    defaultValue={toEditData?.desc || ""}
                    style={{ margin: "0", width: "100%", marginBottom: "0.5rem" }}
                />

                <label htmlFor="productDetail">Detail Produk</label>
                <textarea
                    id="productDetail"
                    className="swal2-textarea styled-input"
                    placeholder="Masukkan Detail produk"
                    defaultValue={toEditData?.detail || ""}
                    style={{ margin: "0", width: "100%", marginBottom: "0.5rem" }}
                ></textarea>


                <label htmlFor="productPrice">Harga Produk</label>
                <input
                    id="productPrice"
                    type="number"
                    className="swal2-input styled-input"
                    placeholder="Masukkan harga"
                    defaultValue={toEditData?.price || ""}
                    style={{ margin: "0", width: "100%", marginBottom: "0.5rem" }}
                />

                <label htmlFor="productQty">Jumlah Per Produk</label>
                <input
                    id="productQty"
                    type="number"
                    className="swal2-input styled-input"
                    placeholder="Contoh 1Kg"
                    defaultValue={Number(toEditData?.quantity?.split("|")[0]) || ""}
                    style={{ margin: "0", width: "100%", marginBottom: "0.5rem" }}
                />

                <label htmlFor="productStock">Jumlah Ketersediaan</label>
                <input
                    id="productStock"
                    type="number"
                    className="swal2-input styled-input"
                    placeholder="Masukkan Stok"
                    defaultValue={toEditData?.stock || ""}
                    style={{ margin: "0", width: "100%", marginBottom: "0.5rem" }}
                />
                <label htmlFor="productImg">Gambar Produk</label>
                <input
                    id="productImg"
                    type="file"
                    className="swal2-input styled-input"
                    placeholder="Pilih Gambar"
                    style={{ margin: "0", width: "100%", marginBottom: "0.5rem", padding: "0", border: "none" }}
                />
            </div>
        ),
        showCancelButton: true,
        confirmButtonText: "Simpan",
        cancelButtonText: "Batal",
        customClass: {
            popup: "swal-popup",
            title: "swal-title",
            confirmButton: "swal-confirm",
            cancelButton: "swal-cancel",
        },
        preConfirm: async () => {
            console.log(document.getElementById("productQty").value);
            console.log(document.getElementById("productStock").value);
            const NewProdData = {
                "desc": document.getElementById("productDesc").value,
                "detail": document.getElementById("productDetail").value,
                "image": document.getElementById("productImg").files[0] || "/public/images/apple-green.jpg",
                "name": document.getElementById("productName").value,
                "price": document.getElementById("productPrice").value,
                "quantity": document.getElementById("productQty").value,
                "stock": document.getElementById("productStock").value,
                "userId": await getUserId(),
                "storeId": await getStoreId(),
                "storeName": storeName
            }

            if (!productName || !productDetail || !productPrice || !productStock || !productQty || !productImg) {
                Swal.showValidationMessage("Harap isi semua bidang yang wajib diisi!");
                return null;
            }

            return toAddNewProduct(NewProdData, isEdit, idProd)
        },
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("Data Produk:", result.value);
            Swal.fire("Produk Disimpan!", "Produk berhasil ditambahkan.", "success");
            refreshItem.current.click()
        }
    });

};

const handleDeleteProduct = async (storeId, prodId, refreshItem) => {
    if (prodId !== null && storeId !== null) {
        console.log("Key = ", prodId)
        Swal.fire({
            title: "Peringatan!",
            text: "Anda Yakin ingin menhapus?",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ya",
            showCancelButton: true,
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteStoreProduct(storeId, prodId, refreshItem)
            }
        });
    }
}

async function storeDataChange(newStoreData, StoreId) {
    await universalDataFunction("update", `Stores/${StoreId}`,
        [
            `StoreName`,
            `StoreAddress`,
            `StoreDesc`,
            `category`,
            `StoreThumbnail`,
        ],
        [
            newStoreData.StoreName,
            newStoreData.Address,
            newStoreData.Desc,
            newStoreData.Category,
            "",
        ]
    )
    const products = await universalTakeData(`Stores/${StoreId}/Products/Items`)
    try {
        if (!products || products.length === 0) {
            console.log("Tidak ada produk untuk diperbarui.");
            return;
        }
        for (const productId of products) {
            await universalDataFunction("update", `Products/${productId}`, 'storeName', newStoreData.StoreName);
            console.log(`Produk ${productId} berhasil diperbarui.`);
        }
        console.log("Semua produk berhasil diperbarui.");
    } catch (error) {
        console.error("Terjadi kesalahan saat memperbarui produk:", error);
    }
    console.log("done");
}


export { storeManagementDataFetch, handleAddProduct, StoreProductsData, storeDataChange, handleDeleteProduct }
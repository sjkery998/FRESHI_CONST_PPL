import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/productDetail.css';
import '../css/webComponents.css';
import { FaMinus, FaPlus, FaStar } from "react-icons/fa";
import { CiLocationOn } from 'react-icons/ci';
import { FaArrowLeft, FaLocationPin, FaBagShopping, FaHeart, FaMessage, FaPhone } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import Transition from "../components/transition.jsx";
import { productsData, storesData, userData } from '../jsx/dataModel.jsx';
import { addProdToFav, addTransaction, generateRandomAlphanumeric, isSelfOwnStore, specifiedTakeData } from '../jsx/dataController.jsx';
import { getUserId } from '../jsx/dataModel.jsx';
import { useAuth } from '../context/auth/authcontext.jsx';

function ProductDetail() {
    const { userLoggedIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const productId = new URLSearchParams(location.search).get('productId');
    const [selectedProduct, setSelectedProduct] = useState(productsData[productId] || null);
    const [quantity, setQuantity] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedCheckbox, setselectedCheckbox] = useState("Kirim Ke Alamat")
    const [isCooldown, setIsCooldown] = useState(false)
    const [isCustomAddress, setIsCustomAddress] = useState(null);
    const [deliveryCost, setDeliveryCost] = useState({
        "Ambil Di Toko": 0,
        "COD": 0,
        "Kirim Ke Alamat": 5000
    })
    const [totalPrice, setTotalPrice] = useState(parseInt((selectedProduct?.price * quantity + 10000 + deliveryCost[selectedCheckbox]) || 0));
    const checkoutData = useMemo(() => {
        return {
            "Id_User": userData ? userData.UserId : "",
            "Nama": userData ? userData.Username : "",
            "Email": userData ? userData.Email : "",
            "Alamat": userData ? isCustomAddress || userData.Address : "",
            "Id_Produk": productId ? productId : "",
            "Nama_Produk": selectedProduct ? selectedProduct.name : "",
            "Kuantitas": selectedProduct ? selectedProduct.quantity : "",
            "Jumlah_Beli": quantity ? quantity : "",
            "Harga_Produk": selectedProduct ? selectedProduct.price : "",
            "Opsi_Pengiriman": selectedCheckbox ? selectedCheckbox : "",
            "Opsi_Pembayaran": selectedOption ? selectedOption.value : "",
            "Biaya_Pengiriman": (selectedCheckbox && deliveryCost) ? deliveryCost[selectedCheckbox] : "",
            "Biaya_Layanan": 10000,
            "Id_Toko": selectedProduct ? selectedProduct.storeId : "",
            "Nama_Toko": selectedProduct ? selectedProduct.storeName : "",
            "status": "pending"
        };
    }, [
        userData,
        selectedProduct,
        quantity,
        totalPrice,
        selectedCheckbox,
        selectedOption,
    ]);

    const handleCheckboxChange = (value) => {
        setselectedCheckbox(value);
    };


    const fetchProductData = async () => {
        if (userLoggedIn) {
            try {

                const isFav = await specifiedTakeData(
                    "Accounts",
                    `${userData !== null ? userData.UserId : null}`,
                    `FavProduct`
                ).then((fav) => fav?.[productId] || false);
                setIsFavorite(isFav);
                const storeAddress = await specifiedTakeData(
                    `Stores`,
                    selectedProduct.storeId,
                    "StoreAddress"
                );
                console.log(storeAddress)
                const storeItemCount = await specifiedTakeData(
                    `Stores`,
                    selectedProduct.storeId,
                    "Products/Total"
                );
                setSelectedProduct((prevProduct) => ({
                    ...prevProduct,
                    StoreAddress: storeAddress,
                    TotalProduct: storeItemCount,
                }));
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        } else {
            try {
                const storeAddress = await specifiedTakeData(
                    `Stores`,
                    selectedProduct.storeId,
                    "StoreAddress"
                );
                console.log(storeAddress)
                const storeItemCount = await specifiedTakeData(
                    `Stores`,
                    selectedProduct.storeId,
                    "Products/Total"
                );
                setSelectedProduct((prevProduct) => ({
                    ...prevProduct,
                    StoreAddress: storeAddress,
                    TotalProduct: storeItemCount,
                }));
            } catch {
                console.error("Error fetching product data:", error);
            }
        }
    };


    const toDetailProduct = (event) => {
        const productId = event.target.closest('.productCase').id.split('-')[1];
        navigate(`/ProductDetail?productId=${productId}`);
        setSelectedProduct(productsData[productId]);
    };

    const toDetailStore = (event) => {
        const storeId = event.target.closest(".detailStore").id.split('-')[1];
        console.log("Navigating to store:", storeId);
        navigate(`/StoreDetail?storeId=${storeId}`);
    };


    const toggleFavorite = async () => {
        if (userLoggedIn) {
            console.log(selectedProduct.storeId)
            const itSelfProd = await isSelfOwnStore(selectedProduct.storeId)
            if (itSelfProd) {
                console.log("produkmu");
                return;
            } else {
                try {
                    setIsFavorite((prev) => !prev);
                    await addProdToFav(`${await getUserId()}`, productId, !isFavorite);
                } catch (error) {
                    console.error("Error toggling favorite:", error);
                }
            }
        } else {
            Swal.fire({
                title: "Peringatan!",
                text: "Login untuk menambah produk ke favorit",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Oke",
                timer: 1000,
                timerProgressBar: true,
            });
        }
    };

    const handleChcekout = () => {
        if (isCooldown) {
            Swal.fire({
                title: "Peringatan!",
                text: "Tunggu Sebentar Lagi",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Oke",
                timer: 1000,
                timerProgressBar: true,
            });
            setTimeout(() => {
                setIsCooldown(false);
                console.log("Cooldown selesai! Anda bisa menekan tombol lagi.");
            }, 1000);
            return;
        }
        setIsCooldown(true);
        Swal.fire({
            title: "Berhasil Di Pesan",
            text: "Silahkan Lakukan Pembayaran",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Oke",
            timer: 2000,
            timerProgressBar: true,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/history";
            }
            window.location.href = "/history";
        });
        addTransaction(checkoutData).then((dtran) => {
            console.table(dtran)
            setTimeout(() => {
                setIsCooldown(false);
                console.log("Cooldown selesai! Anda bisa menekan tombol lagi.");
            }, 1000);
        });

    }

    const handleBuyClick = async () => {
        if (userLoggedIn) {
            const itSelfProd = await isSelfOwnStore(selectedProduct.storeId)
            if (itSelfProd) {
                Swal.fire({
                    title: "Toko Anda!",
                    text: "Tak dapat membeli toko sendiri",
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "oke",
                })
            } else {
                setIsNavExpanded(!isNavExpanded);
            }
        } else {
            Swal.fire({
                title: "Peringatan!",
                text: "Login untuk melakukan pembelian",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Iya",
                cancelButtonColor: "red",
                cancelButtonText: "Nanti",
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.setItem("lastBeforeLogin", window.location.href);
                    window.location.href = "/AuthWebPage";
                }
            });
        }
    };
    function changeTotalPrice() {
        setTotalPrice(parseInt((selectedProduct?.price * quantity + 10000 + deliveryCost[selectedCheckbox]) || 0))
    }
    const handleIncrease = () => {
        setQuantity((prev) => {
            const newQuantity = prev + 1;
            setTotalPrice(
                parseInt(
                    ((selectedProduct?.price || 0) * newQuantity + 10000 + (deliveryCost[selectedCheckbox] || 0)) || 0,
                    10
                )
            );
            return newQuantity;
        });
    };

    const handleDecrease = () => {
        setQuantity((prev) => {
            const newQuantity = prev > 1 ? prev - 1 : 1;
            setTotalPrice(
                parseInt(
                    ((selectedProduct?.price || 0) * newQuantity + 10000 + (deliveryCost[selectedCheckbox] || 0)) || 0,
                    10
                )
            );
            return newQuantity;
        });
    };

    const toggleDetails = () => setIsExpanded(!isExpanded);

    const handleBack = () => {
        if (location.state?.fromStore) {
            navigate(-1);
        } else if (location.state?.fromAuth) {
            navigate('/product');
        } else if (location.state?.fromHistory) {
            navigate(-1);
        } else if (location.state?.fromFavorite) {
            navigate(-1);
        } else if (location.state?.fromChatting) {
            navigate(-1);
        } else {
            navigate('/product');
        }
    };

    const handleChange = (newValue) => setSelectedOption(newValue);


    
    useEffect(() => {
        fetchProductData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log("Current productId:", productId);
    }, [userLoggedIn, productId, location]);

    return (
        <>
            <Transition />
            <div>
                <div className="simpleHeaderPage" style={{ borderBottom: isNavExpanded ? "1px solid grey" : "" }}>
                    <FaArrowLeft onClick={isNavExpanded ? handleBuyClick : handleBack} style={{ cursor: 'pointer' }} />
                    <b>Details</b>
                    <FaHeart
                        onClick={() => { console.log(isFavorite); toggleFavorite(); }}
                        style={{
                            cursor: 'pointer',
                            color: isFavorite ? 'red' : 'black',
                        }}
                    />
                </div>
                <div className="ProductsDetailsPage" style={{ display: isNavExpanded ? 'none' : '', }}>
                    <div className="mainDetailSection">
                        <div className="detailProdImage">
                            <img src="/images/apple-green.jpg" alt="" />
                        </div>
                        <div className="detailProduct">
                            <div className="buyCounter">
                                <b>Rp.{selectedProduct.price}</b>
                                <FaMinus className='minBuyC' onClick={handleDecrease} />
                                <b style={{ padding: "0 0.5rem" }}>{quantity}Kg</b>
                                <FaPlus className='plusBuyC' onClick={handleIncrease} />
                            </div>
                            <div className="nameDetailsProduct">
                                <b>{selectedProduct.name}</b>
                                <div className="detailRating">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <b>4.5</b>
                                </div>
                            </div>
                        </div>

                        <div className="detailStore" id={"store-" + selectedProduct.storeId}>
                            <div className="detailStoreImage">
                                <img src="/images/storeAvatar.png" alt="" />
                            </div>
                            <div className="nameDetailStore">
                                <b>{selectedProduct.storeName}</b>
                                <p><CiLocationOn />{selectedProduct.StoreAddress}</p>
                            </div>
                            <b className='visitStore' onClick={toDetailStore}>Kunjungi Toko</b>
                        </div>
                        <div className="fuseushguk" style={{
                            fontSize: "0.8rem",
                        }}>
                            <div className="storeReputation">
                                <b>Reputasi Toko</b>
                                <p>Baik</p>
                            </div>
                            <div className="storeProductsCount">
                                <b>Jumlah Produk</b>
                                <p>{selectedProduct.TotalProduct}++</p>
                            </div>
                        </div>
                        <div className="mainDetailsProduct"
                            style={{
                                maxHeight: isExpanded ? 'none' : '7rem',
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease',
                            }}>
                            <b>Detail Produk</b>
                            <p>{selectedProduct.desc}</p>
                            <p>Jeruk Blewah kami adalah pilihan terbaik bagi Anda yang mencari buah segar
                                dengan rasa manis dan segar alami. Dipanen langsung dari kebun petani lokal,
                                jeruk blewah ini memiliki kandungan air yang tinggi, cocok untuk menghilangkan
                                dahaga dan menambah asupan vitamin C harian Anda. Rasanya yang segar sangat
                                ideal dinikmati langsung atau dijadikan jus yang menyegarkan.
                                <br /><br />
                                Asal Produk : Lampung<br />
                                Manfaat : <br />
                                - Menyegarkan Tubuh<br />
                                - Mengandug Banyak Vitamin<br />
                                - Baik Untuk Kesehatan<br />
                                <br />
                                Silahkan Hubungi Penjual Terlebih Dahulu untuk mengonfirmasi
                            </p>
                        </div>
                        <b
                            style={{
                                padding: "1rem 0 0 1rem",
                                color: "blue",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                            }}
                            onClick={toggleDetails}
                        >
                            {isExpanded ? 'Sembunyikan' : 'Selengkapnya'}
                        </b>
                        <br />
                        <div className="separator"></div>
                        <div className="newProduct storeProducts">
                            <div className="headline">
                                <div className="title" style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "400"
                                }}>Mungkin Anda Suka</div>
                                <div className="viewAll">Selengkapnya</div>
                            </div>
                            <div className="contents">
                                {Object.entries(productsData).map(([key, product]) => (
                                    <div className="productCase" key={key + 'm'} id={"new-" + product.id} onClick={toDetailProduct}>
                                        <div className="imageCase" style={{ backgroundImage: `url(${product.image})` }}></div>
                                        <div className="details">
                                            <b>{product.name}</b>
                                            <div className="priceRating">
                                                <div className="price">
                                                    <p>{String(product.quantity).split("|")[0]}Kg</p>
                                                    <p>Rp.{product.price}</p>
                                                </div>
                                                <div className="rating">
                                                    <FaStar style={{ color: "orange" }} />
                                                    <p>{product.rating.Rating}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div >

                <div className="detailBottomNav"
                    style={{
                        height: isNavExpanded ? '100%' : '',
                        overflow: "hidden",
                        top: isNavExpanded ? '54px' : '',
                        overflowY: "scroll"
                    }}
                >
                    <div style={{
                        display: isNavExpanded ? 'block' : 'none',
                        height: "100%",
                    }}>
                        <div className="closeCheckOut">
                            Detail Pemesanan
                            <b style={{ lineHeight: "0", display: "flex", flexDirection: "row", alignItems: "center" }} onClick={handleBuyClick} >Tutup</b>
                        </div>
                        <div className="separator"></div>
                        <div className="coDeliveryCase">
                            <div className='coDelivery'>
                                <b>Kirim Ke Alamat</b>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <p style={{ lineHeight: "0", padding: "0", margin: "0" }}>Rp.{deliveryCost['Kirim Ke Alamat']}</p>
                                    <input
                                        type="checkbox"
                                        name="coDelivery"
                                        id=""
                                        value="Kirim Ke Alamat"
                                        checked={selectedCheckbox === "Kirim Ke Alamat"}
                                        onChange={() => handleCheckboxChange("Kirim Ke Alamat")}

                                    />
                                </div>
                            </div>
                            <div className='coTakeAway'>
                                <b>Ambil Di Toko</b>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <p>Rp.{deliveryCost['Ambil Di Toko']}</p>
                                    <input
                                        type="checkbox"
                                        name="coDelivery"
                                        id=""
                                        value="Ambil Di Toko"
                                        checked={selectedCheckbox === "Ambil Di Toko"}
                                        onChange={() => handleCheckboxChange("Ambil Di Toko")}

                                    />
                                </div>
                            </div>
                            <div className='coCOD'>
                                <b>COD</b>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <p>Rp.{deliveryCost["COD"]}</p>
                                    <input
                                        type="checkbox"
                                        name="coDelivery"
                                        id=""
                                        value="COD"
                                        checked={selectedCheckbox === "COD"}
                                        onChange={() => handleCheckboxChange("COD")}

                                    />
                                </div>
                            </div>
                        </div>

                        <div className="coAddressCase">
                            <div className="coAddressHeading">
                                <div>
                                    <p className='coYourLocation'>Lokasi Anda</p>
                                </div>
                                <b className='coChangeAddress'
                                    onClick={() => {
                                        Swal.fire({
                                            title: "Alamat",
                                            input: "text",
                                            inputLabel: "Sesuaikan Alamat",
                                            inputPlaceholder: "Masukan Alamat",
                                            showCancelButton: true,
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                setIsCustomAddress(result.value);

                                            }
                                        });
                                    }}
                                >Custom Alamat</b>
                            </div>
                            <p className="coAccdressDetails">
                                <FaLocationPin />
                                {userData ? isCustomAddress || userData.Address : "pilih lokasi"}
                            </p>
                        </div>
                        <div className="separator"></div><br />
                        <div className="coProductDetailCase">
                            <div className='coProdHead'>
                                <div className='coProdPrice'>
                                    <b>{selectedProduct.name}</b>
                                    <b>{String(selectedProduct.quantity).split("|")[0]}Kg = Rp.{selectedProduct.price}</b>
                                </div>
                                <div className='coProdImage'>
                                    <img src="/images/apple-green.jpg" alt="" />
                                </div>
                            </div>
                            <div className="coProdCounter">
                                <FaMinus className='minBuyC' onClick={handleDecrease} />
                                <b style={{ padding: "0 0.5rem" }}>{quantity}Kg</b>
                                <FaPlus className='plusBuyC' onClick={handleIncrease} />
                            </div>
                            <div className="coAddMoreProd">
                                <div className="addMoreTexts">
                                    <b>Tambah Produk?</b>
                                    <p>Pilih Produk Lain Untuk Di Tambahkan</p>
                                </div>
                                <b className='coAddMoreButton'><FaPlus /></b>
                            </div>
                        </div>
                        <br />
                        <div className="separator"></div>

                        <div className="coSummaryCase" style={{ marginBottom: isNavExpanded ? '130px' : '', }}>
                            <div className='coSummaryProd'>
                                <b>Harga Produk</b>
                                <p>Rp.{selectedProduct.price}</p>
                            </div>
                            <div className='coSummaryJasa'>
                                <b>Biaya Penanganan</b>
                                <p>Rp.10000</p>
                            </div>
                            <div className='coSummaryJasa'>
                                <b>Biaya Pengiriman</b>
                                <p>Rp.{deliveryCost[selectedCheckbox]}</p>
                            </div>
                            <div className='coSummaryProdCounts'>
                                <b>Jumlah Beli</b>
                                <p>{quantity}</p>
                            </div>
                            <div className='coSumaryDiscount'>
                                <b>Diskon</b>
                                <p>0</p>
                            </div>
                            <div className="separator"></div>
                            <div className='coSummaryFinalCase'>
                                <b>Total Pembayaran</b>
                                <p className='coFinalPrice'>{`Rp.${totalPrice}`}</p>
                            </div>
                        </div>

                        <br />
                    </div>
                    <div className='checkOutBtnCase' style={{
                        position: isNavExpanded ? "fixed" : "",
                        bottom: isNavExpanded ? "0" : "",
                        left: isNavExpanded ? "0" : "",
                        width: isNavExpanded ? "calc(100% - 2rem)" : "",
                        borderRadius: isNavExpanded ? "1rem 1rem 0 0" : "",
                        padding: isNavExpanded ? "0.5rem 1rem" : '',
                        borderTop: isNavExpanded ? "1px solid grey" : '',
                        backgroundColor: isNavExpanded ? "white" : '',
                    }}>
                        <div className="totalBuyPrice">
                            <p style={{
                                padding: '0',
                                margin: '0',
                                fontWeight: '600',
                            }}
                            >Total Pembayaran</p>
                            <b>{`Rp.${totalPrice}`}</b>
                        </div>
                        <div className="checkOutButton" style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={async () => {
                                if (userLoggedIn) {
                                    const itSelfProd = await isSelfOwnStore(selectedProduct.storeId)
                                    if (itSelfProd) {
                                        Swal.fire({
                                            title: "Toko Anda!",
                                            text: "Tak dapat mengirim pesan",
                                            icon: "warning",
                                            confirmButtonColor: "#3085d6",
                                            confirmButtonText: "oke",
                                        })
                                    } else {
                                        navigate(`/ChattingPage?discussProd-${productId}-${selectedProduct.storeId}-${selectedProduct.name}-${generateRandomAlphanumeric()}`)
                                    }
                                } else {
                                    Swal.fire({
                                        title: "Peringatan!",
                                        text: "Login untuk mengirim pesan",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        confirmButtonText: "Iya",
                                        cancelButtonColor: "red",
                                        cancelButtonText: "Nanti",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            sessionStorage.setItem("lastBeforeLogin", window.location.href);
                                            window.location.href = "/AuthWebPage";
                                        }
                                    });
                                }
                            }}
                        >
                            <FaMessage />
                            <b>Chat</b>
                        </div>
                        <div className="checkOutButton" onClick={() => { isNavExpanded ? handleChcekout() : handleBuyClick() }}>
                            <FaBagShopping />
                            <b>{isNavExpanded ? "Lanjutkan" : "Beli"}</b>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail
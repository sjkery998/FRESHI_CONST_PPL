import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaCheck, FaCross, FaFileInvoice, FaFolder, FaLocationPin, FaMagnifyingGlass, FaPen, FaPlus, FaReceipt, FaStore, FaTrash, FaX } from 'react-icons/fa6';
import { FaLemon, FaStar } from 'react-icons/fa';
import Transition from '../components/transition.jsx';
import { useAuth } from '../context/auth/authcontext.jsx';
import '../css/storeDetail.css';
import '../css/storeManagement.css';
import { TbReload } from 'react-icons/tb';
import { MdSpaceDashboard } from 'react-icons/md';
import { handleAddProduct, handleDeleteProduct, storeDataChange, storeManagementDataFetch, StoreProductsData } from '../jsx/storeManagement/storeManagement.jsx';
import Swal from 'sweetalert2';
import { setTraToFinish } from '../jsx/dataController.jsx';

function StoreManagement() {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsloading] = useState(true);
    const [storeDataM, setStoreDataM] = useState(null);
    const [prodDataM, setProdDataM] = useState(null);
    const [selectedNavItem, setSelectedNavItem] = useState("Dashboard");
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [toPreviewTra, setToPreviewTra] = useState(
        {
            "isShow": false,
            "Id Transaksi": "",
            "Nama Pembeli": "",
            "Tanggal Masuk": "",
            "Id Produk": "",
            "Nama Produk": "",
            "Pembayaran Via": "",
            "Rekening Va": "",
            "Total Biaya": "",
            "Pembayaran Selesai": "",
            "Status": "",
            "StoreId": ""
        }
    )
    const [toPreview, setToPreview] = useState({
        isPreview: false,
        index: 0
    });
    const submitFormStore = useRef(null);
    const nameStoreRef = useRef(null)
    const [navPosition, setNavPosition] = useState("dashboard");
    const navItemRef = useRef({
        Dashboard: useRef(null),
        Transaction: useRef(null),
        Products: useRef(null),
        StoreData: useRef(null),
        Invoice: useRef(null)
    });
    const [formStoreData, setformStoreData] = useState({
        "StoreName": "",
        "Category": "",
        "Desc": "",
        "Address": "",
        "BannerImg": null,
    });

    useEffect(() => {
        const unsubscribe = storeManagementDataFetch((data) => {
            setStoreDataM(data);
            setIsloading(false);
        });

        return () => {
            if (unsubscribe) {
                unsubscribe;
                console.log("Listener stopped");
            }
        };
    }, []);

    useEffect(() => {
        document.body.style.paddingBottom = "0"
        return () => document.body.style.paddingBottom = "5rem"
    }, []);

    const handleBack = () => {
        navigate('/Profile')
    };

    function addNewProduct(isEdit, idProd, refreshItem) {
        handleAddProduct(storeDataM.storeData.storeName, isEdit, idProd, refreshItem);
    }

    function navItemClicked(navItem) {
        if (storeDataM !== null && navItem.target.closest(".manageOptions").id === "Products") {
            async function testt() {
                const prod = await StoreProductsData(storeDataM.productIds);
                setProdDataM(prod)
                console.log(prod)
                console.log(storeDataM?.transactionData)
            }
            testt()
        } else if (storeDataM !== null && navItem.target.closest(".manageOptions").id === "StoreData") {
            console.log(storeDataM?.storeData)
            setformStoreData({
                "StoreName": storeDataM?.storeData?.storeName || "",
                "Category": storeDataM?.storeData?.storeCategory || "",
                "Desc": storeDataM?.storeData?.storeDesc || "",
                "Address": storeDataM?.storeData?.storeAddr || "",
                "BannerImg": storeDataM?.storeData?.storeThumbnail || null,
            })

            console.log(formStoreData)
        }
        console.log(navItem.target.closest(".manageOptions").id)
        setSelectedNavItem(navItem.target.closest(".manageOptions").id)
    }

    const [trPage, setTrPage] = useState("PesananMasuk");
    const [currentSlide, setCurrentSlide] = useState(1);
    const itemsPerSlide = 15;
    const maxPageDisplay = 5;
    const [isDataReady, setIsDataReady] = useState(false);
    const [currentItems, setCurrentItems] = useState(null);
    const [totalSlides, setTotalSlides] = useState(0);

    useEffect(() => {

        if ((selectedNavItem === "Transactions" && storeDataM?.transactionData) ||
            (selectedNavItem === "Products" && prodDataM)) {
            setIsDataReady(true);
        }
        sessionStorage.setItem("formStoreData", JSON.stringify(formStoreData));
    }, [storeDataM, prodDataM, selectedNavItem]);


    useEffect(() => {
        if (isDataReady) {
            const indexOfLastItem = currentSlide * itemsPerSlide;
            const indexOfFirstItem = indexOfLastItem - itemsPerSlide;
            const items = selectedNavItem === "Transactions"
                ? storeDataM?.transactionData?.slice(indexOfFirstItem, indexOfLastItem)
                : prodDataM?.slice(indexOfFirstItem, indexOfLastItem);

            setCurrentItems(items);
            const total = Math.ceil(
                (selectedNavItem === "Transactions" ? storeDataM?.transactionData?.length : prodDataM?.length) / itemsPerSlide
            );
            setTotalSlides(total);
        }
    }, [isDataReady, selectedNavItem, storeDataM, prodDataM, currentSlide]);

    const startSlide = isDataReady ? Math.max(1, currentSlide - Math.floor(maxPageDisplay / 2)) : 1;
    const endSlide = isDataReady ? Math.min(totalSlides, startSlide + maxPageDisplay - 1) : 1;

    const slides = [];
    if (isDataReady && totalSlides > 0) {
        for (let i = startSlide; i <= endSlide; i++) {
            slides.push(i);
        }
    }

    const changePage = (toPage) => {
        const selectedPage = toPage.target.id;
        setTrPage(selectedPage);
    };

    const goToNextSlide = () => {
        if (currentSlide < totalSlides) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const goToPreviousSlide = () => {
        if (currentSlide > 1) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const goToSlide = (page) => {
        setCurrentSlide(page);
    };

    if (isLoading) {
        return (<center> Tunggu Dulu</center>)
    }
    return (
        <>
            <Transition />
            <div className="StoreDetailLogoCase">
                <FaArrowLeft style={{ fontSize: "1.2rem", cursor: 'pointer' }} onClick={handleBack} />
                <b>Management Toko</b>
                <TbReload style={{ fontSize: "1.2rem", cursor: 'pointer' }} onClick={handleBack} />
            </div>
            <div className="StoreDetailsPage" style={{ height: window.innerHeight }}>
                <div className="mainStorCase">
                    <div className="storeBackgroudCase">
                        <img src="/images/storeBack.png" alt="" />
                    </div>
                    <div className="storeDetailCase">
                        <div className="storeDetailAvatar">
                            <img src="/images/storeAvatar.png" alt="" />
                        </div>
                        <div className='storeDetailHeadCase'>
                            <div className="storeDetailHeadline">
                                <b>{storeDataM?.storeData?.storeName}</b>
                                <p>{storeDataM?.storeData?.storeDesc}</p>
                                <p><FaLocationPin />{storeDataM?.storeData?.storeAddr}</p>
                            </div>
                        </div>
                        <div className='storeManageOptions'>
                            <div className="storeDetailHeadline manageOptions" style={{color: navPosition === "Dashboard" ? "rgb(101, 213, 103)" : "white" }} id='Dashboard' ref={navItemRef.current.Dashboard} onClick={(e) => { navItemClicked(e);setNavPosition(e.target.closest(".manageOptions").id) }}>
                                <MdSpaceDashboard />
                                <p>Dashboard</p>
                            </div>
                            <div className="storeDetailHeadline manageOptions" style={{color: navPosition === "Transactions" ? "rgb(101, 213, 103)" : "white" }} id='Transactions' ref={navItemRef.current.Transaction} onClick={(e) => { navItemClicked(e); setNavPosition(e.target.closest(".manageOptions").id) }}>
                                <FaReceipt />
                                <p>Transaksi</p>
                            </div>
                            <div className="storeDetailHeadline manageOptions" style={{color: navPosition === "Products" ? "rgb(101, 213, 103)" : "white" }} id='Products' ref={navItemRef.current.Products} onClick={(e) => { navItemClicked(e);setNavPosition(e.target.closest(".manageOptions").id) }}>
                                <FaFolder />
                                <p>Produk</p>
                            </div>
                            <div className="storeDetailHeadline manageOptions" style={{color: navPosition === "StoreData" ? "rgb(101, 213, 103)" : "white" }} id='StoreData' ref={navItemRef.current.StoreData} onClick={(e) => { navItemClicked(e);setNavPosition(e.target.closest(".manageOptions").id) }}>
                                <FaStore />
                                <p>Data Toko</p>
                            </div>
                            <div className="storeDetailHeadline manageOptions" style={{color: navPosition === "Invoice" ? "rgb(101, 213, 103)" : "white" }} id='Invoice' ref={navItemRef.current.Invoice} onClick={(e) => { navItemClicked(e);setNavPosition(e.target.closest(".manageOptions").id) }}>
                                <FaFileInvoice />
                                <p>Invoice</p>
                            </div>
                        </div>
                        <div className="storeDetailInfo">
                            <div>
                                <b>Kategori Produk</b>
                                <p>{storeDataM?.storeData?.storeCategory}</p>
                            </div>
                            <div className="lineSeparator"></div>
                            <div>
                                <b>Rating</b>
                                <p><FaStar /> {storeDataM?.storeData?.storeRating}</p>
                            </div>
                            <div className="lineSeparator"></div>
                            <div>
                                <b>Produk</b>
                                <p>{storeDataM?.storeData?.storeProdTotal}</p>
                            </div>
                            <div className="lineSeparator"></div>
                            <div>
                                <b>Terjual</b>
                                <p>{storeDataM?.storeData?.storeSoldCount}</p>
                            </div>
                        </div>
                        <div className="storeSearchCase">
                            <div className="sSearchBox">
                                <FaMagnifyingGlass className='sSboxMag' />
                                <input type="text" placeholder='Cari' style={{ padding: "0.5rem 2.5rem" }} />
                                <FaLemon className='sSboxLemon' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="containerManagement">
                    <div className="dashManagement" style={{ display: selectedNavItem === "Dashboard" ? "" : "none" }}>
                        <b className="dashMTitle">
                            Dashboard
                        </b>
                        <div className="dashMContainer">
                            <div className="dashMTotalIncome">
                                <b>Penghasilan Penjualan</b>
                                <h2>Rp {storeDataM?.dashboardData?.totalSelling}</h2>
                                <p>Uang Masuk +Rp.{storeDataM?.dashboardData?.recentIncome}</p>
                            </div>
                            <div className="dashMGraphStat">
                                <div className="dashMGraphCase" style={{ backgroundColor: "blue" }}>
                                    <b>Transaksi Sukes</b>
                                    <div className='mGrapCounts'><h1>{storeDataM?.dashboardData?.trSuccessCount}</h1> <FaArrowUp /> </div>
                                </div>
                                <div className="dashMGraphCase" style={{ backgroundColor: "purple" }}>
                                    <b>Produk Terjual</b>
                                    <div className='mGrapCounts'><h1>{storeDataM?.dashboardData?.prSoldCount}</h1> <FaArrowUp /></div>
                                </div>
                            </div>
                            <div className="dashMGraphStat">
                                <div className="dashMGraphCase" style={{ backgroundColor: "green" }}>
                                    <b>Toko dikunjungi</b>
                                    <div className='mGrapCounts'><h1>{storeDataM?.dashboardData?.visitor}</h1> <FaArrowUp /> </div>
                                </div>
                                <div className="dashMGraphCase" style={{ backgroundColor: "orange" }}>
                                    <b>Follower</b>
                                    <div className='mGrapCounts'><h1>{storeDataM?.dashboardData?.totalFollower}</h1> <FaArrowUp /></div>
                                </div>
                            </div>
                            <br />
                            <div className="separator"></div>
                            <div className="recentIncominTr">
                                <p>Baru saja</p>
                                <p>Transaksi Masuk : {storeDataM?.dashboardData?.recentTransactionId}</p>
                            </div>
                        </div>
                    </div>
                    <div className="trManagement" style={{ display: selectedNavItem === "Transactions" ? "" : "none" }}>
                        <b className="trTitle">Permintaan Pesanan</b>
                        <div className="trHeading">
                            <div className="trItems" style={{color: trPage === "PesananMasuk" ? "rgb(101, 213, 103)" : "black" }} id='PesananMasuk' onClick={(e) => { changePage(e) }}>Masuk</div>
                            <div className="trItems" style={{color: trPage === "Dibatalkan" ? "rgb(101, 213, 103)" : "black" }} id='Dibatalkan' onClick={(e) => { changePage(e) }}>Dibatalkan</div>
                            <div className="trItems" style={{color: trPage === "Selesai" ? "rgb(101, 213, 103)" : "black" }} id='Selesai' onClick={(e) => { changePage(e) }}>Selesai</div>
                        </div>
                        <div className="trContainer">
                            {selectedNavItem === "Transactions" && (
                                ["PesananMasuk", "Dibatalkan", "Selesai"].includes(trPage) ? (
                                    currentItems?.filter(transaction => {
                                        if (trPage === "PesananMasuk") return transaction?.traStatus === "diproses";
                                        if (trPage === "Dibatalkan") return transaction?.traStatus === "dibatalkan";
                                        if (trPage === "Selesai") return transaction?.traStatus === "selesai";
                                        return false;
                                    }).length > 0 ? (
                                        currentItems
                                            .filter(transaction => {
                                                if (trPage === "PesananMasuk") return transaction?.traStatus === "diproses";
                                                if (trPage === "Dibatalkan") return transaction?.traStatus === "dibatalkan";
                                                if (trPage === "Selesai") return transaction?.traStatus === "selesai";
                                                return false;
                                            })
                                            .map((transaction, index) => (
                                                <div className="trCards" key={index} onClick={() => {
                                                    setToPreviewTra({
                                                        "isShow": true,
                                                        "Id Transaksi": transaction?.traId,
                                                        "Id Pembeli": transaction?.traCustomerId,
                                                        "Nama Pembeli": transaction?.traCustomerName,
                                                        "Tanggal Masuk": transaction?.traEnterDate,
                                                        "Id Produk": transaction?.traIdProd,
                                                        "Nama Produk": transaction?.traNameProd,
                                                        "Pembayaran Via": transaction?.traPaymentDetail.traPaymentType,
                                                        "Rekening Va": transaction?.traPaymentDetail.traVaBank,
                                                        "Total Biaya": transaction?.traPaymentDetail.traVaNumber,
                                                        "Pembayaran Selesai": transaction?.traSettledTime,
                                                        "Status": transaction?.traStatus,
                                                        "StoreId": storeDataM?.storeData?.storeId,
                                                    })

                                                }}>
                                                    <div className="trCardMain">
                                                        <b>#{transaction?.traId}</b>
                                                        <p>
                                                            Pembayaran:{" "}
                                                            {transaction?.traStatus === "diproses"
                                                                ? "Berhasil"
                                                                : transaction?.traStatus === "dibatalkan"
                                                                    ? "Dibatalkan"
                                                                    : "Selesai"}
                                                        </p>
                                                        <p>Status: {transaction?.traStatus || "Tidak diketahui"}</p>
                                                    </div>
                                                    <div className="trCardEnd">
                                                        <b>Detail</b>
                                                        <p>{transaction?.traSettledTime || "Belum selesai"}</p>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <center>Tidak Ada Data</center>
                                    )
                                ) : (
                                    <center>Tidak Ada Data</center>
                                )
                            )}


                        </div>
                        {isDataReady && selectedNavItem === "Transactions" && totalSlides > 0 && (
                            <div className="trPaging">
                                <div className="trPageNumCase">

                                    {[...Array(Math.min(totalSlides, 5)).keys()].map((pageIndex) => (
                                        <div
                                            key={pageIndex + 1}
                                            className={`trPageNums ${currentSlide === pageIndex + 1 ? "active" : ""}`}
                                            onClick={() => goToSlide(pageIndex + 1)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {pageIndex + 1}
                                        </div>
                                    ))}


                                    {totalSlides > 5 && currentSlide <= 5 && (
                                        <div
                                            className="trPageNums"
                                            style={{ cursor: "default" }}
                                        >
                                            ...
                                        </div>
                                    )}


                                    {totalSlides > 5 && currentSlide > 5 && (
                                        <div
                                            className={`trPageNums ${currentSlide === totalSlides ? "active" : ""}`}
                                            onClick={() => goToSlide(currentSlide)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {currentSlide}
                                        </div>
                                    )}
                                </div>

                                <div className="trPageActions">
                                    <div
                                        className={`trPageActionsItems ${currentSlide === 1 ? "disabled" : ""}`}
                                        onClick={goToPreviousSlide}
                                        style={{ cursor: currentSlide === 1 ? "not-allowed" : "pointer" }}
                                    >
                                        <FaArrowLeft />
                                    </div>
                                    <div
                                        className={`trPageActionsItems ${currentSlide === totalSlides ? "disabled" : ""}`}
                                        onClick={goToNextSlide}
                                        style={{ cursor: currentSlide === totalSlides ? "not-allowed" : "pointer" }}
                                    >
                                        <FaArrowRight />
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                    <div className="prodManagement" style={{ display: selectedNavItem === "Products" ? "" : "none" }}>
                        <div className="prodMHead">
                            <div className="prodMheadTitle">
                                <b>Produk</b>
                            </div>
                            <div className="prodMHeadActions">
                                <FaPlus className="MHeadActions" onClick={() => { addNewProduct(false) }}></FaPlus>
                                <FaCheck className="MHeadActions" onClick={() => { console.log(currentItems) }}></FaCheck>
                            </div>
                        </div>
                        <div className="prodMContainer">
                            {selectedNavItem === "Products" && currentItems?.length > 0 ? (
                                currentItems
                                    .filter(product => product && product.id && product.name)
                                    .map((product, index) => (
                                        <div key={index + "-prod-" + product.id} className="prodCards">
                                            <div className="prodCardMain">
                                                <b>{product.name}</b>
                                                <p>Kode : {product.id}</p>
                                                <p>Perlihat : {product.status ? 'Aktif' : 'Aktif'}</p>
                                            </div>
                                            <div className="prodCardEnd">
                                                <b onClick={
                                                    () => {
                                                        setToPreview({
                                                            isPreview: true,
                                                            index: index
                                                        })
                                                    }
                                                }>Lihat</b>
                                                <div className="prodCardActions">
                                                    <FaPen className="pCardActions" style={{ color: "white" }} onClick={() => { addNewProduct(true, product.id, navItemRef.current.Products) }} />
                                                    <FaTrash className="pCardActions" style={{ color: "red" }}
                                                        onClick={async () => {
                                                            await handleDeleteProduct(storeDataM?.storeData?.storeId, product.id, navItemRef.current.Products)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p>Tidak ada produk yang tersedia.</p>
                            )}
                        </div>


                        {isDataReady && selectedNavItem === "Products" && totalSlides > 0 && (
                            <div className="trPaging">
                                <div className="trPageNumCase">

                                    {[...Array(Math.min(totalSlides, 5)).keys()].map((pageIndex) => (
                                        <div
                                            key={pageIndex + 1}
                                            className={`trPageNums ${currentSlide === pageIndex + 1 ? "active" : ""}`}
                                            onClick={() => goToSlide(pageIndex + 1)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {pageIndex + 1}
                                        </div>
                                    ))}


                                    {totalSlides > 5 && currentSlide <= 5 && (
                                        <div
                                            className="trPageNums"
                                            style={{ cursor: "default" }}
                                        >
                                            ...
                                        </div>
                                    )}


                                    {totalSlides > 5 && currentSlide > 5 && (
                                        <div
                                            className={`trPageNums ${currentSlide === totalSlides ? "active" : ""}`}
                                            onClick={() => goToSlide(currentSlide)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {currentSlide}
                                        </div>
                                    )}
                                </div>

                                <div className="trPageActions">
                                    <div
                                        className={`trPageActionsItems ${currentSlide === 1 ? "disabled" : ""}`}
                                        onClick={goToPreviousSlide}
                                        style={{ cursor: currentSlide === 1 ? "not-allowed" : "pointer" }}
                                    >
                                        <FaArrowLeft />
                                    </div>
                                    <div
                                        className={`trPageActionsItems ${currentSlide === totalSlides ? "disabled" : ""}`}
                                        onClick={goToNextSlide}
                                        style={{ cursor: currentSlide === totalSlides ? "not-allowed" : "pointer" }}
                                    >
                                        <FaArrowRight />
                                    </div>
                                </div>
                            </div>


                        )}
                    </div>
                    <div className="storeDManagement" style={{ display: selectedNavItem === "StoreData" ? "" : "none" }}>
                        <div className="storeMHead">
                            <b className="storeMHTitle">Data Toko</b>
                            <div className="storeMHActions">

                                {(isFormChanged) ? <>
                                    <b onClick={() => { nameStoreRef.current.blur(); setIsFormChanged(false) }}>Batal</b>
                                    <b onClick={() => { submitFormStore.current.click() }}>Simpan</b></> :
                                    <b onClick={() => { nameStoreRef.current.focus(); setIsFormChanged(true) }}>Edit</b>}
                            </div>
                        </div>
                        <form className="storeMContainer"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                Swal.fire({
                                    icon: "warning",
                                    title: "Anda Yakin Ingin Merubah Data Toko?",
                                    text: "Data toko akan di rubah",
                                    showCancelButton: true,
                                    cancelButtonText: "Batal",
                                    confirmButtonText: "Ya",
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        await storeDataChange(formStoreData, storeDataM?.storeData.storeId)
                                    }
                                })
                            }}
                        >
                            <div className="storeMCFields">
                                <label>Nama Toko</label>
                                <input
                                    ref={nameStoreRef}
                                    type="text"
                                    value={formStoreData.StoreName}
                                    onChange={(e) => { setformStoreData({ ...formStoreData, StoreName: e.target.value }); setIsFormChanged(true) }}
                                />
                            </div>
                            <div className="storeMCFields">
                                <label>Kategori</label>
                                <input
                                    type="text"
                                    value={formStoreData.Category}
                                    onChange={(e) => { setformStoreData({ ...formStoreData, Category: e.target.value }); setIsFormChanged(true) }}
                                />
                            </div>
                            <div className="storeMCFields">
                                <label>Deskripsi</label>
                                <input
                                    type="text"
                                    value={formStoreData.Desc}
                                    onChange={(e) => { setformStoreData({ ...formStoreData, Desc: e.target.value }); setIsFormChanged(true) }}
                                />
                            </div>
                            <div className="storeMCFields">
                                <label>Alamat Toko</label>
                                <input
                                    type="text"
                                    value={formStoreData.Address}
                                    onChange={(e) => { setformStoreData({ ...formStoreData, Address: e.target.value }); setIsFormChanged(true) }}
                                />
                            </div>
                            <div className="storeMCFields">
                                <label>Foto Banner</label>
                                <input
                                    type="file"
                                    value=""
                                    onChange={(e) => { setformStoreData({ ...formStoreData, BannerImg: e.target.files[0] }); setIsFormChanged(true) }}
                                />
                            </div>
                            <input type="submit" style={{ visibility: "hidden" }} ref={submitFormStore} />
                            <br />
                        </form>

                    </div>
                </div>
            </div>
            {toPreview.isPreview &&
                <div className="showCaseProd"
                    style={{
                        position: "absolute",
                        zIndex: "10",
                        top: "0",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(0, 0, 0, 0.61)",
                        width: document.body.clientWidth,
                        height: document.body.clientHeight,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <b style={{
                        color: "white"
                    }}
                        onClick={() => {
                            setToPreview({
                                isPreview: false,
                                index: 0
                            })
                        }}
                    >Tutup</b>
                    <div
                        className="productCase"
                        key={`productKey` + prodDataM[toPreview.index].id}
                        id={"product-" + prodDataM[toPreview.index].id}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            width: "300px",
                            margin: "16px",
                        }}
                    >
                        <div
                            className="imageCase"
                            style={{
                                backgroundImage: `url(http://localhost:5173${prodDataM[toPreview.index].image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                height: "250px",
                                width: "100%",
                            }}
                        ></div>
                        <div
                            className="details"
                            style={{
                                padding: "16px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                backgroundColor: "white"
                            }}
                        >
                            <div>
                                <b style={{ fontSize: "18px", color: "#333" }}>
                                    {prodDataM[toPreview.index].name}
                                </b>
                                <p style={{ fontSize: "14px", color: "#555" }}>
                                    {prodDataM[toPreview.index].storeName}
                                </p>
                                <p style={{ fontSize: "14px", color: "#777" }}>
                                    {prodDataM[toPreview.index].desc}
                                </p>
                            </div>
                            <div className="div" style={{ marginTop: "16px" }}>
                                <div
                                    className="price"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                    }}
                                >
                                    <p style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                                        {String(prodDataM[toPreview.index].quantity).split("|")[0]}Kg
                                    </p>
                                    <p style={{ fontSize: "16px", fontWeight: "bold", color: "#d32f2f" }}>
                                        Rp.{prodDataM[toPreview.index].price}
                                    </p>
                                </div>
                                <div
                                    className="rating"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        color: "#ffa000",
                                    }}
                                >
                                    <FaStar />
                                    <p style={{ fontSize: "14px", color: "#555" }}>
                                        {prodDataM[toPreview.index].rating.Rating} 200 Terjual
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }
            {toPreviewTra.isShow &&
                <div className="caseToPrevTra"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems:"center",
                        justifyContent:'center',
                        width: document.body.clientWidth,
                        height: document.body.clientHeight,
                        backgroundColor: 'rgba(0, 0, 0, 0.63)',
                        position: 'absolute',
                        zIndex: '12',
                        top: "0"
                    }}
                >
                    <div
                        className="toPreivewTra"
                        style={{
                            position: 'absolute',
                            display: "flex",
                            flexDirection: "column",
                            gap: '15px',
                            padding: '20px',
                            width: '80%',
                            maxWidth: '800px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            zIndex: '12'
                        }}
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}><h1>FRESH.I</h1> <b onClick={() => {
                            setToPreviewTra({
                                ...toPreviewTra,
                                isShow: false,
                            })
                        }}>Tutup</b></div>
                        <div className="separator"></div>
                        <p style={{ margin: '10px 0', fontWeight: 'bold', textAlign: "justify" }}>ID Transaksi: {toPreviewTra['Id Transaksi']}</p>
                        <p style={{ margin: '10px 0' }}>Nama Pembeli: {toPreviewTra['Nama Pembeli']}</p>
                        <p style={{ margin: '10px 0' }}>Tanggal Masuk: {toPreviewTra['Tanggal Masuk']}</p>
                        <p style={{ margin: '10px 0' }}>ID Produk: {toPreviewTra['Id Produk']}</p>
                        <p style={{ margin: '10px 0' }}>Pembayaran Via: {toPreviewTra['Pembayaran Via']}</p>
                        <p style={{ margin: '10px 0' }}>Rekening VA: {toPreviewTra['Rekening Va']}</p>
                        <p style={{ margin: '10px 0' }}>Total Biaya: {toPreviewTra['Total Biaya']}</p>
                        <p style={{ margin: '10px 0' }}>Pembayaran Selesai: {toPreviewTra['Pembayaran Selesai']}</p>
                        <p style={{ margin: '10px 0', fontWeight: 'bold' }}>Status: {toPreviewTra.Status}</p>
                        <div className="separator"></div>
                        {toPreviewTra.Status === "diproses" && <div>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}><b>Atur Sebagai Selesai</b> <b onClick={async () => {
                                await setTraToFinish(toPreviewTra.StoreId, toPreviewTra['Id Transaksi'], toPreviewTra["Id Pembeli"], toPreviewTra['Id Produk'], toPreviewTra['Nama Produk'])
                                setToPreviewTra({
                                    ...toPreviewTra,
                                    isShow: false,
                                })
                            }}>Atur</b></div>
                        </div>}
                        <div className="separator"></div>

                    </div>
                </div>
            }
        </>
    );
}

export default StoreManagement;

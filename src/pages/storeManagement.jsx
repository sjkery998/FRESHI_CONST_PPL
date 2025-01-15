import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaCheck, FaFileInvoice, FaFolder, FaLocationPin, FaMagnifyingGlass, FaPen, FaPlus, FaReceipt, FaStore, FaTrash } from 'react-icons/fa6';
import { FaLemon, FaStar } from 'react-icons/fa';
import Transition from '../components/transition.jsx';
import { useAuth } from '../context/auth/authcontext.jsx';
import '../css/storeDetail.css';
import '../css/storeManagement.css';
import { TbReload } from 'react-icons/tb';
import { MdSpaceDashboard } from 'react-icons/md';
import { handleAddProduct, storeDataChange, storeManagementDataFetch, StoreProductsData } from '../jsx/storeManagement/storeManagement.jsx';
import Swal from 'sweetalert2';

function StoreManagement() {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsloading] = useState(true);
    const [storeDataM, setStoreDataM] = useState(null);
    const [prodDataM, setProdDataM] = useState(null);
    const [selectedNavItem, setSelectedNavItem] = useState("Dashboard");
    const [isFormChanged, setIsFormChanged] = useState(false);
    const submitFormStore = useRef(null);
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
        if (location.state?.fromAuth) {
            navigate('/');
        } else if (location.state?.fromFavorite) {
            navigate(-1);
        } else if (location.state?.fromChatting) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    function addNewProduct() {
        handleAddProduct(storeDataM.storeData.storeName);
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
            <div className="StoreDetailsPage">
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
                            <div className="storeDetailHeadline manageOptions" id='Dashboard' onClick={(e) => { navItemClicked(e) }}>
                                <MdSpaceDashboard />
                                <p>Dashboard</p>
                            </div>
                            <div className="storeDetailHeadline manageOptions" id='Transactions' onClick={(e) => { navItemClicked(e) }}>
                                <FaReceipt />
                                <p>Transaksi</p>
                            </div>
                            <div className="storeDetailHeadline manageOptions" id='Products' onClick={(e) => { navItemClicked(e) }}>
                                <FaFolder />
                                <p>Produk</p>
                            </div>
                            <div className="storeDetailHeadline manageOptions" id='StoreData' onClick={(e) => { navItemClicked(e) }}>
                                <FaStore />
                                <p>Data Toko</p>
                            </div>
                            <div className="storeDetailHeadline manageOptions" id='Invoice' onClick={(e) => { navItemClicked(e) }}>
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
                            <div className="trItems" id='PesananMasuk' onClick={(e) => { changePage(e) }}>Masuk</div>
                            <div className="trItems" id='Dibatalkan' onClick={(e) => { changePage(e) }}>Dibatalkan</div>
                            <div className="trItems" id='PesananSelesai' onClick={(e) => { changePage(e) }}>Selesai</div>
                        </div>
                        <div className="trContainer">
                            {selectedNavItem === "Transactions" ? trPage === "PesananMasuk" ? currentItems?.length > 0 ? currentItems?.map((transaction, index) => (
                                <div className="trCards" key={index}>
                                    <div className="trCardMain">
                                        <b>#{transaction.traId}</b>
                                        <p>Pembayaran : {transaction.traStatus === "diproses" ? "Berhasil" : "Belum Dibayar"}</p>
                                        <p>Status : {transaction.traStatus || "Tidak diketahui"}</p>
                                    </div>
                                    <div className="trCardEnd">
                                        <b>Detail</b>
                                        <p>{transaction.traSettledTime || "Belum selesai"}</p>
                                    </div>
                                </div>
                            )) : <center>Tidak Ada Data</center> : <center>Tidak Ada Data</center> : null
                            }
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
                                <FaPlus className="MHeadActions" onClick={addNewProduct}></FaPlus>
                                <FaCheck className="MHeadActions" onClick={() => { }}></FaCheck>
                            </div>
                        </div>
                        <div className="prodMContainer">
                            {selectedNavItem === "Products" && currentItems?.length > 0 ? (
                                currentItems
                                    .filter(product => product && product.id && product.name)
                                    .map((product) => (
                                        <div key={product.id + "s"} className="prodCards">
                                            <div className="prodCardMain">
                                                <b>{product.name}</b>
                                                <p>Kode : {product.id}</p>
                                                <p>Perlihat : {product.status ? 'Aktif' : 'Nonaktif'}</p>
                                            </div>
                                            <div className="prodCardEnd">
                                                <FaArrowRight />
                                                <div className="prodCardActions">
                                                    <FaPen className="pCardActions" style={{ color: "white" }} />
                                                    <FaTrash className="pCardActions" style={{ color: "red" }} />
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
                                
                                {(isFormChanged) ? <><b>Batal</b>
                                    <b onClick={()=>{submitFormStore.current.click()}}>Simpan</b></> : <b>Edit</b>}
                            </div>
                        </div>
                        <form className="storeMContainer"
                            onSubmit={async (e)=>{
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
                                    type="text"
                                    value={formStoreData.StoreName}
                                    onChange={(e) => {setformStoreData({ ...formStoreData, StoreName: e.target.value }); setIsFormChanged(true)}}
                                />
                            </div>
                            <div className="storeMCFields">
                                <label>Kategori</label>
                                <input
                                    type="text"
                                    value={formStoreData.Category}
                                    onChange={(e) =>{ setformStoreData({ ...formStoreData, Category: e.target.value }); setIsFormChanged(true)}}
                                />
                            </div>
                            <div className="storeMCFields">
                                <label>Deskripsi</label>
                                <input
                                    type="text"
                                    value={formStoreData.Desc}
                                    onChange={(e) => {setformStoreData({ ...formStoreData, Desc: e.target.value }); setIsFormChanged(true)}}
                                />
                            </div>
                            <div className="storeMCFields">
                                <label>Alamat Toko</label>
                                <input
                                    type="text"
                                    value={formStoreData.Address}
                                    onChange={(e) => {setformStoreData({ ...formStoreData, Address: e.target.value }); setIsFormChanged(true)}}
                                />
                            </div>
                            <div className="storeMCFields">
                                <label>Foto Banner</label>
                                <input
                                    type="file"
                                    value=""
                                    onChange={(e) => {setformStoreData({ ...formStoreData, BannerImg: e.target.files[0] }); setIsFormChanged(true)}}
                                />
                            </div>
                            <input type="submit" style={{visibility: "hidden"}} ref={submitFormStore}/>
                            <br />
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}

export default StoreManagement;

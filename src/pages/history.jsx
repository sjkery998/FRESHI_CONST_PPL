import React, { useEffect, useRef, useState } from "react";
import "../css/history.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { getHistoryData } from "../jsx/dataModel";
import Transition from "../components/transition.jsx";
import { FaStar } from "react-icons/fa6";
import { toAuthWebPage } from "../jsx/isAuthChecker.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/authcontext.jsx";
import Swal from "sweetalert2";
import { payNow, toCancelPayment, universalDataFunction } from "../jsx/dataController.jsx";
import { FaHistory } from "react-icons/fa";

function History() {
    const navigate = useNavigate();
    const [historiesData, setHistoryDatas] = useState();
    const { userLoggedIn } = useAuth();
    const [isCooldown, setIsCooldown] = useState(false)
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pending");
    const reTakeDataRef = useRef(null)
    const toDetailProduct = (event) => {
        const productId = event.target.closest('.hisProdCase').id.split('-')[1];
        navigate(`/ProductDetail?productId=${productId}`, {
            state: { fromHistory: true }
        });
    };

    async function toPay(tranData, Id_Transaksi, token) {
        if (isCooldown) {
            Swal.fire({
                title: "Peringatan!",
                text: "Tunggu Sebentar Lagi",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Oke",
                timer: 3000,
                timerProgressBar: true,
            });
            setTimeout(() => {
                setIsCooldown(false);
                console.log("Cooldown selesai! Anda bisa menekan tombol lagi.");
            }, 3000);
            return;
        }
        setIsCooldown(true);
        if (token) {
            navigate(`/processPayment?transactionId=${Id_Transaksi}&token=${token}`)
        } else {
            await payNow(tranData, navigate)
        }


        setTimeout(() => {
            setIsCooldown(false);
            console.log("Cooldown selesai! Anda bisa menekan tombol lagi.");
        }, 3000);
    }

    async function takeData() {
        setHistoryDatas(await getHistoryData())
        console.log("Retake")
    }
    useEffect(() => {
        setLoading(false);
        takeData()
    }, [userLoggedIn]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    if (loading) {
        return (
            <>
                tunggu sebentar....
            </>
        )
    }
    return (
        <>
            <Transition />
            <div className="HistoryPage">
                <div className="HisHeading">
                    <div className="HistoryLogoCase" style={{ fontSize: "1rem", display: "flex", justifyContent: "center" }}>
                        <b>History</b>
                        <div ref={reTakeDataRef} onClick={takeData}><FaHistory style={{ position: "absolute", right: "1rem" }}></FaHistory></div>
                    </div>
                    <div className="hisSwitch" style={{ fontSize: "0.8rem" }}>
                        <p
                            className={activeTab === "pending" ? "active" : ""}
                            onClick={() => handleTabClick("pending")}
                        >
                            Pending
                        </p>
                        <p
                            className={activeTab === "proceed" ? "active" : ""}
                            onClick={() => handleTabClick("proceed")}
                        >
                            Diproses
                        </p>
                        <p
                            className={activeTab === "success" ? "active" : ""}
                            onClick={() => handleTabClick("success")}
                        >
                            Berhasil
                        </p>
                        <p
                            className={activeTab === "canceled" ? "active" : ""}
                            onClick={() => handleTabClick("canceled")}
                        >
                            Dibatalkan
                        </p>
                    </div>
                </div>

                {userLoggedIn ? (
                    <>
                        <div className="container" id="HisPending" style={{ display: activeTab === "pending" ? "" : "none" }}>
                            {historiesData ? Object.entries(historiesData).map(([key, historyP]) => (
                                (historyP?.status === "pending") &&
                                <div className="hisCardCase" key={historyP.Id_Transaksi + "p"}>
                                    <div className="hisProdCase" id={"product-" + historyP.Id_Produk} onClick={(e) => {
                                        toDetailProduct(e);
                                    }}>

                                        <div className="leftSide">
                                            <div className="imgCase">
                                                <img src={historyP.Gambar_Produk} alt={historyP.Nama_Produk} />
                                            </div>
                                            <div className="proDetails">
                                                <b className="detailStoreName">{historyP.Nama_Toko}</b>
                                                <b className="detailProdName">{historyP.Nama_Produk}</b>
                                                <b className="detailStatus">juli - 2024 | {historyP.Status_Transaksi}</b>
                                                <b className="detailWeight">{historyP.Kuantitas}&nbsp;{"Rp." + historyP.Harga_Produk}</b>
                                                <b style={{ fontSize: "0.8rem" }}>Jumlah Beli {historyP.Jumlah_Beli}</b>
                                            </div>
                                        </div>
                                        <div className="rightSide">
                                            <b style={{ fontSize: "0.8rem", color: "green" }}><FontAwesomeIcon icon={faStar} ></FontAwesomeIcon> {historyP.Rating}</b>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <b>Total Rp.{historyP.Total_Biaya}</b>
                                        <b style={{ fontSize: "0.8rem", color: "green", padding: "0.5rem 0", marginLeft: "auto", marginRight: "1rem", color: "red" }}
                                            onClick={() => {
                                                toCancelPayment(historyP.Id_Toko, historyP.Id_Transaksi);
                                                reTakeDataRef.current.click();
                                            }}
                                        >Batalkan</b>
                                        <b style={{ fontSize: "0.8rem", color: "green", padding: "0.5rem 0" }}
                                            onClick={() => {
                                                toPay(historyP, historyP.Id_Transaksi, historyP?.token || null);
                                            }}
                                        >{historyP?.recipt ? "Selesaikan Pembayaran" : "Bayar Sekarang"}</b>
                                    </div>
                                    <div className="separator"></div>
                                </div>

                            )) : <center>Tidak ada data</center>}

                        </div>
                        <div className="container" id="HisProceed" style={{ display: activeTab === "proceed" ? "" : "none" }}>
                            {historiesData ? Object.entries(historiesData).map(([key, historyPr]) => (
                                (historyPr?.status === "diproses") &&
                                <div className="hisCardCase" key={historyPr.Id_Transaksi + "pr"}>
                                    <div className="hisProdCase">
                                        <div className="leftSide">
                                            <div className="imgCase">
                                                <img src={historyPr.Gambar_Produk} alt={historyPr.Nama_Produk} />
                                            </div>
                                            <div className="proDetails">
                                                <b className="detailStoreName">{historyPr.Nama_Toko}</b>
                                                <b className="detailProdName">{historyPr.Nama_Produk}</b>
                                                <b className="detailStatus">juli - 2024 | {historyPr.Status_Transaksi}</b>
                                                <b className="detailWeight">{historyPr.Kuantitas}&nbsp;{"Rp." + historyPr.Harga_Produk}</b>
                                                <b style={{ fontSize: "0.8rem" }}>Jumlah Beli {historyPr.Jumlah_Beli}</b>
                                            </div>
                                        </div>
                                        <div className="rightSide">
                                            <b style={{ fontSize: "0.8rem", color: "green" }}><FontAwesomeIcon icon={faStar} ></FontAwesomeIcon> {historyPr.Rating}</b>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <b>Total Rp.{historyPr.Total_Biaya}</b>
                                        <b>Diproses</b>
                                    </div>
                                    <div className="separator"></div>
                                </div>
                            )) : <center>Tidak ada data</center>}
                        </div>
                        <div className="container" id="HisSuccess" style={{ display: activeTab === "success" ? "" : "none" }}>
                            {historiesData ? Object.entries(historiesData).map(([key, historyB]) => (
                                (historyB?.status === "berhasil") &&
                                <div className="hisCardCase" key={historyB.Id_Transaksi + "b"}>
                                    <div className="hisProdCase">
                                        <div className="leftSide">
                                            <div className="imgCase">
                                                <img src={historyB.Gambar_Produk} alt={historyB.Nama_Produk} />
                                            </div>
                                            <div className="proDetails">
                                                <b className="detailStoreName">{historyB.Nama_Toko}</b>
                                                <b className="detailProdName">{historyB.Nama_Produk}</b>
                                                <b className="detailStatus">juli - 2024 | {historyB.Status_Transaksi}</b>
                                                <b className="detailWeight">{historyB.Kuantitas}&nbsp;{"Rp." + historyB.Harga_Produk}</b>
                                                <b style={{ fontSize: "0.8rem" }}>Jumlah Beli {historyB.Jumlah_Beli} | {"Rp." + historyB.Total_Biaya}</b>
                                            </div>
                                        </div>
                                        <div className="rightSide">
                                            <b><FontAwesomeIcon icon={faStar}></FontAwesomeIcon> 4.6</b>
                                            <b><FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon></b>
                                        </div>
                                    </div>
                                    <div className="separator"></div>
                                    <div className="addRateProd">
                                        <b>Beri Rating</b>
                                        <b className="rateStars">
                                            <FaStar />
                                            <FaStar />
                                            <FaStar />
                                            <FaStar />
                                            <FaStar />
                                        </b>
                                    </div>
                                </div>
                            )) : <center>Tidak ada data</center>}
                        </div>
                        <div className="container" id="HisCanceled" style={{ display: activeTab === "canceled" ? "" : "none" }}>
                            {historiesData ? Object.entries(historiesData).map(([key, historyC]) => (
                                (historyC?.status === "dibatalkan") &&
                                <div className="hisCardCase" key={historyC.Id_Transaksi + "c"}>
                                    <div className="hisProdCase">
                                        <div className="leftSide">
                                            <div className="imgCase">
                                                <img src={historyC.Gambar_Produk} alt={historyC.Nama_Produk} />
                                            </div>
                                            <div className="proDetails">
                                                <b className="detailStoreName">{historyC.Nama_Toko}</b>
                                                <b className="detailProdName">{historyC.Nama_Produk}</b>
                                                <b className="detailStatus">juli - 2024 | {historyC.Status_Transaksi}</b>
                                                <b className="detailWeight">{historyC.Kuantitas}&nbsp;{"Rp." + historyC.Harga_Produk}</b>
                                                <b style={{ fontSize: "0.8rem" }}>Jumlah Beli {historyC.Jumlah_Beli}</b>
                                            </div>
                                        </div>
                                        <div className="rightSide">
                                            <b><FontAwesomeIcon icon={faStar}></FontAwesomeIcon> 4.6</b>
                                            <b><FontAwesomeIcon icon={faCancel} style={{ color: "red" }}></FontAwesomeIcon></b>
                                        </div>
                                    </div>
                                    <div className="separator"></div>
                                </div>
                            )) : <center>Tidak ada data</center>}

                        </div>
                    </>
                ) : (
                    <>
                        <p onClick={(e) => {
                            sessionStorage.setItem("lastBeforeLogin", window.location.href);
                            toAuthWebPage(navigate);
                        }} style={{ top: "110px", position: "absolute", textAlign: "center", width: "100%", margin: "auto" }}>
                            Harap Login Terlebih Dahulu <br />
                            <b style={{ color: "blue", padding: "0", margin: "0" }}>klick disini untuk login</b>
                        </p>
                    </>
                )}
            </div>
        </>
    );
}

export default History;

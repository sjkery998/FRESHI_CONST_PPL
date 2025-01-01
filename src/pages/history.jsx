import React, { useState } from "react";
import "../css/history.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faLocation, faLocationDot, faStar, faStore, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { productsData } from "../jsx/dataModel";
import Transition from "../components/transition.jsx";
import { FaStar } from "react-icons/fa6";

function History() {
    const historyData = productsData
    const [activeTab, setActiveTab] = useState("pending");
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    return (
        <>
            <Transition />
            <div className="HistoryPage">
                <div className="HisHeading">
                    <div className="HistoryLogoCase" style={{ fontSize: "1rem" }}>History</div>
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

                <div className="container" id="HisPending" style={{ display: activeTab === "pending" ? "" : "none" }}>
                    {historyData.map((historyD) => (
                        <div className="hisCardCase" key={historyD.id}>
                            <div className="hisProdCase">
                                <div className="leftSide">
                                    <div className="imgCase">
                                        <img src={historyD.image} alt={historyD.name} />
                                        <b>{historyD.price}</b>
                                    </div>
                                    <div className="proDetails">
                                        <b className="detailStoreName">{historyD.storeName}</b>
                                        <b className="detailProdName">{historyD.name}</b>
                                        <b className="detailStatus">juli - 2024 | Pending</b>
                                        <b className="detailWeight">{historyD.weight}</b>
                                    </div>
                                </div>
                                <div className="rightSide">
                                    <b><FontAwesomeIcon icon={faStar}></FontAwesomeIcon> 4.6</b>
                                    <b style={{ fontSize: "0.8rem" }}>Detail</b>
                                </div>
                            </div>
                            <div className="separator"></div>
                        </div>
                    ))}
                </div>
                <div className="container" id="HisProceed" style={{ display: activeTab === "proceed" ? "" : "none" }}>
                    {historyData.map((historyD) => (
                        <div className="hisCardCase" key={historyD.id}>
                            <div className="hisProdCase">
                                <div className="leftSide">
                                    <div className="imgCase">
                                        <img src={historyD.image} alt={historyD.name} />
                                        <b>{historyD.price}</b>
                                    </div>
                                    <div className="proDetails">
                                        <b className="detailStoreName">{historyD.storeName}</b>
                                        <b className="detailProdName">{historyD.name}</b>
                                        <b className="detailStatus">juli - 2024 | Diproses</b>
                                        <b className="detailWeight">{historyD.weight}</b>
                                    </div>
                                </div>
                                <div className="rightSide">
                                    <b><FontAwesomeIcon icon={faStar}></FontAwesomeIcon> 4.6</b>
                                    <b style={{ fontSize: "0.8rem" }}>Detail</b>
                                </div>
                            </div>
                            <div className="separator"></div>
                        </div>
                    ))}
                </div>
                <div className="container" id="HisProceed" style={{ display: activeTab === "success" ? "" : "none" }}>
                    {historyData.map((historyD) => (
                        <div className="hisCardCase" key={historyD.id}>
                            <div className="hisProdCase">
                                <div className="leftSide">
                                    <div className="imgCase">
                                        <img src={historyD.image} alt={historyD.name} />
                                        <b>{historyD.price}</b>
                                    </div>
                                    <div className="proDetails">
                                        <b className="detailStoreName">{historyD.storeName}</b>
                                        <b className="detailProdName">{historyD.name}</b>
                                        <b className="detailStatus">juli - 2024 | Berhasil</b>
                                        <b className="detailWeight">{historyD.weight}</b>
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
                    ))}
                </div>
                <div className="container" id="HisSuccess" style={{ display: activeTab === "canceled" ? "" : "none" }}>
                    {historyData.map((historyD) => (
                        <div className="hisCardCase" key={historyD.id}>
                            <div className="hisProdCase">
                                <div className="leftSide">
                                    <div className="imgCase">
                                        <img src={historyD.image} alt={historyD.name} />
                                        <b>{historyD.price}</b>
                                    </div>
                                    <div className="proDetails">
                                        <b className="detailStoreName">{historyD.storeName}</b>
                                        <b className="detailProdName">{historyD.name}</b>
                                        <b className="detailStatus">juli - 2024 | Dibatalkan</b>
                                        <b className="detailWeight">{historyD.weight}</b>
                                    </div>
                                </div>
                                <div className="rightSide">
                                    <b><FontAwesomeIcon icon={faStar}></FontAwesomeIcon> 4.6</b>
                                    <b><FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon></b>
                                </div>
                            </div>
                            <div className="separator"></div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}

export default History;

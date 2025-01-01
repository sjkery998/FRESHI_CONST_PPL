import React from "react";
import "../css/notification.css";
import { FaArrowLeft, FaBell } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { notificationsData } from "../jsx/dataModel.jsx";
import { BsCheckCircleFill } from "react-icons/bs";

function Notification() {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    const NotifsData = notificationsData

    return (
        <>
            <div className="simpleHeaderPage">
                <FaArrowLeft onClick={goBack} />
                <b>Notifikasi</b>
                <BsCheckCircleFill />
            </div>
            <div className="notifContainer">
                {NotifsData.map((notif) => (
                    <div className="notifCase" key={"k-" + notif.id} >
                        <div className="notifMessage" style={{borderLeft : !NotifsData.isRead ? "3px solid red" : "3px solid grey"}}>
                            <FaBell />
                            <p>{notif.message}</p>
                            <p className="notifTime">{notif.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}


export default Notification;
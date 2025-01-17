import React, { useEffect } from "react";
import "../css/notification.css";
import { FaArrowLeft, FaBell } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { notificationsData } from "../jsx/dataModel.jsx";
import { BsCheckCircleFill } from "react-icons/bs";
import { useFirebase } from "../context/firebaseContext/firebaseContext.jsx";
import { setNotificationToRead } from "../jsx/dataController.jsx";

function Notification() {
    const navigate = useNavigate();
    const { Notifications } = useFirebase()

    const goBack = () => {
        navigate(-1);
    };

    return (
        <>
            <div className="simpleHeaderPage">
                <FaArrowLeft onClick={goBack} />
                <b>Notifikasi</b>
                <BsCheckCircleFill />
            </div>
            <div className="notifContainer">
                {Notifications ? Object.entries(Notifications).map(([key, notif]) => (
                    <div className="notifCase" key={"k-" + notif.id} onClick={()=>{!notif.isRead ? setNotificationToRead(notif.id): null}}>
                        <div className="notifMessage" style={{ borderLeft: !notif.isRead ? "3px solid red" : "3px solid green" }}>
                            <FaBell />
                            <p>{notif.message}</p>
                            <p className="notifTime">{notif.timestamp}</p>
                        </div>
                    </div>
                )) : ""}
            </div>
        </>
    );
}

export default Notification;

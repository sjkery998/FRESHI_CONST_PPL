import React, { useState } from "react";
import "../css/profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faNoteSticky, faPen } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import Transition from "../components/transition.jsx";
import { FaMessage, FaRegMessage } from "react-icons/fa6";
import { FaBell, FaRegBell } from "react-icons/fa";
import CheckLoginActive from "../jsx/toAuthPage.jsx";
import { useNavigate } from "react-router-dom";



function Profile() {
    const navigate = useNavigate();

    const toChatPage = () => {
        navigate("/ChatPage")
    }
    const toNotif = () => {
        navigate("/Notification")
    }

    return (
        <>
            <Transition />
            <div className="simpleHeaderPage" style={{ justifyContent:"space-between", border:"none"}}>
                <FaRegBell style={{ fontSize:"1.3rem" }} onClick={toNotif}/>
                Profile
                <FaRegMessage style={{ fontSize:"1.2rem" }} onClick={toChatPage} />
            </div>
            <div className="profilePage">
                <div className="topProfContent">
                    <div className="profileImage"></div>
                    <div className="profileDetails">
                        <b style={{ fontSize: "1rem" }}>Name Name Name Name</b>
                        <b>gunawanaja@gmail.com</b>
                        <b>+6373148623588</b>
                    </div>
                    <div className="profileEdit" style={{ marginLeft: "auto" }} onClick={()=>{navigate('/EditProfilePage')}}>
                        <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                    </div>
                </div>

                <div className="botProfContent">
                    <b>Akun</b>
                    <div className="profileOptions">
                        <FontAwesomeIcon icon={faNotesMedical}></FontAwesomeIcon>
                        <b>Aktifitas</b>
                        <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                    </div>
                    <div className="profileOptions">
                        <FontAwesomeIcon icon={faNotesMedical}></FontAwesomeIcon>
                        <b>Pilih Bahasa</b>
                        <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                    </div>
                    <div className="profileOptions">
                        <FontAwesomeIcon icon={faNotesMedical}></FontAwesomeIcon>
                        <b>Notifikasi</b>
                        <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                    </div>
                    <div className="profileOptions">
                        <FontAwesomeIcon icon={faNotesMedical}></FontAwesomeIcon>
                        <b>Atur Akun</b>
                        <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                    </div>
                    <div className="profileOptions">
                        <FontAwesomeIcon icon={faNotesMedical}></FontAwesomeIcon>
                        <b>Source Code</b>
                        <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                    </div>
                    <div className="profileOptions" onClick={() => CheckLoginActive(navigate)}>
                        <FontAwesomeIcon icon={faNotesMedical}></FontAwesomeIcon>
                        <b>Logout</b>
                        <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                    </div>
                    <div className="profileOptions">
                        <FontAwesomeIcon icon={faNotesMedical}></FontAwesomeIcon>
                        <b>Aktifitas</b>
                        <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                    </div>
                </div>

                <div className="footerProfile">
                    <h1>Fresh.I</h1>
                    <b>Const.Ltd</b>
                </div>

            </div>

        </>
    )
}
export default Profile;
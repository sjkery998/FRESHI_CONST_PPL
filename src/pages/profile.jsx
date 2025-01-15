import React, { useEffect, useState } from "react";
import "../css/profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faNoteSticky, faPen } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import Transition from "../components/transition.jsx";
import { FaDoorClosed, FaDoorOpen, FaGithub, FaLanguage, FaMessage, FaRegMessage, FaStore } from "react-icons/fa6";
import { FaBell, FaRegBell } from "react-icons/fa";
import { checkUser, toAuthWebPage } from "../jsx/isAuthChecker.jsx";
import { useNavigate } from "react-router-dom";
import { authLogout, getUserId } from "../jsx/webAuth.jsx";
import Swal from "sweetalert2";
import { userData } from "../jsx/dataModel.jsx";
import { useAuth } from "../context/auth/authcontext.jsx";
import { registerToSeller } from "../jsx/dataController.jsx";



function Profile() {
    const { userLoggedIn } = useAuth();
    const [UserData, setUserData] = useState(userData)
    const navigate = useNavigate();


    const toChatPage = () => {
        navigate("/ChatPage")
    }
    const toNotif = () => {
        navigate("/Notification")
    }

    const performLogOut = async () => {

        Swal.fire({
            icon: "warning",
            title: "Apakah Anda Yakin?",
            confirmButtonText: "Ya",
            showCancelButton: true,
            cancelButtonText: "Tidak"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const resultLogout = await authLogout();
                if (resultLogout.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Anda Berhasil keluar!",
                        timer: 2000,
                        timerProgressBar: true,
                        confirmButtonText: "Ya"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload()
                        }
                        window.location.reload()
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Logout Gagal!",
                        text: result.message || "Terjadi kesalahan saat logout.",
                        timer: 2000,
                        timerProgressBar: true
                    });
                }
            }
        });
    }

    function goToStoreManagement() {
        navigate("/storeManagement")
    }

    useEffect(() => {
        if (userLoggedIn) {
            setUserData(userData);
            console.log(UserData.AccountType === "Seller")
        } else {
            navigate('/AuthWebPage');
        }
        sessionStorage.setItem("lastBeforeLogin", window.location.href);
    }, [])
    return (
        <>
            <Transition />
            <div className="simpleHeaderPage" style={{ justifyContent: "space-between", border: "none" }}>
                <FaRegBell style={{ fontSize: "1.3rem" }} onClick={toNotif} />
                Profile
                <FaRegMessage style={{ fontSize: "1.2rem" }} onClick={toChatPage} />
            </div>
            {userData !== null ? (
                <div className="profilePage">
                    <div className="topProfContent">
                        <div className="profileImage"></div>
                        <div className="profileDetails">
                            <b style={{ fontSize: "1rem" }}>{UserData.Username} &nbsp; ({UserData.AccountType})</b>
                            <b>{UserData.Email}</b>
                            <b>{UserData.PhoneNumber}</b>
                        </div>
                        <div className="profileEdit" style={{ marginLeft: "auto" }} onClick={() => { navigate('/EditProfilePage') }}>
                            Ubah
                        </div>
                    </div>

                    <div className="botProfContent">
                        <b>Akun</b>
                        {UserData.AccountType === "Seller" ?
                            <div className="profileOptions" onClick={goToStoreManagement}>
                                <FaStore />
                                <b>Management Toko</b>
                                <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                            </div>
                            : <div className="profileOptions" onClick={async ()=>{
                               await registerToSeller(await getUserId());
                            }}>
                                <FaStore />
                                <b>Mendaftar Jadi Seller</b>
                                <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                            </div>
                        }
                        <div className="profileOptions">
                            <FaLanguage />
                            <b>Pilih Bahasa</b>
                            <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                        </div>
                        <div className="profileOptions">
                            <FaBell />
                            <b>Notifikasi</b>
                            <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                        </div>
                        <div className="profileOptions">
                            <FontAwesomeIcon icon={faNotesMedical}></FontAwesomeIcon>
                            <b>Atur Akun</b>
                            <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                        </div>
                        <div className="profileOptions">
                            <FaGithub />
                            <b>Source Code</b>
                            <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                        </div>
                        <div className="profileOptions" onClick={() => { performLogOut() }}>
                            <FaDoorOpen />
                            <b>Logout</b>
                            <FontAwesomeIcon icon={faArrowRight} className="profileArrowRight"></FontAwesomeIcon>
                        </div>
                    </div>

                    <div className="footerProfile">
                        <h1>Fresh.I</h1>
                        <b>By Const.Ltd</b>
                    </div>

                </div>) : ""
            }
        </>
    )

}
export default Profile;
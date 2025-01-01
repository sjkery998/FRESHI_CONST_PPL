import React, { useEffect, useState } from "react";
import "../css/editProfilePage.css"
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
    const navigate = useNavigate();
    const viewH = window.innerHeight;

    const [profileDataHeight, setProfileDataHeight] = useState(0);

    useEffect(() => {
        const editAvatarContainer = document.querySelector(".editAvatarContainer");
        if (editAvatarContainer) {
            const avatarBottom = editAvatarContainer.getBoundingClientRect().bottom;
            const remainingHeight = viewH - avatarBottom;
            setProfileDataHeight(remainingHeight); 
        }
    }, []);
    return (
        <>
            <div className="simpleHeaderPage">
                <FaArrowLeft onClick={() => { navigate('/Profile') }} />
                <b>Edit Profile</b>
                <FaCheck />
            </div>
            <div className="editAvatarContainer" style={{ height: `${viewH / 3.5}px` }}>
                <img src="/images/storeAvatar.png" alt="" />
                <b style={{ fontSize: "1.4rem", color: "whitesmoke" }}>Foto Profil</b>
            </div>
            <form action="" className="editProfileDataContainer" style={{height:`calc(${profileDataHeight}px - 2rem)`}}>
                <input type="text" placeholder="Username" />
                <input type="text" placeholder="Email" />
                <input type="text" placeholder="Nomor Telepon" />
                <input type="text" placeholder="Alamat" />
                <input type="submit" value="Simpan Semua" />
            </form>
        </>
    )
}

export default EditProfilePage;
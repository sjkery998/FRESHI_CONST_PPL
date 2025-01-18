import React, { useEffect, useState } from "react";
import "../css/editProfilePage.css"
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { editProfileData } from "../jsx/dataController";
import { userData } from "../jsx/dataModel";

function EditProfilePage() {
    const navigate = useNavigate();
    const viewH = window.innerHeight;
    const [formEditProfile, setformEditProfile] = useState({
        Username: "",
        PhoneNum: "",
        Address: "",
    })

    const [profileDataHeight, setProfileDataHeight] = useState(0);

    useEffect(() => {
        const editAvatarContainer = document.querySelector(".editAvatarContainer");
        if (editAvatarContainer) {
            const avatarBottom = editAvatarContainer.getBoundingClientRect().bottom;
            const remainingHeight = viewH - avatarBottom;
            setProfileDataHeight(remainingHeight);

            setformEditProfile({
                Username: userData?.Username || "",
                PhoneNum: userData?.PhoneNumber || "",
                Address: userData?.Address || "",
            })
        }
    }, []);
    return (
        <>
            <div className="simpleHeaderPage">
                <FaArrowLeft onClick={() => { window.location.href = '/Profile' }} />
                <b>Edit Profile</b>
                <FaCheck />
            </div>
            <div className="editAvatarContainer" style={{ height: `${viewH / 3.5}px` }}>
                <img src="/images/storeAvatar.png" alt="" />
                <b style={{ fontSize: "1.4rem", color: "whitesmoke" }}>Foto Profil</b>
            </div>
            <form action="" className="editProfileDataContainer" style={{ height: `calc(${profileDataHeight}px - 2rem)` }}
                onSubmit={async (e) => {
                    await editProfileData(formEditProfile).then(() => setformEditProfile({ Username: "", PhoneNum: "", Address: "" }));
                    e.preventDefault()
                }}
            >
                <input type="text" placeholder="Username"
                    value={formEditProfile.Username}
                    onChange={(e) => setformEditProfile({ ...formEditProfile, "Username": e.target.value || "" })}
                />
                <input type="number" placeholder="Nomor Telepon"
                    value={formEditProfile.PhoneNum}
                    onChange={(e) => setformEditProfile({ ...formEditProfile, "PhoneNum": e.target.value || "" })}
                />
                <input type="text" placeholder="Alamat"
                    value={formEditProfile.Address}
                    onChange={(e) => setformEditProfile({ ...formEditProfile, "Address": e.target.value || "" })}
                />
                <input type="submit" value="Simpan Semua" />
            </form>
        </>
    )
}

export default EditProfilePage;
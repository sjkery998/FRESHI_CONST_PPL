import { setAccountData } from './dataController.jsx';
import { authRegister, authLogin, OAuthLogin, getUserId, authResetPass, authLogout, checkLogin } from './webAuth.jsx'
import Swal from 'sweetalert2';

export const initialRegisterPayload = {
    email: '',
    username: '',
    password: '',
};

export const initialLoginPayload = {
    email: '',
    password: '',
};

export const initialResetPassPayload = {
    email: '',
};

export const handlePayloadChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prev) => ({
        ...prev,
        [name]: value,
    }));
};

export const handleRegisterSubmit = async (payload, navigate, formInputRefs, loadingRef) => {
    try {
        if (!payload.email || !payload.username || !payload.password) {
            console.error("Register payload invalid:", payload);
            Swal.fire({
                icon: "error",
                title: "Gagal Mendaftar!",
                text: "Pastikan semua field terisi dengan benar.",
            });
            return false;
        }

        const response = await authRegister(payload);

        if (response && response.success) {
            loadingRef.current.style.display = "none";
            await setAccountData(payload.username, payload.email, await getUserId());
            Swal.fire({
                icon: "success",
                title: "Pendaftaran Berhasil!",
                text: "Akun Anda berhasil didaftarkan.",
                timer: 2000,
                timerProgressBar: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    const lastBeforeLogin = sessionStorage.getItem("lastBeforeLogin");
                    if (lastBeforeLogin) {
                        navigate(`/${lastBeforeLogin.split("/").filter(Boolean).pop()}`);
                    } else {
                        navigate("/");
                    }
                    navigate("/");
                    sessionStorage.removeItem("lastBeforeLogin");
                }
            });
        } else {
            if (
                response.error &&
                typeof response.error === "string" &&
                response.error.includes("email-already-in-use")
            ) {
                console.log("Email sudah terdaftar");
                throw new Error("Email ini sudah terdaftar. Gunakan email lain.");
            } else {
                console.log("Error lainnya:", response.error);
            }
        }
    } catch (error) {
        console.log(formInputRefs)
        formInputRefs.email.current.focus();
        console.error("Register Error:", error);
        Swal.fire({
            icon: "error",
            title: "Gagal Mendaftar!",
            text: error.message || "Terjadi kesalahan.",
        });
        return false;
    }
};

export const handleLoginSubmit = async (payload, navigate, formInputRefs, loadingRef) => {
    try {
        if (!payload.email || !payload.password) {
            console.error("Login payload invalid:", payload);
            Swal.fire({
                icon: "error",
                title: "Gagal Login!",
                text: "Pastikan email dan password terisi.",
            });
            return false;
        }

        const response = await authLogin(payload);

        if (response.success) {
            loadingRef.current.style.display = "none";
            Swal.fire({
                icon: "success",
                title: "Login Berhasil!",
                text: "Anda berhasil login.",
                timer: 2000,
                timerProgressBar: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    const lastBeforeLogin = sessionStorage.getItem("lastBeforeLogin");
                    if (lastBeforeLogin && lastBeforeLogin.split("/").filter(Boolean).pop() !== "AuthWebPage") {
                        console.log("H")
                        window.location.href = `/${lastBeforeLogin.split("/").filter(Boolean).pop()}`
                        sessionStorage.removeItem("lastBeforeLogin");
                    } else {
                        console.log("I")
                        window.location.href = "/"
                        // sessionStorage.removeItem("lastBeforeLogin");
                    }
                }
            });
        } else {
            if (response.error && typeof response.error === 'string' && response.error.includes("credential")) {
                console.log("Credential error detected");
                throw new Error("Email atau password anda salah.");
            } else {
                console.log("Error lainnya:", response.error);
            }

        }
    } catch (error) {
        formInputRefs.password.current.value = "";
        formInputRefs.password.current.focus();
        console.error("Login Error:", error);
        Swal.fire({
            icon: "error",
            title: "Gagal Login!",
            text: error.message || "Terjadi kesalahan.",
        });
        return false;
    }
};


export const handleResetPassSubmit = async (payload, navigate, formInputRefs, loadingRef) => {
    try {
        if (!payload.email) {
            console.error("Reset password payload invalid:", payload);
            Swal.fire({
                icon: "error",
                title: "Gagal Reset Password!",
                text: "Email wajib diisi.",
            });
            return false;
        }

        const response = await authResetPass(payload);

        if (response.success) {
            loadingRef.current.style.display = "none";
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Email Konfirmasi telah dikirim ke email Anda. Cek email Anda untuk mengganti password.",
                showConfirmButton: true, // Menampilkan tombol konfirmasi
                confirmButtonText: "OK", // Label tombol
                timer: 2000,
                timerProgressBar: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            })
        } else {
            if (
                response.error &&
                typeof response.error === "string" &&
                response.error.includes("not registered")
            ) {
                console.log("Email belum terdaftar");
                throw new Error("Email ini belum terdaftar.");
            } else {
                console.log("Error lainnya:", response.error);
            }
        }
    } catch (error) {
        formInputRefs.email.current.focus();
        console.error("Reset Password Error:", error);
        Swal.fire({
            icon: "error",
            title: "Gagal Reset Password!",
            text: error.message || "Terjadi kesalahan.",
        });
        return false;
    }
};


export const getOnSubmitHandler = (authType, payload, navigate, formInputRefs, lodingRef) => {
    switch (authType) {
        case 'register':
            return () => handleRegisterSubmit(payload, navigate, formInputRefs, lodingRef);
        case 'login':
            return () => handleLoginSubmit(payload, navigate, formInputRefs, lodingRef);
        case 'resetPassword':
            return () => handleResetPassSubmit(payload, navigate, formInputRefs, lodingRef);
        default:
            console.error('Invalid auth type:', authType);
            return () => { };
    }
};



export { checkLogin, authLogout, getUserId };



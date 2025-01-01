import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaGoogle } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import "../css/authWebPage.css";
import { useNavigate } from "react-router-dom";

function AuthWebPage() {
    const navigate = useNavigate();

    const [isForgotPass, setIsForgotPass] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAuthVisible, setIsAuthVisible] = useState(false);
    const [toggleAuth, setToggleAuth] = useState(false);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
        setTimeout(() => {
            setIsAuthVisible(!isAuthVisible);
            if (!toggleAuth) setToggleAuth(true);
        }, isExpanded ? 100 : 500);
    };

    const backToHome = () => {
        const lastPage = sessionStorage.getItem("lastBeforeLogin");
        if (lastPage) {
            navigate(`/${lastPage.split("/").filter(Boolean).pop()}`);
            sessionStorage.removeItem("lastBeforeLogin");
        } else {
            navigate(`/`);
        }
    };

    const updateAuthBounceImageHeight = () => {
        const authContainer = document.querySelector(".authContainer");
        const authBounceImageCase = document.querySelector(".authBounceImageCase");
        if (authContainer && authBounceImageCase) {
            authBounceImageCase.style.height = `${authContainer.getBoundingClientRect().top}px`;
        }
    };

    useEffect(() => {
        const authContainer = document.querySelector(".authContainer");
        if (authContainer) {
            const resizeObserver = new ResizeObserver(updateAuthBounceImageHeight);
            resizeObserver.observe(authContainer);
            return () => resizeObserver.disconnect();
        }
    }, []);

    return (
        <div className="authPageContainer">
            <div className="authBounceImageCase">
                <img src="/images/buah.png" alt="Logo Fresh.i" />
            </div>
            <div
                className="authContainer"
                style={{ minHeight: isExpanded ? "100%" : "290px" }}
            >
                {!isAuthVisible ? (
                    <div className="authOptions">
                        <h1>Mulai Sekarang</h1>
                        <p>
                            Temukan produk segar langsung dari petani terpercaya. Dapatkan harga
                            terbaik di fresh.i
                        </p>
                        <div className="authEmailCase" onClick={handleExpand}>
                            <MdOutlineEmail />
                            <p>Lanjutkan dengan email</p>
                        </div>
                        <div className="authGoogleCase">
                            <FaGoogle />
                            <p>Lanjutkan dengan google</p>
                        </div>
                        <div className="authSkipLogin" onClick={backToHome}>
                            <FaArrowRight />
                            <p>Lewati untuk sekarang</p>
                        </div>
                    </div>
                ) : (
                    <form
                        className="authWithEmail"
                        style={{
                            minHeight: isForgotPass
                                ? `calc(${window.innerHeight}px - 2rem)`
                                : `calc(${window.innerHeight}px - 2rem)`,
                        }}
                    >
                        <div className="authHeadButton">
                            <b onClick={handleExpand}>Kembali</b>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "2rem 0",
                            }}
                        >
                            <h1 className="freshILogo">Fresh.i</h1>
                            <p>Suplai marketnya buah-buahan segar</p>
                        </div>
                        <input
                            disabled={isForgotPass}
                            type="email"
                            placeholder="Masukan email anda"
                            required
                            onInvalid={(e) =>
                                e.target.setCustomValidity(
                                    "Email harus valid, contoh: user@example.com"
                                )
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
                        />
                        <input
                            disabled={isForgotPass}
                            type="text"
                            placeholder="Masukkan nama anda"
                            style={{ display: toggleAuth ? "" : "none" }}
                            required={toggleAuth}
                            onInvalid={(e) =>
                                e.target.setCustomValidity("Nama wajib diisi!")
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
                        />
                        <input
                            disabled={isForgotPass}
                            type="password"
                            placeholder={!toggleAuth ? "Masukkan Password" : "Buat Password Baru"}
                            required
                            onInvalid={(e) =>
                                e.target.setCustomValidity("Password harus diisi!")
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
                        />
                        <p
                            style={{ padding: "0 0.3rem", color: "blue", fontWeight: "500" }}
                            onClick={() => setIsForgotPass(!isForgotPass)}
                        >
                            Lupa kata sandi?
                        </p>
                        {isForgotPass && (
                            <div className="authWithEmail resetPassword" style={{ display: isForgotPass ? "flex" : "none", padding: "0", width: "100%", minHeight: isForgotPass ? "0" : "" }}>
                                <input
                                    type="email"
                                    placeholder="Masukan Email Terdaftar"
                                    required
                                    onInvalid={(e) =>
                                        e.target.setCustomValidity("Harus diisi!")
                                    }
                                    onInput={(e) => e.target.setCustomValidity("")}
                                />
                                <input
                                    type="submit"
                                    value="Reset Password"
                                    className="authRegButton resetPassword"
                                />
                            </div>
                        )}
                        <input
                            disabled={isForgotPass}
                            type="submit"
                            value={toggleAuth ? "Mendaftar" : "Masuk"}
                            className="authRegButton"
                        />
                        <div className="authToLogin" onClick={() => setToggleAuth(!toggleAuth)}>
                            <p style={{ margin: "0", padding: "0", lineHeight: "0", color: "black" }}>
                                {toggleAuth ? "Sudah Punya Akun?" : "Belum Punya Akun?"}
                            </p>
                            {toggleAuth ? "Masuk" : "Daftar Disini"}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AuthWebPage;

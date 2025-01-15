import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaGoogle } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import "../css/authWebPage.css";
import { useNavigate } from "react-router-dom";
import { initialRegisterPayload, initialLoginPayload, initialResetPassPayload, handlePayloadChange, getOnSubmitHandler } from "../jsx/authHandler";
import { useAuth } from "../context/auth/authcontext";

function AuthWebPage() {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [authType, setAuthType] = useState('register');
    const [formPayload, setFormPayload] = useState(initialRegisterPayload);
    
    const [isDelay, setIsDelay] = useState(false);
    const loadingRef = useRef(null);

    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const formInputRefs = {
        email: emailRef,
        username: usernameRef,
        password: passwordRef,
    };

    const handleAuthTypeChange = (type) => {
        setAuthType(type);
        switch (type) {
            case 'register':
                setFormPayload(initialRegisterPayload);
                break;
            case 'login':
                setFormPayload(initialLoginPayload);
                break;
            case 'resetPassword':
                setFormPayload(initialResetPassPayload);
                break;
            default:
                break;
        }
    };


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
        if (lastPage && lastPage.split("/").filter(Boolean).pop() !== "profile" && lastPage.split("/").filter(Boolean).pop() !== "AuthWebPage") {
            navigate(`/${lastPage.split("/").filter(Boolean).pop()}`, { state: { fromAuth: true } });
            sessionStorage.removeItem("lastBeforeLogin");
        } else {
            navigate(`/`);
            sessionStorage.removeItem("lastBeforeLogin");
        }
    };

    const updateAuthBounceImageHeight = () => {
        const authContainer = document.querySelector(".authContainer");
        const authBounceImageCase = document.querySelector(".authBounceImageCase");
        if (authContainer && authBounceImageCase) {
            authBounceImageCase.style.height = `${authContainer.getBoundingClientRect().top}px`;
        }
    };

    const LoadingDelayAuth = (
        <div
            ref={loadingRef}
          className="loadingDelayAuth"
          style={{
            position: "absolute",
            zIndex: 10,
            height: `${window.innerHeight}px`,
            width: `${window.innerWidth}px`,
            backgroundColor: "rgba(136, 136, 136, 0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <center>Loading...</center>
        </div>
      );
      

    useEffect(() => {
        if (userLoggedIn) {
            navigate("/");
            sessionStorage.clear();
            console.log("authenticated")
        }
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
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (isDelay === false) {
                                setIsDelay(true);
                                getOnSubmitHandler(authType, formPayload, navigate, formInputRefs, loadingRef)();
                            }
                        }}
                    >
                        <div className="authHeadButton">
                            <b onClick={() => { handleExpand(); setIsForgotPass(false) }}>Kembali</b>
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
                            type="email"
                            placeholder={isForgotPass ? "Masukan email Terdaftar" : "Masukan email anda"}
                            required
                            onInvalid={(e) =>
                                e.target.setCustomValidity(
                                    "Email harus valid, contoh: user@example.com"
                                )
                            }
                            value={formPayload.email || ""}
                            onChange={(e) => {
                                e.target.setCustomValidity("");
                                setFormPayload({ ...formPayload, email: e.target.value });
                            }}
                            ref={emailRef}
                        />

                        <input
                            disabled={isForgotPass}
                            type="text"
                            placeholder="Masukkan nama anda"
                            style={{ display: !isForgotPass ? toggleAuth ? "" : "none" : "none" }}
                            {...(!true ? { "required": toggleAuth } : {})}
                            onInvalid={(e) =>
                                (!isForgotPass) ? e.target.setCustomValidity("Nama wajib diisi!") : null
                            }
                            value={(formPayload.username) ? formPayload.username : ""}
                            onChange={(e) => {
                                e.target.setCustomValidity("");
                                setFormPayload({ ...formPayload, username: e.target.value });
                            }}
                            ref={usernameRef}
                        />
                        <input
                            disabled={isForgotPass}
                            type="password"
                            style={{ display: toggleAuth ? "" : !isForgotPass ? "" : "none", }}
                            placeholder={!toggleAuth ? "Masukkan Password" : "Buat Password Baru"}
                            required
                            onInvalid={(e) =>
                                e.target.setCustomValidity("Password harus diisi!")
                            }
                            value={(formPayload.password) ? formPayload.password : ""}
                            onChange={(e) => {
                                e.target.setCustomValidity("");
                                setFormPayload({ ...formPayload, password: e.target.value });
                            }}
                            ref={passwordRef}
                        />
                        {(!toggleAuth && !isForgotPass) ? (
                            <p
                                style={{ padding: "0 0.3rem", color: "blue", fontWeight: "500" }}
                                onClick={() => {
                                    setIsForgotPass(!isForgotPass);
                                    handleAuthTypeChange('resetPassword');
                                }}
                            >
                                Lupa kata sandi?
                            </p>
                        ) : null}

                        <input
                            type="submit"
                            value={toggleAuth ? "Mendaftar" : isForgotPass ? "Reset Password" : "Masuk"}
                            className="authRegButton"
                        />
                        {toggleAuth ? (
                            <div className="authToLogin" onClick={() => { setToggleAuth(!toggleAuth); setIsForgotPass(false); handleAuthTypeChange('login') }}>
                                <p style={{ margin: "0", padding: "0", lineHeight: "0", color: "black" }}>
                                    Sudah Punya Akun?
                                </p>
                                Masuk
                            </div>
                        ) : (
                            <div className="authToLogin" onClick={() => { setToggleAuth(!toggleAuth); setIsForgotPass(false); handleAuthTypeChange('register') }}>
                                <p style={{ margin: "0", padding: "0", lineHeight: "0", color: "black" }}>
                                    Belum Punya Akun?
                                </p>
                                Daftar Disini
                            </div>
                        )}
                    </form>
                )}
            </div>
            {isDelay && LoadingDelayAuth}
        </div>
    );

}

export default AuthWebPage;

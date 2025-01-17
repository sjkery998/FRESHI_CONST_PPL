import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth/authcontext";
import { useLocation, useNavigate } from "react-router-dom";

function ProcessPayment() {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const idTransaksi = queryParams.get('transactionId');
    const [snapScr, setSnapScr] = useState(null);  

    useEffect(() => {
        
        if (!userLoggedIn) {
            navigate("/"); 
        } else {
            if (token) {
                const existingScript = document.getElementById("snap-midtrans");
                if (!existingScript) {
                    const script = document.createElement('script');
                    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
                    script.id = "snap-midtrans";  
                    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
                    document.head.appendChild(script);
                    script.onload = () => {
                        console.log('Script Snap berhasil dimuat.');
                        setSnapScr(true);  
                    };
                    script.onerror = () => {
                        console.error('Gagal memuat script Snap.');
                    };
                } else {
                    console.log('Script Snap sudah dimuat sebelumnya.');
                    setSnapScr(true);  
                }
            } else {
                navigate(-1); 
            }
        }
    }, [userLoggedIn, token, navigate]);

    useEffect(() => {
        if (snapScr && token) {
            window.snap.pay(token, {
                onSuccess: async function (result) {
                    navigate("/history", { replace: true });
                },
                onPending: async function (result) {
                    navigate("/history", { replace: true });
                },
                onError: function (result) {
                    console.log('Terjadi kesalahan:', result);
                },
                onClose: function () {
                    navigate("/history", { replace: true });
                }
            });
        }
    }, [snapScr, token]);  

    return (
        <>
            <div id="snap-container"></div>
        </>
    );
}

export default ProcessPayment;

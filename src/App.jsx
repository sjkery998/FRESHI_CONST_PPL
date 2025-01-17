import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Transition from './components/transition.jsx'; <Transition />

import Home from './pages/home.jsx';
import Product from './pages/product.jsx';
import Favorite from './pages/favorite.jsx';
import History from './pages/history.jsx';
import Profile from './pages/profile.jsx';
import ProductDetail from './pages/productDetail.jsx';
import StoreDetail from './pages/storeDetail.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AuthWebPage from './pages/authWebPage.jsx';
import Notification from './pages/notification.jsx';
import ProcessPayment from './pages/processPayment.jsx';
import StoreManagement from './pages/storeManagement.jsx';
import { FirebaseProvider } from "./context/firebaseContext/firebaseContext.jsx";

import './css/App.css'
import ChatPage from './pages/chatPage.jsx';
import ChattingPage from './pages/chattingPage.jsx';
import EditProfilePage from './pages/editProfile.jsx';
import { AuthProvider } from './context/auth/authcontext.jsx';
import { useEffect, useState } from 'react';


function App() {
    const [startY, setStartY] = useState(0);
    const [endY, setEndY] = useState(0);
    const [scrolling, setScrolling] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [overlayOpacity, setOverlayOpacity] = useState(0);

    useEffect(() => {
        const handleTouchStart = (e) => {
            if (window.scrollY === 0) {
                setStartY(e.touches[0].clientY);
                setScrolling(true);
                setOverlayVisible(true);
                setOverlayOpacity(0);
            }
        };

        const handleTouchMove = (e) => {
            if (scrolling) {
                setEndY(e.touches[0].clientY);

                const distance = endY - startY;
                if (distance > 0) {
                    setOverlayOpacity(Math.min(distance / 200, 1));
                }
            }
        };

        const handleTouchEnd = () => {
            const distance = endY - startY;
            if (distance >= 250) {
                console.log("Pulled beyond 200px! Trigger action here.");
                window.location.reload()
            }
            setOverlayOpacity(0);
            setOverlayVisible(false);
            setScrolling(false);
        };

        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [scrolling, endY, startY]);
    return (
        <AuthProvider>
            <FirebaseProvider>

                {overlayVisible && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 2})`,
                            zIndex: 9999,
                            pointerEvents: "none",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            paddingTop: "2rem"
                        }}
                    >
                    </div>
                )}
                <Router>
                    {/* <ScrollToTop /> */}
                    <Transition />
                    <ConditionalNavbar />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Product" element={<Product />} />
                        <Route path="/Favorite" element={<Favorite />} />
                        <Route path="/History" element={<History />} />
                        <Route path="/Profile" element={<Profile />} />
                        <Route path="/StoreDetail" element={<StoreDetail />} />
                        <Route path="/ChatPage" element={<ChatPage />} />
                        <Route path="/Notification" element={<Notification />} />
                        {/* navbar bawah di kecualikan */}
                        <Route path="/ProcessPayment" element={<ProcessPayment />} />
                        <Route path="/ProductDetail" element={<ProductDetail />} />
                        <Route path="/EditProfilePage" element={<EditProfilePage />} />
                        <Route path="/ChattingPage" element={<ChattingPage />} />
                        <Route path="/AuthWebPage" element={<AuthWebPage />} />
                        <Route path="/StoreManagement" element={<StoreManagement />} />
                    </Routes>

                </Router>
            </FirebaseProvider>
        </AuthProvider>
    );
}
function ConditionalNavbar() {
    const location = useLocation();
    const noNavbarRoutes = ['/ProductDetail', '/AuthWebPage', '/ChattingPage', '/EditProfilePage', '/processPayment', '/storeManagement'];

    if (noNavbarRoutes.includes(location.pathname)) {
        return null;
    }

    return <Navbar />;
}
export default App;
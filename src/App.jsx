import { BrowserRouter as Router, Route, Routes,useLocation  } from 'react-router-dom';
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


import './css/App.css'
import ChatPage from './pages/chatPage.jsx';
import ChattingPage from './pages/chattingPage.jsx';
import EditProfilePage from './pages/editProfile.jsx';

function App() {
    return (
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
                <Route path="/ProductDetail" element={<ProductDetail />} />
                <Route path="/EditProfilePage" element={<EditProfilePage />} />
                <Route path="/ChattingPage" element={<ChattingPage />} />
                <Route path="/AuthWebPage" element={<AuthWebPage />} />
            </Routes>
        </Router>
    );
}
function ConditionalNavbar() {
    const location = useLocation();
    const noNavbarRoutes = ['/ProductDetail', '/AuthWebPage', '/ChattingPage', '/EditProfilePage'];

    if (noNavbarRoutes.includes(location.pathname)) {
      return null;
    }
  
    return <Navbar />;
  }
export default App;
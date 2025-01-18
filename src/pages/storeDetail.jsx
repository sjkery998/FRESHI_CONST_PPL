import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/storeDetail.css';
import { FaArrowLeft, FaLocationPin, FaMagnifyingGlass, FaMessage } from 'react-icons/fa6';
import { FaHeart, FaLemon, FaStar } from 'react-icons/fa';
import { getStoreData, getUserId } from '../jsx/dataModel.jsx';
import { addStoreToFav, addVisitoreStore, checkHasChat, generateRandomAlphanumeric, isSelfOwnStore, specifiedTakeData } from '../jsx/dataController.jsx';
import { useAuth } from '../context/auth/authcontext.jsx';
import Swal from 'sweetalert2';
import Transition from '../components/transition.jsx';
import { store } from 'fontawesome';

function StoreDetail() {
    const { userLoggedIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const storeId = params.get('storeId');

    const [isSelfStore, setIsSelfStore] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [storeData, setStoreProducts] = useState({ StoreData: {}, StoreProducts: {} });

    

    const toDetailProduct = (event) => {
        const productId = event.target.closest('.productCase').id.split('-')[1];
        navigate(`/ProductDetail?productId=${productId}`, {
            state: { fromStore: true }
        });
    };


    const toggleFavorite = async () => {
        if (userLoggedIn) {
            const itSelfProd = await isSelfOwnStore(storeId)
            if (itSelfProd) {
                console.log("produkmu");
                return;
            } else {
                try {
                    const userId = await getUserId();
                    setIsFav((prev) => !prev);
                    await addStoreToFav(userId, storeId, !isFav);
                } catch (error) {
                    console.error("Error toggling favorite:", error);
                }
            }
        } else {
            Swal.fire({
                title: "Peringatan!",
                text: "Login untuk menambah toko ke favorit",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Oke",
                timer: 1000,
                timerProgressBar: true,
            });
        }
    };

    function handleBack(){
        navigate('/');
    };


    
    useEffect(() => {
        const addNewVisitor = async ()=>{
            await addVisitoreStore(await getUserId(), storeId)
        }
        const fetchData = async () => {
            try {
                const data = await getStoreData(storeId);
                setStoreProducts(data);
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };

        const fetchIsFav = async () => {
            if (userLoggedIn) {
                try {
                    const userId = await getUserId();
                    const fav = await specifiedTakeData("Accounts", userId, `FavStore/${storeId}`);
                    console.log(fav)
                    setIsFav(fav);
                } catch (error) {
                    console.error("Error checking favorite status:", error);
                }
            }
        };


        fetchData();
        fetchIsFav();
        addNewVisitor();
    }, [storeId, userLoggedIn]);

    useEffect(() => {
        const checkIsSelf = async () => {
            if (storeData?.StoreData) {
                const UID = await getUserId();
                setIsSelfStore(UID === storeData.StoreData.UserId);
            }
        };
        checkIsSelf();
    }, [storeData]);
    
    return (
        <>
            <Transition />
            <div className="StoreDetailLogoCase">
                <FaArrowLeft style={{ fontSize: "1.2rem", cursor: 'pointer' }} onClick={()=>{handleBack()}} />
                <b>{storeData.StoreData.StoreName}</b>
            </div>
            <div className="StoreDetailsPage">
                <div className="mainStorCase">
                    <div className="storeBackgroudCase">
                        <img src="/images/storeBack.png" alt="" />
                    </div>
                    <div className="storeDetailCase">
                        <div className="storeDetailAvatar">
                            <img src="/images/storeAvatar.png" alt="" />
                        </div>
                        <div className='storeDetailHeadCase'>
                            <div className="storeDetailHeadline">
                                <b>{storeData.StoreData.StoreName} {isSelfStore ? "(Anda)" : ""}</b>
                                <p><FaLocationPin /> {storeData.StoreData.StoreAddress}</p>
                            </div>
                            <div className="storeChatBox" onClick={async () => {
                                if (userLoggedIn) {
                                    const chtid = storeData?.StoreData?.UserId? await checkHasChat(storeData.StoreData.UserId) : false;
                                    if (chtid && chtid?.status === true) {
                                        if(isSelfStore === false){
                                            navigate(`/ChattingPage?${chtid.ChatId}`)
                                        }else{
                                            Swal.fire({
                                                title: "Toko Anda!",
                                                text: "Tak mengirim permintaan pesan",
                                                icon: "warning",
                                                confirmButtonColor: "#3085d6",
                                                confirmButtonText: "oke",
                                            })
                                        }
                                    } else {
                                        const chatIds = generateRandomAlphanumeric()
                                        if(isSelfStore === false){
                                            navigate(`/ChattingPage?${chatIds}-${storeId}`)
                                        }else{
                                            Swal.fire({
                                                title: "Toko Anda!",
                                                text: "Tak mengirim permintaan pesan",
                                                icon: "warning",
                                                confirmButtonColor: "#3085d6",
                                                confirmButtonText: "oke",
                                            })
                                        }
                                    }
                                } else {
                                    Swal.fire({
                                        title: "Peringatan!",
                                        text: "Login untuk mengirim pesan",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        confirmButtonText: "Iya",
                                        cancelButtonColor: "red",
                                        cancelButtonText: "Nanti",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            sessionStorage.setItem("lastBeforeLogin", window.location.href);
                                            window.location.href = "/AuthWebPage";
                                        }
                                    });
                                }
                            }}>
                                <b>Pesan</b>
                                <FaMessage />
                            </div>
                        </div>
                        <div className="storeDetailInfo">
                            <div>
                                <b>Kategori Produk</b>
                                <p>{storeData?.StoreData?.category}</p>
                            </div>
                            <div className="lineSeparator"></div>
                            <div>
                                <b>Rating</b>
                                <p><FaStar /> {storeData?.StoreData?.rating?.rating}</p>
                            </div>
                            <div className="lineSeparator"></div>
                            <div>
                                <b>Produk</b>
                                <p>{storeData?.StoreData?.Products?.Total}</p>
                            </div>
                            <div className="lineSeparator"></div>
                            <div>
                                <b>Terjual</b>
                                <p>200</p>
                            </div>
                        </div>
                        <div className="storeSearchCase">
                            <div className="sSearchBox">
                                <FaMagnifyingGlass className='sSboxMag' />
                                <input type="text" placeholder='Cari Produk Toko' />
                                <FaLemon className='sSboxLemon' />
                            </div>
                            <div className="sFavoriteBox" onClick={toggleFavorite}>
                                <b>Favorite</b>
                                <FaHeart style={{ color: isFav ? "red" : "" }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Products">
                    <div className="title" style={{ fontWeight: "400", fontSize: "0.9rem" }}>Produk Toko Ini</div>
                    <div className="contents">
                        {Object.entries(storeData.StoreProducts).map(([key, product]) => (
                            <div className="productCase" key={key + 'cs'} id={"prod-" + product.id} onClick={toDetailProduct}>
                                <div className="imageCase" style={{ backgroundImage: `url(${product.image})` }}></div>
                                <div className="details">
                                    <div>
                                        <b>{product.name}</b>
                                        <p>{product.storeName}</p>
                                        <p>{product.desc}</p>
                                    </div>
                                    <div className="priceRating">
                                        <div className="price">
                                            <p>{String(product.quantity).split("|")[0]}Kg</p>
                                            <p>Rp.{product.price}</p>
                                        </div>
                                        <div className="rating">
                                            <FaStar style={{ color: "orange" }} />
                                            <p>{product.rating.Rating}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StoreDetail;

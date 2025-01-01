import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/storeDetail.css'
import { GoArrowLeft } from 'react-icons/go';
import { FaArrowLeft, FaLocationPin, FaMagnifyingGlass, FaMessage } from 'react-icons/fa6';
import { FaHeart, FaLemon, FaStar } from 'react-icons/fa';
import { productsData } from '../jsx/dataModel.jsx';

function StoreDetail() {
    const location = useLocation();
    const [saveScroll, setSaveScroll] = useState(false);
    const params = new URLSearchParams(location.search);
    const storeId = params.get('storeId');

    const navigate = useNavigate();

    const toDetailProduct = (event) => {

        const productId = event.target.closest('.productCase').id.split('-')[1];
        navigate(`/ProductDetail?productId=${productId}`);
    };

    const handleBack = () => {
        navigate(-1);
    };




    return (
        <>
            <div className="StoreDetailLogoCase">
                <FaArrowLeft style={{fontSize:"1.2rem", cursor: 'pointer' }} onClick={handleBack} />
                <b>Pak Joko Kendil</b>
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
                                <b>Pak Joko Kendil</b>
                                <p><FaLocationPin /> Lampung Timur</p>
                            </div>
                            <div className="storeChatBox">
                                <b>Pesan</b>
                                <FaMessage />
                            </div>
                        </div>
                        <div className="storeDetailInfo">
                            <div>
                                <b>Kategori Produk</b>
                                <p>Buah Dan Sayuran</p>
                            </div>
                            <div className="lineSeparator"></div>
                            <div>
                                <b>Rating</b>
                                <p><FaStar /> 4.6</p>
                            </div>
                            <div className="lineSeparator"></div>
                            <div>
                                <b>Produk</b>
                                <p>20</p>
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
                            <div className="sFavoriteBox">
                                <b>Favorite</b>
                                <FaHeart />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="Products">
                    <div className="title" style={{fontWeight:"400", fontSize:"0.9rem"}}>Produk Toko Ini</div>
                    <div className="contents">
                        {productsData.map((product, index) => (
                            <div className="productCase" key={product.id + 'cs'} id={"prod-" + product.id} onClick={toDetailProduct}>
                                <div className="imageCase" style={{ backgroundImage: `url(${product.image})` }}></div>
                                <div className="details">
                                    <div>
                                        <b>{product.name}</b>
                                        <p>{product.storeName}</p>
                                        <p>{product.desc}</p>
                                    </div>
                                    <div className="priceRating">
                                        <div className="price">
                                            <p>{product.weight}</p>
                                            <p>{product.price}</p>
                                        </div>
                                        <div className="rating">
                                            <p>#</p>
                                            <p>{product.rating}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default StoreDetail
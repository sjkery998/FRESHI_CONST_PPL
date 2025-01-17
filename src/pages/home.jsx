import React, { useEffect, useState } from 'react';
import MainCarousel from '../components/mainCarousel';
import '../css/home.css';
import '../css/webComponents.css';
import { faGift, faHandshake, faLemon, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { productsData, storesData } from '../jsx/dataModel.jsx';
import Transition from '../components/transition.jsx';
import { FaStar } from 'react-icons/fa6';
// Komponen untuk Toko


function Home() {

    const navigate = useNavigate();
    const toDetailProduct = (event) => {
        const productId = event.target.closest('.productCase').id.split('-')[1];
        navigate(`/ProductDetail?productId=${productId}`);
    };
    const toDetailStore = (event) => {
        const storeId = event.target.closest(".storeCase").id.split('-')[1];
        navigate(`/StoreDetail?storeId=${storeId}`);
    }
    const Store = ({ StoreName, category, rating, StoreId }) => (
        <div className="storeCase" id={"store-" + StoreId} onClick={toDetailStore}>
            <div className="leftContent">
                <div className="image">
                    <img src="/images/storeAvatar.png" alt="" />
                </div>
                <div className="details">
                    <b>{StoreName}</b>
                    <p>{category}</p>
                </div>
            </div>
            <div className="rightContent">
                <b style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"0.1rem", lineHeight:"1",}}>{rating.rating} <FaStar style={{lineHeight:"0", color: "orange"}}></FaStar></b>
                <p style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                }}>Kunjungi Toko</p>
            </div>
        </div>
    );

    const toProfle = () => {
        // navigate("/Profile");
    }
    const toProduct = () => {
        navigate("/Product");
    }

    

    useEffect(() => {
        const lastScrollPosition = sessionStorage.getItem('lastScrollPosition');
        if (lastScrollPosition) {
            window.scrollTo({ top: lastScrollPosition, behavior: 'smooth' });
        }
        return () => {
            sessionStorage.setItem('lastScrollPosition', window.scrollY);
        };
    }, []);

    return (
        <>
            <Transition />
            <div className="logo-case">
                <img src="/images/Logo.png" alt="Logo" />
            </div>
            <div className="HomePage">
                <MainCarousel />

                <div className="welcome-container">
                    <div className="top-case">
                        <div className="left-side">
                            <h1>Fresh.I</h1>
                            <p>Fruits</p>
                            <p>Marketplace</p>
                            <div><p>Product</p><FontAwesomeIcon icon={faLemon} style={{ marginTop: '3px' }} /> <p>120k</p></div>
                        </div>
                        <div className="right-side">
                            <div className="r-top">
                                <div><b>Dari Petani Ke Pembeli Langsung</b> <FontAwesomeIcon icon={faGift} /></div>
                            </div>
                            <div className="r-bot">
                                <p>Belanja Buah-Buahan</p>
                                <p>Segar</p>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-case">
                        <button onClick={toProduct}>Belanja <FontAwesomeIcon icon={faShoppingBag} /></button>
                        <br />
                        <button onClick={toProfle}>Bergabung Mitra Sekarang <FontAwesomeIcon icon={faHandshake} /></button>
                    </div>
                </div>

                <div className="newProduct">
                    <div className="headline">
                        <div className="title">Untuk Anda</div>
                        <div className="viewAll">Selengkapnya</div>
                    </div>
                    <div className="contents">
                        {Object.entries(productsData).map(([key, products]) => (
                            <div className="productCase" key={key + 'a'} id={"new-" + products.id} onClick={toDetailProduct}>
                                <div className="imageCase" style={{ backgroundImage: `url(${products.image})` }}></div>
                                <div className="details">
                                    <b>{products.name}</b>
                                    <div className="priceRating">
                                        <div className="price">
                                            <p>{String(products.quantity).split("|")[0]}Kg</p>
                                            <p>Rp.{products.price}</p>
                                        </div>
                                        <div className="rating">
                                            <FaStar style={{ color: "orange" }} />
                                            <p>{products.rating.Rating}</p> {/* Mengakses product.rating.Rating */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="newProduct">
                    <div className="headline">
                        <div className="title">Buah-Buahan Terbaru</div>
                        <div className="viewAll">Selengkapnya</div>
                    </div>
                    <div className="contents">
                        {Object.entries(productsData).map(([key, products2]) => (
                            <div className="productCase" key={key + 'a'} id={"new-" + products2.id} onClick={toDetailProduct}>
                                <div className="imageCase" style={{ backgroundImage: `url(${products2.image})` }}></div>
                                <div className="details">
                                    <b>{products2.name}</b>
                                    <div className="priceRating">
                                        <div className="price">
                                            <p>{String(products2.quantity).split("|")[0]}Kg</p>
                                            <p>Rp.{products2.price}</p>
                                        </div>
                                        <div className="rating">
                                            <FaStar style={{ color: "orange" }} />
                                            <p>{products2.rating.Rating}</p> {/* Mengakses product.rating.Rating */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="storeContainer">
                    <div className="headline">
                        <div className="title">Toko Terpopuler</div>
                        <div className="viewAll">Selengkapnya</div>
                    </div>
                    <div className="contents">
                        {Object.entries(storesData).map(([key, store]) => (
                            <Store key={key + "s"} {...store} />
                        ))}
                    </div>
                </div>

                <div className="Products">
                    <div className="headline">
                        <div className="title">Temukan</div>
                        <div className="viewAll"
                            onClick={toProduct}
                        >Selengkapnya</div>
                    </div>
                    <div className="contents">
                        {Object.entries(productsData).map(([key, products]) => (
                            <div className="productCase" key={key + 'c'} id={"prod-" + products.id} onClick={toDetailProduct}>
                                <div className="imageCase" style={{ backgroundImage: `url(${products.image})` }}></div>
                                <div className="details">
                                    <div>
                                        <b>{products.name}</b>
                                        <p>{products.storeName}</p>
                                        <p>{products.desc}</p>
                                    </div>
                                    <div className="priceRating">
                                        <div className="price">
                                            <p>{String(products.quantity).split("|")[0]}Kg</p>
                                            <p>Rp.{products.price}</p>
                                        </div>
                                        <div className="rating">
                                            <FaStar style={{ color: "orange" }} />
                                            <p>{products.rating.Rating}</p>
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

export default Home;

import React, { useEffect } from 'react';
import MainCarousel from '../components/mainCarousel';
import '../css/home.css';
import '../css/webComponents.css';
import { faGift, faHandshake, faLemon, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { productsData, storesData } from '../jsx/dataModel.jsx';
import Transition from '../components/transition.jsx';
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
    const Store = ({ name, category, rating, storeId }) => (
        <div className="storeCase" id={"store-" + storeId} onClick={toDetailStore}>
            <div className="leftContent">
                <div className="image">
                    <img src="/images/storeAvatar.png" alt="" />
                </div>
                <div className="details">
                    <b>{name}</b>
                    <p>{category}</p>
                </div>
            </div>
            <div className="rightContent">
                <b>{rating}</b>
                <p style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                }}>Kunjungi Toko</p>
            </div>
        </div>
    );

    const toProfle=()=>{
        navigate("/Profile");
    }
    const toProcut=()=>{
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
                        <button onClick={toProcut}>Belanja <FontAwesomeIcon icon={faShoppingBag} /></button>
                        <br />
                        <button onClick={toProfle}>Bergabung Mitra Sekarang <FontAwesomeIcon icon={faHandshake} /></button>
                    </div>
                </div>

                <div className="newProduct">
                    <div className="headline">
                        <div className="title">Buah-Buahan Terbaru</div>
                        <div className="viewAll">Selengkapnya</div>
                    </div>
                    <div className="contents">
                        {productsData.map((product, index) => (
                            <div className="productCase" key={product.id + 'a'} id={"new-" + product.id} onClick={toDetailProduct}>
                                <div className="imageCase" style={{ backgroundImage: `url(${product.image})` }}></div>
                                <div className="details">
                                    <b>{product.name}</b>
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

                <div className="newProduct">
                    <div className="headline">
                        <div className="title">Buah-Buahan Terbaru</div>
                        <div className="viewAll">Selengkapnya</div>
                    </div>
                    <div className="contents">
                        {productsData.map((products2, index) => (
                            <div className="productCase" key={products2.id + 'b'} id={"new-" + products2.id} onClick={toDetailProduct}>
                                <div className="imageCase" style={{ backgroundImage: `url(${products2.image})` }}></div>
                                <div className="details">
                                    <b>{products2.name}</b>
                                    <div className="priceRating">
                                        <div className="price">
                                            <p>{products2.weight}</p>
                                            <p>{products2.price}</p>
                                        </div>
                                        <div className="rating">
                                            <p>#</p>
                                            <p>{products2.rating}</p>
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
                        {storesData.map((store, index) => (
                            <Store key={index} {...store} />
                        ))}
                    </div>
                </div>

                <div className="Products">
                    <div className="headline">
                        <div className="title">Buah-Buahan Terbaru</div>
                        <div className="viewAll">Selengkapnya</div>
                    </div>
                    <div className="contents">
                        {productsData.map((products, index) => (
                            <div className="productCase" key={products.id + 'c'} id={"prod-" + products.id} onClick={toDetailProduct}>
                                <div className="imageCase" style={{ backgroundImage: `url(${products.image})` }}></div>
                                <div className="details">
                                    <div>
                                        <b>{products.name}</b>
                                        <p>{products.storeName}</p>
                                        <p>{products.desc}</p>
                                    </div>
                                    <div className="priceRating">
                                        <div className="price">
                                            <p>{products.weight}</p>
                                            <p>{products.price}</p>
                                        </div>
                                        <div className="rating">
                                            <p>#</p>
                                            <p>{products.rating}</p>
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

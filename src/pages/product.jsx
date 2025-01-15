import React, { useEffect, useState } from 'react';
import MainCarousel from '../components/mainCarousel';
import '../css/webComponents.css';
import '../css/product.css';
import { faLemon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { productsData, storesData } from '../jsx/dataModel.jsx';
import { useNavigate } from 'react-router-dom';
import Transition from '../components/transition.jsx';
import { FaStar } from 'react-icons/fa6';

function Product() {
    const navigate = useNavigate();
    const toDetailProduct = (event) => {
        const productId = event.target.closest('.productCase').id.split('-')[1];
        navigate(`/ProductDetail?productId=${productId}`);
    };
    const toDetailStore = (event) => {
        const storeId = event.target.closest(".storeCase").id.split('-')[1];
        navigate(`/StoreDetail?storeId=${storeId}`);
    };
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredProducts = Object.entries(productsData).filter(
        ([key, product]) =>
            Object.entries(product).some(value =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
    );
    const filteredStores = Object.entries(storesData).filter(
        ([key, store]) =>
            Object.entries(store).some(value =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
    );
    const filteredResults =
        activeFilter === 'all'
            ? [
                ...filteredProducts.map(([key, product]) => ({
                    ...product,
                    type: 'product',
                    key: product.id,
                })),
                ...filteredStores.map(([key, store]) => ({
                    ...store,
                    type: 'store',
                    key: store.storeId,
                }))
            ]
            : activeFilter === 'products'
                ? filteredProducts.map(([key, product]) => ({
                    ...product,
                    type: 'product',
                    key: product.id,
                }))
                : filteredStores.map(([key, store]) => ({
                    ...store,
                    type: 'store',
                    key: store.storeId,
                }));

    let lastScrollTop = 0;
    const searchBarToFix = () => {
        const topLogoElement = document.querySelector('.ProductsPageLogoCase');
        const searchContainerElement = document.querySelector('.searchContainer');
        const prodElement = document.querySelector('.Products');
        if (topLogoElement && searchContainerElement) {
            const fixedRect = topLogoElement.getBoundingClientRect();
            const searchRect = searchContainerElement.getBoundingClientRect();
            const prodRect = prodElement.getBoundingClientRect();
            const isFixed = window.getComputedStyle(searchContainerElement).position === 'fixed';
            const isOverlap = !(fixedRect.bottom < searchRect.top || fixedRect.top > searchRect.bottom);
            const isBottomTouchingTop = searchRect.bottom <= (prodRect.top + 115);
            const currentScrollTop = window.scrollY;
            if (currentScrollTop > lastScrollTop && !isFixed) {
                if (isOverlap) {
                    document.querySelector(".Products").setAttribute('style', "padding-top : 131.7px");
                    searchContainerElement.setAttribute('style', 'position: fixed; top: 64px; width: calc(100% - 2rem); background-color: white;');
                }
            }
            if (isFixed && isBottomTouchingTop) {
                document.querySelector(".Products").removeAttribute('style');
                searchContainerElement.removeAttribute('style');
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', searchBarToFix);
        return () => {
            window.removeEventListener('scroll', searchBarToFix);
        };
    }, []);
    return (
        <>
            <Transition />
            <div className="ProductsPageLogoCase" style={{ fontSize: "1rem" }}>
                Product
            </div>
            <div className="ProductsPage">
                <MainCarousel />
                <div className="searchContainer">
                    <form
                        className="searchBar"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSearchQuery(e.target.searchInput.value);
                        }}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setSearchQuery("");
                            }
                        }}
                    >
                        <input
                            type="text"
                            name="searchInput"
                            placeholder="Cari Produk atau Toko"
                            defaultValue={searchQuery}
                        />
                        <button type="submit" style={{ background: "none", border: "none" }}>
                            <FontAwesomeIcon icon={faLemon} />
                        </button>
                    </form>
                    <div className="filters">
                        {[
                            { key: 'all', label: 'Semua' },
                            { key: 'products', label: 'Produk' },
                            { key: 'stores', label: 'Toko' }
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                className={activeFilter === filter.key ? 'activeFilter' : ''}
                                onClick={() => setActiveFilter(filter.key)}
                                style={{
                                    backgroundColor: activeFilter === filter.key ? '#73B065' : '',
                                    color: activeFilter === filter.key ? 'white' : 'black',
                                }}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="Products">
                    <div className="headline">
                        <div className="title">
                            <b>{searchQuery ? `Hasil Pencarian untuk "${searchQuery}"` : 'Temukan'}</b>
                        </div>
                    </div>
                    <div className="contents Results">
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item) => {
                                if (item.type === 'store') {

                                    return activeFilter !== 'products' ? (
                                        <div className="storeCase" key={`storeKey-` + item.StoreId} id={"store-" + item.StoreId} onClick={toDetailStore}>
                                            <div className="leftContent">
                                                <div className="image">
                                                    <img src="/images/storeAvatar.png" alt="" />
                                                </div>
                                                <div className="details" style={{ gap: "0" }}>
                                                    <b>{item.StoreName}</b>
                                                    <p>Jumlah Produk: {item.Products.Total}</p>
                                                    <p>{item.category}</p>
                                                </div>
                                            </div>
                                            <div className="rightContent">
                                                <b style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.1rem", lineHeight: "1", }}>{item.rating.rating} <FaStar style={{ lineHeight: "0", color: "orange" }}></FaStar></b>
                                                <p style={{
                                                    userSelect: 'none',
                                                    WebkitUserSelect: 'none',
                                                    MozUserSelect: 'none',
                                                    msUserSelect: 'none'
                                                }}>Kunjungi Toko</p>
                                            </div>
                                        </div>
                                    ) : null;
                                } else if (item.type === 'product') {

                                    return activeFilter !== 'stores' ? (
                                        <div className="productCase" key={`productKey` + item.id} id={"product-" + item.id} onClick={toDetailProduct}>
                                            <div className="imageCase" style={{ backgroundImage: `url(${item.image})` }}></div>
                                            <div className="details">
                                                <div>
                                                    <b>{item.name}</b>
                                                    <p>{item.storeName}</p>
                                                    <p>{item.desc}</p>
                                                </div>
                                                <div className="div">
                                                    <div className="price">
                                                        <p>{String(item.quantity).split("|")[0]}Kg</p>
                                                        <p>Rp.{item.price}</p>
                                                    </div>
                                                    <div className="rating">
                                                        <FaStar style={{ color: "orange" }} />
                                                        <p>{item.rating.Rating} 200 Terjual</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null;
                                }
                            })
                        ) : (
                            <p>Pencarian Tidak Ditemukan.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Product;

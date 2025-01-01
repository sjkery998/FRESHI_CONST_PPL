import React, { useState } from "react";
import "../css/favorite.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faLocation, faLocationDot, faStar, faStore } from "@fortawesome/free-solid-svg-icons";
import Transition from "../components/transition.jsx";

function Favorite() {
    const stores = [
        { storeName: 'Pak Joko Garden', category: 'Buah dan Sayuran', rating: '#4.6', id: "store1", location: "Jakarta" },
        { storeName: 'Toko Buah Sehat', category: 'Segar dan Organik', rating: '#4.7', id: "store2", location: "Jakarta" },
        { storeName: 'Toko Buah Sehat', category: 'Segar dan Organik', rating: '#4.7', id: "store3", location: "Jakarta" },
        { storeName: 'Toko Buah Sehat', category: 'Segar dan Organik', rating: '#4.7', id: "store4", location: "Jakarta" },
        { storeName: 'Toko Buah Sehat', category: 'Segar dan Organik', rating: '#4.7', id: "store5", location: "Jakarta" },
        // Tambah toko lainnya
    ];
    const products = [
        {
            id: "prod1",
            category: "Buah",
            name: "Apel Merah",
            weight: "1kg",
            price: "Rp.60000",
            rating: "4.5",
            image: "/images/apple-green.jpg",
            desc: "Buah Apel Merah segar langsung dari kebun",
            storeName: "Toko Buah Segar",
            location: "Jakarta",
        },
        {
            id: "prod2",
            category: "Buah",
            name: "Mangga Manis",
            weight: "2kg",
            price: "Rp.80000",
            rating: "4.7",
            image: "/images/apple-green.jpg",
            desc: "Mangga harum manis, cocok untuk jus",
            storeName: "Mangga Manis Store",
            location: "Bandung",
        },
        {
            id: "prod3",
            category: "Buah",
            name: "Jeruk Nipis",
            weight: "500g",
            price: "Rp.25000",
            rating: "4.2",
            image: "/images/apple-green.jpg",
            desc: "Jeruk nipis segar untuk minuman",
            storeName: "Citrus Fresh",
            location: "Surabaya",
        },
        {
            id: "prod4",
            category: "Buah",
            name: "Pisang Raja",
            weight: "1.5kg",
            price: "Rp.45000",
            rating: "4.8",
            image: "/images/apple-green.jpg",
            desc: "Pisang Raja matang sempurna",
            storeName: "Pisang Corner",
            location: "Medan",
        },
        {
            id: "prod5",
            category: "Buah",
            name: "Anggur Hitam",
            weight: "1kg",
            price: "Rp.90000",
            rating: "4.6",
            image: "/images/apple-green.jpg",
            desc: "Anggur hitam manis dan segar",
            storeName: "Toko Anggur Asli",
            location: "Malang",
        },
        {
            id: "prod6",
            category: "Buah",
            name: "Semangka Merah",
            weight: "2kg",
            price: "Rp.50000",
            rating: "4.9",
            image: "/images/apple-green.jpg",
            desc: "Semangka manis cocok untuk berbuka",
            storeName: "Buah Tropis",
            location: "Denpasar",
        },
        {
            id: "prod7",
            category: "Buah",
            name: "Pepaya California",
            weight: "1kg",
            price: "Rp.30000",
            rating: "4.3",
            image: "/images/apple-green.jpg",
            desc: "Pepaya California kaya vitamin",
            storeName: "Pepaya Lovers",
            location: "Makassar",
        },
        {
            id: "prod8",
            category: "Buah",
            name: "Strawberry Segar",
            weight: "500g",
            price: "Rp.70000",
            rating: "4.8",
            image: "/images/apple-green.jpg",
            desc: "Strawberry segar dari pegunungan",
            storeName: "Berry Fresh",
            location: "Bogor",
        },
        {
            id: "prod9",
            category: "Buah",
            name: "Kelapa Muda",
            weight: "1kg",
            price: "Rp.25000",
            rating: "4.4",
            image: "/images/apple-green.jpg",
            desc: "Kelapa muda segar untuk es kelapa",
            storeName: "Kelapa Hijau",
            location: "Semarang",
        },
        {
            id: "prod10",
            category: "Buah",
            name: "Durian Montong",
            weight: "1kg",
            price: "Rp.120000",
            rating: "4.9",
            image: "/images/apple-green.jpg",
            desc: "Durian montong asli Thailand",
            storeName: "Durian Premium",
            location: "Palembang",
        },
    ];

    const [activeTab, setActiveTab] = useState("produk");
    const [favoriteProducts, setFavoriteProducts] = useState([]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const toggleFavorite = (productId) => {
        setFavoriteProducts((prevFavorites) => {
            if (prevFavorites.includes(productId)) {
                return prevFavorites.filter((id) => id !== productId);
            } else {
                return [...prevFavorites, productId];
            }
        });
    };

    return (
        <>
            <Transition />
            <div className="FavoritePage">
                <div className="FavHeading">
                    <div className="FavoritePageLogoCase" style={{ fontSize: "1rem" }}>Favorite</div>
                    <div className="favSwitch">
                        <p
                            className={activeTab === "produk" ? "active" : ""}
                            onClick={() => handleTabClick("produk")}
                        >
                            Produk
                        </p>
                        <p
                            className={activeTab === "store" ? "active" : ""}
                            onClick={() => handleTabClick("store")}
                        >
                            Store
                        </p>
                    </div>
                </div>
                <div className="container" id="FavProd" style={{ display: activeTab === "produk" ? "" : "none" }}>
                    {products.map((product) => (
                        <div className="cardCase" key={product.id}>
                            <div className="storeCase">
                                <div className="leftSide">
                                    <b> <FontAwesomeIcon icon={faStore} style={{ color: 'red' }}></FontAwesomeIcon> {product.storeName}</b>
                                    <div style={{ lineHeight: '0.5rem', fontWeight: "300" }} > <FontAwesomeIcon icon={faStar} style={{ color: 'orange' }} ></FontAwesomeIcon> {product.rating} | 200 terjual</div>
                                    <p>{product.category}</p>
                                </div>
                                <div className="rightSide">
                                    <p> <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon> {product.location}</p>
                                </div>
                            </div>
                            <div className="separator"></div>
                            <div className="FavProductCase">
                                <div className="details">
                                    <div style={{}}>
                                        <b>{product.name}</b>
                                        <br />
                                        <b style={{ marginTop: "5px" ,fontSize:"0.7rem"}}>
                                            {product.weight} {product.price}
                                        </b>
                                        <p>{product.desc}</p>
                                    </div>
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        id="btnFav"
                                        className={
                                            favoriteProducts.includes(product.id)
                                                ? "favorited"
                                                : ""
                                        }
                                        onClick={() => toggleFavorite(product.id)}
                                    ></FontAwesomeIcon>
                                </div>
                                <div className="rightSide">
                                    <img src={product.image} alt={product.name} />
                                    <button>Beli</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="container" id="FavStore" style={{ display: activeTab === "store" ? "" : "none" }}>
                    {stores.map((store) => (
                        <div className="cardCase favStoreCase" key={store.id}>
                            <div className="storeCase">
                                <div className="favStoreLside">
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <div className="storePic"> <img src="/images/storeAvatar.png" alt="" /></div>
                                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", fontSize: "0.8rem", gap: "0", marginTop: "2px" }}>
                                            <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                                            <b style={{ marginTop: "1px" }}>4.6</b>
                                        </div>
                                    </div>
                                    <div>
                                        <b> {store.storeName}</b>
                                        <p> <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon> {store.location}</p>
                                        <p>{store.category}</p>
                                    </div>
                                </div>
                                <div className="rightSide">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        id="btnFav"
                                        className={
                                            favoriteProducts.includes(store.id)
                                                ? "favorited"
                                                : ""
                                        }
                                        onClick={() => toggleFavorite(store.id)}
                                    ></FontAwesomeIcon>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Favorite;

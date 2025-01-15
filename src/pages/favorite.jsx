import React, { useEffect, useState } from "react";
import "../css/favorite.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faLocationDot, faStar, faStore } from "@fortawesome/free-solid-svg-icons";
import Transition from "../components/transition.jsx";
import { toAuthWebPage } from "../jsx/isAuthChecker.jsx";
import { useNavigate } from "react-router-dom";
import { getFavData, getUserId } from "../jsx/dataModel.jsx";
import { addProdToFav, addStoreToFav } from "../jsx/dataController.jsx";
import { useAuth } from "../context/auth/authcontext.jsx";

const Favorite = () => {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();


    const [favData, setFavData] = useState({ FavProducts: [], FavStores: [] });
    const [isFav, setIsFav] = useState(true);
    const [activeTab, setActiveTab] = useState("produk");
    const [loading, setLoading] = useState(true);

    const toDetailProduct = (event) => {
        if (event.target.id !== "btnFav") {
            const productId = event.target.closest('.cardCase').id.split('-')[1];
            navigate(`/ProductDetail?productId=${productId}`, {
                state: { fromFavorite: true }
            });
        }
    };
    const toDetailStore = (event) => {
        if (event.target.id !== "btnFavStore") {
            const storeId = event.target.closest(".storeCase").id.split('-')[1];
            navigate(`/StoreDetail?storeId=${storeId}`, {
                state: { fromFavorite: true }
            });
        }
    };
    const handleTabClick = (tab) => setActiveTab(tab);
    const unFavProd = async (productId) => {
        try {
            const userId = await getUserId();
            setFavData((prev) => ({
                ...prev,
                FavProducts: prev.FavProducts.filter((product) => product.id !== productId),
            }));
            await addProdToFav(userId, productId, null);
            console.log(isFav);
            console.log(`Produk dengan ID ${productId} telah dihapus dari favorit`);
        } catch (error) {
            console.error("Terjadi kesalahan saat menghapus produk dari favorit:", error);
        }
    };


    const unFavStore = async (storeId) => {
        try {
            const userId = await getUserId();
            setFavData((prev) => ({
                ...prev,
                FavStores: prev.FavStores.filter((store) => store.StoreId !== storeId),
            }));
            await addStoreToFav(userId, storeId, null);
            console.log(isFav);
            console.log(`Toko dengan ID ${storeId} telah dihapus dari favorit`);
        } catch (error) {
            console.error("Terjadi kesalahan saat menghapus toko dari favorit:", error);
        }
    };


    useEffect(() => {
        if (userLoggedIn) {
            setLoading(true);
            getFavData()
                .then((data) => setFavData(data))
                .catch((err) => console.error("Error fetching favorite data:", err))
                .finally(() => setLoading(false));
        }
    }, [userLoggedIn, isFav]);


    if (!userLoggedIn) {
        return (
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
                            Toko
                        </p>
                    </div>
                </div>
                <p
                    onClick={() => {
                        sessionStorage.setItem("lastBeforeLogin", window.location.href);
                        toAuthWebPage(navigate);
                    }}
                    style={{
                        top: "110px",
                        position: "absolute",
                        textAlign: "center",
                        width: "100%",
                        margin: "auto",
                    }}
                >
                    Harap Login Terlebih Dahulu <br />
                    <b style={{ color: "blue" }}>Klik untuk login</b>
                </p>
            </div>
        );
    }


    if (loading) {
        return "";
    }

    return (
        <>
            <Transition />
            <div className="FavoritePage">
                <div className="FavHeading">
                    <div className="FavoritePageLogoCase" style={{ fontSize: "1rem" }}>Favorite</div>
                    <div className="favSwitch">
                        <p
                            style={{ fontSize: "0.8rem" }}
                            className={activeTab === "produk" ? "active" : ""}
                            onClick={() => handleTabClick("produk")}
                        >
                            Produk
                        </p>
                        <p style={{ fontSize: "0.8rem" }}
                            className={activeTab === "store" ? "active" : ""}
                            onClick={() => handleTabClick("store")}
                        >
                            Toko
                        </p>
                    </div>
                </div>

                {/* Tab Produk */}
                {activeTab === "produk" && (
                    <div className="container" id="FavProd">
                        {favData.FavProducts.length > 0 ? (
                            favData.FavProducts.map((product) => (
                                <div className="cardCase" id={"productId-" + product.id} key={product.id + "fs"}

                                >
                                    <div className="storeCase">
                                        <div className="leftSide">
                                            <b>
                                                <FontAwesomeIcon
                                                    id="BtnToFav"
                                                    icon={faStore}
                                                    style={{ color: "red" }}
                                                />{" "}
                                                {product.storeName}
                                            </b>
                                            <div style={{ lineHeight: "0.5rem", fontWeight: "300" }}>
                                                <FontAwesomeIcon
                                                    icon={faStar}
                                                    style={{ color: "orange" }}
                                                />{" "}
                                                {product.rating.Rating} | 200 terjual
                                            </div>
                                        </div>
                                    </div>
                                    <div className="separator"></div>
                                    <div className="FavProductCase">
                                        <div className="details">
                                            <div>
                                                <b>{product.name}</b>
                                                <br />
                                                <b style={{ marginTop: "5px", fontSize: "0.7rem" }}>
                                                    {product.quantity.split("|")[0] + "Kg"}{" "}
                                                    {"Rp." + product.price}
                                                </b>
                                                <p>{product.desc}</p>
                                            </div>
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                id="btnFav"
                                                style={{ color: isFav ? "red" : "" }}
                                                onClick={() => unFavProd(product.id)}
                                            />
                                        </div>
                                        <div className="rightSide">
                                            <img src={product.image} alt={product.name} />
                                            <button onClick={(e) => {
                                                toDetailProduct(e);
                                            }}>Beli</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center" }}>Tidak ada produk favorit.</p>
                        )}
                    </div>
                )}

                {/* Tab Store */}
                {activeTab === "store" && (
                    <div className="container" id="FavStore">
                        {favData.FavStores.length > 0 ? (
                            favData.FavStores.map((store) => (
                                <div className="cardCase favStoreCase" key={store.StoreId + "f"}>
                                    <div className="storeCase" id={`favStore-${store.StoreId}`}
                                        onClick={(e) => {
                                            toDetailStore(e);
                                        }}
                                    >
                                        <div className="favStoreLside">
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <div className="storePic">
                                                    <img src="/images/storeAvatar.png" alt={store.StoreName} />
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        fontSize: "0.8rem",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faStar} />
                                                    <b style={{ marginTop: "1px" }}>{store.rating.rating}</b>
                                                </div>
                                            </div>
                                            <div>
                                                <b>{store.StoreName}</b>
                                                <p>
                                                    <FontAwesomeIcon icon={faLocationDot} /> {store.StoreAddress}
                                                </p>
                                                <p>{store.category}</p>
                                            </div>
                                        </div>
                                        <div className="rightSide">
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                id="btnFavStore"
                                                style={{ color: isFav ? "red" : "" }}
                                                onClick={() => unFavStore(store.StoreId)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center" }}>Tidak ada toko favorit.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Favorite;

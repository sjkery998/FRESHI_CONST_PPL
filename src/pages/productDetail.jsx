import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/productDetail.css'
import '../css/webComponents.css'
import { BiHeart } from 'react-icons/bi';
import { FaCross, FaMinus, FaPlus, FaStar } from "react-icons/fa";
import { CiLocationOn } from 'react-icons/ci';
import { productsData } from '../jsx/dataModel.jsx';
import { FaArrowLeft, FaBagShopping, FaHeart, FaLocationPin, FaX } from 'react-icons/fa6';
import CreatableSelect from 'react-select/creatable';
import Transition from "../components/transition.jsx";

function ProductDetail() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const productId = params.get('productId');
    const [quantity, setQuantity] = useState(1);
    const pricePerKg = 34000;
    const totalPrice = quantity * pricePerKg;
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const navigate = useNavigate();

    const toDetailProduct = (event) => {
        const productId = event.target.closest('.productCase').id.split('-')[1];
        navigate(`/ProductDetail?productId=${productId}`);
    };

    const toDetailStore = (event) => {
        const storeId = event.target.closest(".detailStore").id.split('-')[1];
        navigate(`/StoreDetail?storeId=${storeId}`);
    }
    const handleIncrease = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrease = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1)); // Minimal 1Kg
    };

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
    };

    const handleBack = () => {
        window.history.back()
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleBuyClick = () => {
        setIsNavExpanded(!isNavExpanded);
    };

    const handleChange = (newValue) => {
        setSelectedOption(newValue);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location]);

    return (
        <>
            <Transition />
            <div>
                <div className="simpleHeaderPage" style={{ borderBottom: isNavExpanded ? "1px solid grey" : "" }}>
                    <FaArrowLeft  onClick={isNavExpanded ? handleBuyClick : handleBack} style={{ cursor: 'pointer' }} />
                    <b>Details</b>
                    <FaHeart
                        onClick={toggleFavorite}
                        style={{
                            cursor: 'pointer',
                            color: isFavorite ? 'red' : 'black',
                        }}
                    />
                </div>
                <div className="ProductsDetailsPage" style={{ display: isNavExpanded ? 'none' : '', }}>
                    <div className="mainDetailSection">
                        <div className="detailProdImage">
                            <img src="/images/apple-green.jpg" alt="" />
                        </div>
                        <div className="detailProduct">
                            <div className="buyCounter">
                                <b>Rp.34000</b>
                                <FaMinus className='minBuyC' onClick={handleDecrease} />
                                <b style={{ padding: "0 0.5rem" }}>{quantity}Kg</b>
                                <FaPlus className='plusBuyC' onClick={handleIncrease} />
                            </div>
                            <div className="nameDetailsProduct">
                                <b>Jeruk Blewah</b>
                                <div className="detailRating">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <b>4.5</b>
                                </div>
                            </div>
                        </div>
                        <div className="detailStore" id='store-storeId1'>
                            <div className="detailStoreImage">
                                <img src="/images/storeAvatar.png" alt="" />
                            </div>
                            <div className="nameDetailStore">
                                <b>Joko Anwar</b>
                                <p><CiLocationOn /> Lampung Timur</p>
                            </div>
                            <b className='visitStore' onClick={toDetailStore}>Kunjungi Toko</b>
                        </div>
                        <div className="fuseushguk" style={{
                            fontSize: "0.8rem",
                        }}>
                            <div className="storeReputation">
                                <b>Reputasi Toko</b>
                                <p>Baik</p>
                            </div>
                            <div className="storeProductsCount">
                                <b>Jumlah Produk</b>
                                <p>10++</p>
                            </div>
                        </div>
                        <div className="mainDetailsProduct"
                            style={{
                                maxHeight: isExpanded ? 'none' : '7rem',
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease',
                            }}>
                            <b>Detail Produk</b>
                            <p>Jeruk Blewah kami adalah pilihan terbaik bagi Anda yang mencari buah segar
                                dengan rasa manis dan segar alami. Dipanen langsung dari kebun petani lokal,
                                jeruk blewah ini memiliki kandungan air yang tinggi, cocok untuk menghilangkan
                                dahaga dan menambah asupan vitamin C harian Anda. Rasanya yang segar sangat
                                ideal dinikmati langsung atau dijadikan jus yang menyegarkan.
                                <br /><br />
                                Asal Produk : Lampung<br />
                                Manfaat : <br />
                                - Menyegarkan Tubuh<br />
                                - Mengandug Banyak Vitamin<br />
                                - Baik Untuk Kesehatan<br />
                                <br />
                                Silahkan Hubungi Penjual Terlebih Dahulu untuk mengonfirmasi
                            </p>
                        </div>
                        <b
                            style={{
                                padding: "1rem 0 0 1rem",
                                color: "blue",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                            }}
                            onClick={toggleDetails}
                        >
                            {isExpanded ? 'Sembunyikan' : 'Selengkapnya'}
                        </b>
                        <br />
                        <div className="separator"></div>
                        <div className="newProduct storeProducts">
                            <div className="headline">
                                <div className="title" style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "400"
                                }}>Produk Lainnya Dari Toko Ini</div>
                                <div className="viewAll">Selengkapnya</div>
                            </div>
                            <div className="contents">
                                {productsData.map((product, index) => (
                                    <div className="productCase" key={product.id + 'm'} id={"new-" + product.id} onClick={toDetailProduct}>
                                        <div className="imageCase" style={{ backgroundImage: `url(${product.image})` }}></div>
                                        <div className="details">
                                            <b>{product.name}</b>
                                            <div className="priceRating">
                                                <div className="price">
                                                    <p>{product.weight}</p>
                                                    <p>{product.price}</p>
                                                </div>
                                                <div className="rating">
                                                    <FaStar style={{ color: "orange" }} />
                                                    <p>{product.rating}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div >

                <div className="detailBottomNav"
                    style={{
                        height: isNavExpanded ? '100%' : '',
                        overflow: "hidden",
                        top: isNavExpanded ? '54px' : '',
                        overflowY: "scroll"
                    }}
                >
                    <div style={{
                        display: isNavExpanded ? 'block' : 'none',
                        height: "100%",
                    }}>
                        <div className="closeCheckOut">
                            Detail Pemesanan
                            <b style={{ lineHeight: "0", display: "flex", flexDirection: "row", alignItems: "center" }} onClick={handleBuyClick} >Tutup</b>
                        </div>
                        <div className="separator"></div>
                        <div className="coDeliveryCase">
                            <div className='coDelivery'>
                                <b>Kirim KeAlamat</b>
                                <p>Rp.10000</p>
                                <input type="checkbox" name="coDelivery" id="" />
                            </div>
                            <div className='coTakeAway'>
                                <b>Ambil Di Toko</b>
                                <p>Rp.10000</p>
                                <input type="checkbox" name="coDelivery" id="" />
                            </div>
                            <div className='coCOD'>
                                <b>COD</b>
                                <p>Rp.10000</p>
                                <input type="checkbox" name="coDelivery" id="" />
                            </div>
                        </div>

                        <div className="coAddressCase">
                            <div className="coAddressHeading">
                                <div>
                                    <p className='coYourLocation'>Lokasi Anda</p>
                                    <b>Raja Basa</b>
                                </div>
                                <b className='coChangeAddress'>Ubah Lokasi</b>
                            </div>
                            <p className="coAccdressDetails">
                                <FaLocationPin />
                                Jalan Ranggolawe Unit 2 tulang bawang lampung 23028 gang ayam
                            </p>
                        </div>
                        <div className="separator"></div><br />
                        <div className="coProductDetailCase">
                            <div className='coProdHead'>
                                <div className='coProdPrice'>
                                    <b>Jeruk Bewah</b>
                                    <b>1Kg = Rp.{pricePerKg}</b>
                                </div>
                                <div className='coProdImage'>
                                    <img src="/images/apple-green.jpg" alt="" />
                                </div>
                            </div>
                            <div className="coProdCounter">
                                <FaMinus className='minBuyC' onClick={handleDecrease} />
                                <b style={{ padding: "0 0.5rem" }}>{quantity}Kg</b>
                                <FaPlus className='plusBuyC' onClick={handleIncrease} />
                            </div>
                            <div className="coAddMoreProd">
                                <div className="addMoreTexts">
                                    <b>Tambah Produk?</b>
                                    <p>Pilih Produk Lain Untuk Di Tambahkan</p>
                                </div>
                                <b className='coAddMoreButton'><FaPlus /></b>
                            </div>
                        </div>
                        <br />
                        <div className="separator"></div>
                        <div style={{ padding: "1rem 0rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <b>Metode Pembayaran</b>
                            <CreatableSelect
                                isClearable
                                onChange={handleChange}
                                value={selectedOption}
                                options={[
                                    { value: 'Transfer Bank', label: 'Transfer Bank' },
                                    { value: 'OVO', label: 'Ovo' },
                                    { value: 'Shopee Pay', label: 'Shopee Pay' },
                                    { value: 'Dana', label: 'Dana' }
                                ]}
                                placeholder="Pilih Metode Pembayaran"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '12px',
                                        padding: '0.2rem 0.2rem',
                                    })
                                }}
                            />
                        </div>
                        <div className="coSummaryCase" style={{ marginBottom: isNavExpanded ? '130px' : '', }}>
                            <div className='coSummaryProd'>
                                <b>Harga Produk</b>
                                <p>Rp.{pricePerKg}</p>
                            </div>
                            <div className='coSummaryJasa'>
                                <b>Biaya Penanganan</b>
                                <p>Rp.10000</p>
                            </div>
                            <div className='coSummaryProdCounts'>
                                <b>Jumlah</b>
                                <p>{quantity}Kg</p>
                            </div>
                            <div className='coSumaryDiscount'>
                                <b>Diskon</b>
                                <p>0</p>
                            </div>
                            <div className="separator"></div>
                            <div className='coSummaryFinalCase'>
                                <b>Total Pembayaran</b>
                                <p className='coFinalPrice'>Rp.{totalPrice}</p>
                            </div>
                        </div>

                        <br />
                    </div>
                    <div className='checkOutBtnCase' style={{
                        position: isNavExpanded ? "fixed" : "",
                        bottom: isNavExpanded ? "0" : "",
                        left: isNavExpanded ? "0" : "",
                        width: isNavExpanded ? "calc(100% - 2rem)" : "",
                        borderRadius: isNavExpanded ? "1rem 1rem 0 0" : "",
                        padding: isNavExpanded ? "0.5rem 1rem" : '',
                        borderTop: isNavExpanded ? "1px solid grey" : '',
                        backgroundColor: isNavExpanded ? "white" : '',
                    }}>
                        <div className="totalBuyPrice">
                            <p style={{
                                padding: '0',
                                margin: '0',
                                fontWeight: '600',
                            }}
                            >Total Pembayaran</p>
                            <b>Rp.{totalPrice}</b>
                        </div>
                        <div className="checkOutButton" onClick={isNavExpanded ? null : handleBuyClick}>
                            <FaBagShopping />
                            <b>Beli Sekarang</b>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail
import React, { useState } from "react";
import "../css/chattingPage.css";
import { FaArrowLeft, FaFile, FaGear } from "react-icons/fa6";
import { CiPaperplane } from "react-icons/ci";
import { chattingData } from "../jsx/dataModel.jsx";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ChattingPage() {
    const navigate = useNavigate()
    const selfId = "userId1";
    const rawChatId = window.location.href;
    const chatId = rawChatId.split("-")[1];
    const chatData = chattingData;

    return (
        <>
            <div className="RoomHeaderInfo">
                <div className="simpleHeaderPage aodshfabbe">
                    <FaArrowLeft onClick={() => { navigate(-1) }} />
                    {rawChatId.includes("discussProd") ? <b>StoreId231</b> :  <b>Joko Kendil</b> }
                    <FaSignOutAlt onClick={() => { rawChatId.includes("discussProd") ? navigate(`/detailProduct?${chatId}`) : navigate(`/detailStore?${chatId}`) }}/>
                </div>{rawChatId.includes("discussProd") ? <div className="kjsfdhheaderInfo">ProductID1276</div> : null}
            </div>
            <div className="chatingContainer">
                {chatData.map((chat) => (
                    <div
                        className="chatBubble"
                        key={chat.id}
                        style={{
                            marginLeft: chat.senderId === selfId ? "auto" : "",
                        }}
                    >
                        <div className="MessageTextCase"
                            style={{
                                marginLeft: chat.senderId === selfId ? "auto" : "",
                                borderTopRightRadius: chat.senderId === selfId ? "0px" : "1rem",
                                borderTopLeftRadius: chat.senderId !== selfId ? "0px" : "1rem",
                                backgroundColor: chat.senderId === selfId ? "rgb(209 249 209)" : "#fff",
                                borderRight: chat.senderId === selfId ? `4px solid ${chat.isRead ? "green" : "darkred"}` : "0",
                                borderLeft: chat.senderId !== selfId ? "4px solid green" : "0",
                            }}
                        >
                            {chat.message}

                            <div id="Chat-Time" style={{ marginTop: "0.3rem", marginLeft: chat.senderId === selfId ? "auto" : "" }}>{chat.time}</div>
                        </div>
                    </div>
                ))}
            </div>
            <form action="" className="chatTypingBox">
                <input type="text" placeholder="Masukkan Pesan..." />
                <div className="messageOptions">
                    <FaFile />
                    <CiPaperplane style={{ fontSize: "1.7rem" }} />
                </div>
            </form>
        </>
    );
}

export default ChattingPage;

import React, { useEffect, useRef, useState } from "react";
import "../css/chattingPage.css";
import { FaArrowLeft, FaFile, FaGear, FaStore } from "react-icons/fa6";
import { CiPaperplane } from "react-icons/ci";
import { getUserChatData, userData } from "../jsx/dataModel.jsx";
import { FaSignOutAlt } from "react-icons/fa";
import { data, useNavigate } from "react-router-dom";
import { chatMessageListener, generateRandomAlphanumeric, isUserHasStore, sendMessage } from "../jsx/dataController.jsx";

function ChattingPage() {
    const navigate = useNavigate()
    const selfId = userData.UserId;
    const rawChatId = window.location.href;
    const chatId = rawChatId.split("-")[1];
    const [messageData, setmessageData] = useState(null);
    const [UserChatData, setUserChatData] = useState(null);
    useEffect(() => {
        const fetchUserChatData = async () => {
            const ids = rawChatId.split("?")[1]
            const data = await getUserChatData(ids);

            setUserChatData(data);
        };

        fetchUserChatData();
    }, [chatId]);
    const [pesan, setPesan] = useState("");
    const chatEndRef = useRef(null)
    // console.table(messageData)

    const kirimPesan = async () => {
        const ids = rawChatId.split("?")[1]
        sendMessage(ids, pesan)
        setPesan("")
    };

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messageData]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        const ids = rawChatId.split("?")[1]
        const unsubscribe = chatMessageListener(ids, (newData) => {
            setmessageData(newData);
        });

        return () => unsubscribe;
    }, []);
    const chatBubbleCase = (chat) => {
        return (
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

        )
    }

    return (
        <>
            <div className="RoomHeaderInfo">
                <div className="simpleHeaderPage aodshfabbe">
                    <FaArrowLeft onClick={() => { navigate(-1) }} />
                    {rawChatId.includes("discussProd") ? <b>{rawChatId.split('-')[2]}</b> : <b>{`${UserChatData ? Object.entries(UserChatData?.participants).find(([key, value]) => key !== userData.UserId)?.[1] : "Kirim Pesan"}`}</b>}
                    <FaStore onClick={async () => { rawChatId.includes("discussProd") ? navigate(`/ProductDetail?productId=${chatId}`, { state: { fromChatting: true } }) : navigate(`/StoreDetail?storeId=${await isUserHasStore(Object.entries(UserChatData?.participants).find(([key, value]) => key !== userData.UserId)?.[0])}`, { state: { fromChatting: true } }) }} />
                </div>
                {rawChatId.includes("discussProd") ? <div style={{ textAlign: "center" }} className="kjsfdhheaderInfo">{rawChatId.split('-')[3].replaceAll("%20", " ")} <br />  {rawChatId.split('-')[1]} </div> : null}
            </div>
            <div className="chatingContainer">
                {messageData && Object.entries(messageData).map(([key, chat]) => (
                    chatBubbleCase(chat)
                ))}
                <div ref={chatEndRef} />

            </div>
            <form
                action=""
                className="chatTypingBox"
                onSubmit={(e) => {
                    e.preventDefault();
                    kirimPesan();
                }}
            >
                <input
                    type="text"
                    placeholder="Masukkan Pesan..."
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                />
                <div className="messageOptions">
                    <FaFile />
                    <CiPaperplane style={{ fontSize: "1.7rem", cursor: "pointer" }} onClick={kirimPesan} />
                </div>
            </form>
        </>
    );
}

export default ChattingPage;

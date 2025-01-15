import React, { useEffect, useState } from "react";
import "../css/chatPage.css";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import { userChatsListener } from "../jsx/dataController.jsx";

function ChatPage() {
    const [isPersonal, setIsPersonal] = useState(true);
    const navigate = useNavigate();
    const [UserChats, setUserChats] = useState({}); // Default sebagai objek kosong

    const goBack = () => navigate(-1);

    const toChattingPage = (event) => {
        const chatId = event.target.closest(".chatsCase")?.id;
        if (chatId) {
            navigate(`/ChattingPage?${chatId}`);
        }
    };

    useEffect(() => {
        let unsubscribe;
        const fetchChats = async () => {
            unsubscribe = await userChatsListener((data) => {
                setUserChats(data || {}); // Fallback ke objek kosong jika data null
            });
        };

        fetchChats();
        return () => {
            if (unsubscribe) unsubscribe(); // Cleanup listener saat komponen di-unmount
        };
    }, []);

    return (
        <>
            <div className="chatPageHeading">
                <div className="chatPageHead">
                    <FaArrowLeft onClick={goBack} />
                    <b>Chat</b>
                    <BsCheckCircleFill />
                </div>
                <div className="chatChangeType">
                    <b
                        className={isPersonal ? "activeChatType" : ""}
                        onClick={() => setIsPersonal(true)}
                        style={{
                            color: isPersonal ? "#73B065" : "",
                            borderBottom: isPersonal ? "1px solid #73B065" : "",
                        }}
                    >
                        Personal Chat
                    </b>
                    <b
                        className={!isPersonal ? "activeChatType" : ""}
                        onClick={() => setIsPersonal(false)}
                        style={{
                            color: !isPersonal ? "#73B065" : "",
                            borderBottom: !isPersonal ? "1px solid #73B065" : "",
                        }}
                    >
                        Diskusi Produk
                    </b>
                </div>
            </div>
            <div className="chatCaseContainer">
                {Object.entries(UserChats)
                    .filter(([chatId, chat]) =>
                        isPersonal
                            ? chat.chatType === "personal"
                            : chat.chatType === "discussProduct"
                    )
                    .map(([chatId, chat]) => (
                        <div
                            className="chatsCase"
                            key={chatId}
                            id={chatId}
                            onClick={toChattingPage}
                        >
                            <img
                                src="/images/storeAvatar.png"
                                alt={`${chat.target?.name || "Unknown"} avatar`}
                            />
                            <div className="chatOutMess">
                                <b>{chat.target?.name || "Unknown"}</b>
                                {!isPersonal && (
                                    <b> #productId-{chat.id.split("-")[1]}</b>
                                )}
                                <p>{chat.lastMessage?.text || "No message"}</p>
                                <p className="chatLastTime">
                                    {chat.lastMessage?.time || "Unknown time"}
                                </p>
                            </div>
                        </div>
                    ))}
                {/* Tampilkan jika tidak ada chat */}
                {Object.keys(UserChats).length === 0 && (
                    <center>Tidak ada percakapan yang tersedia.</center>
                )}
            </div>
        </>
    );
}

export default ChatPage;

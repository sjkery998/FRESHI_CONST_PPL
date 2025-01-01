import React, { useState } from "react";
import "../css/chatPage.css";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { chatDataHome } from "../jsx/dataModel.jsx";
import { BsCheckCircleFill } from "react-icons/bs";

function ChatPage() {
    const [isPersonal, setIsPersonal] = useState(true);
    const navigate = useNavigate();
    const toggleChatType = () => setIsPersonal((prev) => !prev);
    const goBack = () => navigate(-1);

    const toChattingPage = (event) => {
        const chatId = event.target.closest('.chatsCase').id;
        navigate(`/ChattingPage?${chatId}`);
    };
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
                            color : isPersonal ? "#73B065" : "",
                            borderBottom : isPersonal ? "1px solid #73B065" : ""
                        }}
                    >
                        Personal Chat
                    </b>
                    <b
                        className={!isPersonal ? "activeChatType" : ""}
                        onClick={() => setIsPersonal(false)}
                        style={{
                            color : !isPersonal ? "#73B065" : "",
                             borderBottom : !isPersonal ? "1px solid #73B065" : ""
                        }}
                    >
                        Diskusi Produk
                    </b>
                </div>
            </div>
            {isPersonal ? (
                <div className="chatCaseContainer">
                    {chatDataHome
                        .filter((chat) => chat.chatType === "personal")
                        .map((chatPersonal) => (
                            <div className="chatsCase" key={`personalChat-${chatPersonal.id}`} id={`personalChat-${chatPersonal.id}`} onClick={toChattingPage}>
                                <img
                                    src="/images/storeAvatar.png"
                                    alt={`${chatPersonal.name} avatar`}
                                />
                                <div className="chatOutMess">
                                    <b>{chatPersonal.name}</b>
                                    <p>{chatPersonal.message}</p>
                                    <p className="chatLastTime">{chatPersonal.lastMessageTime}</p>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="chatCaseContainer">
                    {chatDataHome
                        .filter((chat) => chat.chatType === "discuss")
                        .map((chatDiscussProd) => (
                            <div className="chatsCase" key={`discussProd-${chatDiscussProd.id}`} id={`discussProd-${chatDiscussProd.id}`} onClick={toChattingPage}>
                                <img
                                    src="/images/storeAvatar.png"
                                    alt={`${chatDiscussProd.name} avatar`}
                                />
                                <div className="chatOutMess">
                                    <b>{chatDiscussProd.name}</b>
                                    <b> #productId1864</b>
                                    <p>{chatDiscussProd.message}</p>
                                    <p className="chatLastTime">{chatDiscussProd.lastMessageTime}</p>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </>
    );
}

export default ChatPage;

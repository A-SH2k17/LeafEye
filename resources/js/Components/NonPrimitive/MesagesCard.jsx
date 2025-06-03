import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../Primitive/PrimaryButton";

export default function MessagesCard(props) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const {t} = useTranslation();

    const getMessages = () => {
        try {
            fetch(route('message.retrieve', { user: props.user_id }))
                .then((response) => response.json())
                .then((data) => {
                    // Group messages by sender and get the latest message from each sender
                    const uniqueSenders = data.messages.reduce((acc, message) => {
                        if (!acc[message.sender] || new Date(message.sent_from) > new Date(acc[message.sender].sent_from)) {
                            acc[message.sender] = message;
                        }
                        return acc;
                    }, {});

                    // Convert the object to an array and sort by timestamp
                    const sortedMessages = Object.values(uniqueSenders).sort((a, b) => 
                        new Date(b.sent_from) - new Date(a.sent_from)
                    );

                    setMessages(sortedMessages);
                    setLoading(false);
                });
        } catch (error) {
            console.error("error: ", error);
            setLoading(false);
        }
    };

    //constantly retrieving messages every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            getMessages();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleViewMessage = () => {
        router.visit(route('messages.index'));
    };

    return (
        <div className={`div2 ${!props.active ? "hidden" : "block inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"} md:block fixed md:top-20 md:right-0 px-6 md:w-1/2`}>
            <div className="bg-[#e8fcef] w-full rounded-sm shadow-xl flex flex-col mb-4 h-[19em] overflow-y-auto px-10 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={props.toggle} className={`${!props.active ? "hidden" : "block"}`}>
                        <X className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
                    </button>
                    <PrimaryButton
                        onClick={handleViewMessage}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {t('go_to_messages')}
                    </PrimaryButton>
                </div>
                {/*<p className="font-bold text-center mb-4">{t('received')}</p>*/}
                {loading ? (
                    <p className="py-14">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="py-14">There are no messages...</p>
                ) : (
                    messages.map((message, index) => (
                        <div className="message-item flex items-center mb-3" key={index}>
                            <div className="flex-1">
                                <li><p className="font-semibold">{message.sender}</p></li>
                                <p className="text-sm">Received {message.sent_from}</p>
                                <p className="text-sm text-gray-600 truncate">{message.content}</p>
                            </div>
                            {/*
                            <button 
                                onClick={() => handleViewMessage()}
                                className="text-sm text-green-700 hover:text-green-900"
                            >
                                {t('messages_link')}
                            </button>
                            */}

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
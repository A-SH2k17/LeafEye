import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/NonPrimitive/Footer';

// Sample data for demonstration
const sampleChatHistory = [
    {
        id: 1,
        title: 'Plant Care Questions',
        timestamp: '2024-03-15 10:30 AM',
        preview: 'How to care for my succulent?'
    },
    {
        id: 2,
        title: 'Disease Identification',
        timestamp: '2024-03-14 02:15 PM',
        preview: 'Help identify plant disease'
    },
    // Add more chat history items as needed
];

const sampleMessages = [
    {
        id: 1,
        sender: 'bot',
        content: 'Hello! I\'m your plant care assistant. How can I help you today?',
        timestamp: '10:30 AM'
    },
    {
        id: 2,
        sender: 'user',
        content: 'How do I take care of my succulent?',
        timestamp: '10:31 AM'
    },
    {
        id: 3,
        sender: 'bot',
        content: 'Succulents need well-draining soil, bright indirect sunlight, and infrequent watering. Water only when the soil is completely dry, usually every 1-2 weeks.',
        timestamp: '10:31 AM'
    },
    // Add more sample messages as needed
];

export default function ChatbotPage() {
    const [selectedChat, setSelectedChat] = useState(sampleChatHistory[0]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(sampleMessages);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                sender: 'user',
                content: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessage('');

            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    id: messages.length + 2,
                    sender: 'bot',
                    content: 'I understand your question. Let me help you with that.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    return (
        <>
            <Head title="Plant Care Assistant" />
            <AuthenticatedLayout>
                <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Chat History Sidebar */}
                    <div className="w-1/4 border-r border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Chat History</h2>
                        </div>
                        <div className="overflow-y-auto h-full">
                            {sampleChatHistory.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                        selectedChat.id === chat.id ? 'bg-green-50' : ''
                                    }`}
                                    onClick={() => setSelectedChat(chat)}
                                >
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {chat.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {chat.timestamp}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2 truncate">
                                        {chat.preview}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Bot className="h-8 w-8 text-green-500" />
                                <h2 className="text-lg font-medium text-gray-900">
                                    Plant Care Assistant
                                </h2>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${
                                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className="flex items-start space-x-2 max-w-[70%]">
                                        {msg.sender === 'bot' && (
                                            <Bot className="h-6 w-6 text-green-500 mt-1" />
                                        )}
                                        <div
                                            className={`rounded-lg px-4 py-2 ${
                                                msg.sender === 'user'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                            }`}
                                        >
                                            <p>{msg.content}</p>
                                            <span className="text-xs opacity-75">
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                        {msg.sender === 'user' && (
                                            <User className="h-6 w-6 text-gray-500 mt-1" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask about plant care..."
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </AuthenticatedLayout>
        </>
    );
} 
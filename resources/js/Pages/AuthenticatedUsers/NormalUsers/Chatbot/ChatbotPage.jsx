import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus } from 'lucide-react';
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
        role: 'bot',
        content: 'Hello! I\'m your plant care system. How can I help you today?',
        timestamp: '10:30 AM'
    },
    {
        id: 2,
        role: 'user',
        content: 'How do I take care of my succulent?',
        timestamp: '10:31 AM'
    },
    {
        id: 3,
        role: 'bot',
        content: 'Succulents need well-draining soil, bright indirect sunlight, and infrequent watering. Water only when the soil is completely dry, usually every 1-2 weeks.',
        timestamp: '10:31 AM'
    },
    // Add more sample messages as needed
];

export default function ChatbotPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const abortControllerRef = useRef(null);

    // Fetch chat history on component mount
    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const response = await fetch('/chat/history');
            const data = await response.json();
            setChatHistory(data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const startNewChat = () => {
        setSelectedChat(null);
        setMessages([]);
        setMessage('');
        setCurrentMessage('');
    };

    const selectChat = (chat) => {
        setSelectedChat(chat);
        try {
            const parsedMessages = JSON.parse(chat.content);
            setMessages(parsedMessages);
        } catch (error) {
            console.error('Error parsing chat messages:', error);
            setMessages([]);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();

        let newC = null;
        
        if (!message.trim()) return;
        
        const userMessage = {
            role: 'user',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // If this is a new chat, create it first
        if (!selectedChat) {
            try {
                const response = await fetch('/chat/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ firstMessage: message }),
                });
                const newChat = await response.json();
                newC = newChat;
                setSelectedChat(newChat);
                setChatHistory(prev => [newChat, ...prev]);
            } catch (error) {
                console.error('Error creating new chat:', error);
                return;
            }
        }
        
        abortControllerRef.current = new AbortController();
        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);
        
        let accumulatedMessage = '';
        
        try {
            const response = await fetch('/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ prompt: message }),
                signal: abortControllerRef.current.signal,
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.content) {
                                accumulatedMessage += data.content;
                                setCurrentMessage(accumulatedMessage);
                            }
                        } catch (e) {
                            const content = line.slice(6).trim();
                            if (content && content !== 'undefined') {
                                accumulatedMessage += content;
                                setCurrentMessage(accumulatedMessage);
                            }
                        }
                    }
                }
            }
            
            // Clean up any trailing undefined
            accumulatedMessage = accumulatedMessage.replace(/undefined$/, '').trim();
            
            const updatedMessages = [...messages, userMessage, {
                role: 'system',
                content: accumulatedMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }];
            
            setMessages(updatedMessages);
           
            // Update chat in database
            if (selectedChat || newC) {
                console.log(updatedMessages);
                await fetch(`/chat/update/${selectedChat?.id || newC.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ messages: updatedMessages }),
                });
            }
            
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Streaming error:', error);
                setMessages(prev => [...prev, {
                    role: 'system',
                    content: 'Sorry, there was an error processing your request.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        } finally {
            setCurrentMessage('');
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <>
            <Head title="Plant Care Assistant" />
            <AuthenticatedLayout>
                <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden pt-20">
                    {/* Chat History Sidebar */}
                    <div className="w-1/4 border-r border-gray-200">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">Chat History</h2>
                            <button
                                onClick={startNewChat}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                title="Start New Chat"
                            >
                                <Plus className="h-5 w-5 text-green-500" />
                            </button>
                        </div>
                        <div className="overflow-y-auto h-full">
                            {chatHistory.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                        selectedChat?.id === chat.id ? 'bg-green-50' : ''
                                    }`}
                                    onClick={() => selectChat(chat)}
                                >
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {chat.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(chat.date_interacted).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Bot className="h-8 w-8 text-green-500" />
                                <h2 className="text-lg font-medium text-gray-900">
                                    {selectedChat ? selectedChat.title : 'New Chat'}
                                </h2>
                            </div>
                            {selectedChat && (
                                <button
                                    onClick={startNewChat}
                                    className="px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                >
                                    Start New Chat
                                </button>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && !selectedChat && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center text-gray-500">
                                        <Bot className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                        <h3 className="text-lg font-medium mb-2">Start a New Conversation</h3>
                                        <p className="text-sm">Ask me anything about plant care!</p>
                                    </div>
                                </div>
                            )}
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className="flex items-start space-x-2 max-w-[70%]">
                                        {msg.role === 'system' && (
                                            <Bot className="h-6 w-6 text-green-500 mt-1" />
                                        )}
                                        <div
                                            className={`rounded-lg px-4 py-2 ${
                                                msg.role === 'user'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                            <span className="text-xs opacity-75">
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                        {msg.role === 'user' && (
                                            <User className="h-6 w-6 text-gray-500 mt-1" />
                                        )}
                                    </div>
                                </div>
                            ))}
                            {currentMessage && (
                                <div className="flex justify-start">
                                    <div className="flex items-start space-x-2 max-w-[70%]">
                                        <Bot className="h-6 w-6 text-green-500 mt-1" />
                                        <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
                                            <p className="whitespace-pre-wrap">{currentMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                    disabled={isLoading}
                                    onClick={handleSendMessage}
                                    className="bg-green-500 disabled:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
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
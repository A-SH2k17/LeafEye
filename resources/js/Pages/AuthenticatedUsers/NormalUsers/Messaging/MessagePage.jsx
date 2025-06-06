import { useState, useEffect } from 'react';
import { Search, Send, Plus } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/NonPrimitive/Footer';
import axios from 'axios';

export default function MessagePage({ auth }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // Fetch users with their latest messages
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            // Sort users by latest message timestamp
            const sortedUsers = response.data.users.sort((a, b) => {
                if (!a.timestamp && !b.timestamp) return 0;
                if (!a.timestamp) return 1;
                if (!b.timestamp) return -1;
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
            setUsers(sortedUsers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    // Fetch messages for selected user
    const fetchMessages = async (userId) => {
        try {
            const response = await axios.get(`/api/messages/${userId}`);
            if (response.data.messages) {
                const formattedMessages = response.data.messages.map(msg => ({
                    id: msg.id,
                    senderId: msg.sender === auth.user.username ? 'currentUser' : 'other',
                    content: msg.content,
                    timestamp: msg.sent_from
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Initial load
    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch messages when user is selected
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
        }
    }, [selectedUser]);

    // Poll for messages every 2 seconds when a user is selected
    useEffect(() => {
        if (!selectedUser) return;
        fetchMessages(selectedUser.id); // Fetch immediately
        const interval = setInterval(() => {
            fetchMessages(selectedUser.id);
        }, 2000);
        return () => clearInterval(interval);
    }, [selectedUser]);

    // Refresh users list periodically
    useEffect(() => {
        const interval = setInterval(fetchUsers, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = async () => {
        if (message.trim() && selectedUser) {
            const newMessage = {
                id: messages.length + 1,
                senderId: 'currentUser',
                content: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessage('');

            try {
                const response = await axios.post('/api/messages', {
                    receiver_id: selectedUser.id,
                    content: message
                });
                // Refresh messages after sending
                fetchMessages(selectedUser.id);
                // Refresh users list to update last message
                fetchUsers();
                
                console.log(response.data);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleStartNewChat = (user) => {
        setSelectedUser(user);
        setShowUserDropdown(false);
        setMessages([]);
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const usersWithMessages = filteredUsers.filter(user => user.lastMessage && user.lastMessage.trim() !== '');

    return (
        <>
            <Head title="Messages" />
            <AuthenticatedLayout>
                <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* User List Sidebar */}
                    {loading ? (
                        <div className="w-1/3 border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center mb-4 mt-20">
                                    <h2 className="text-lg font-semibold">Received Messages</h2>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            Start New Chat
                                        </button>
                                        {showUserDropdown && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                <div className="p-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Search users..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>
                                                <div className="max-h-60 overflow-y-auto">
                                                    {filteredUsers.map((user) => (
                                                        <button
                                                            key={user.id}
                                                            onClick={() => handleStartNewChat(user)}
                                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                                                        >
                                                            <img
                                                                src={user.avatar}
                                                                alt={user.name}
                                                                className="w-8 h-8 rounded-full mr-2"
                                                            />
                                                            <span>{user.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            </div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center">
                            <div className="text-center p-4">
                                <p className="text-gray-500 mb-4">You have no messages yet</p>
                                <button
                                    onClick={() => setShowUserDropdown(true)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Start Your First Chat
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-1/3 border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center mb-4 mt-20">
                                    <h2 className="text-lg font-semibold">Received Messages</h2>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            Start New Chat
                                        </button>
                                        {showUserDropdown && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                <div className="p-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Search users..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>
                                                <div className="max-h-60 overflow-y-auto">
                                                    {filteredUsers.map((user) => (
                                                        <button
                                                            key={user.id}
                                                            onClick={() => handleStartNewChat(user)}
                                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                                                        >
                                                            <img
                                                                src={user.avatar}
                                                                alt={user.name}
                                                                className="w-8 h-8 rounded-full mr-2"
                                                            />
                                                            <span>{user.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-y-auto flex-1">
                                <div className="divide-y divide-gray-100">
                                    {usersWithMessages.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                                selectedUser?.id === user.id ? 'bg-green-50' : ''
                                            }`}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                                            {user.name}
                                                        </h3>
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            {user.timestamp}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate mt-1">
                                                        {user.lastMessage || 'No messages yet'}
                                                    </p>
                                                </div>
                                                {user.unread > 0 && (
                                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                                                        {user.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={selectedUser.avatar}
                                            alt={selectedUser.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <h2 className="text-lg font-medium text-gray-900">
                                            {selectedUser.name}
                                        </h2>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.length === 0 ? (
                                        <div className="flex justify-center items-center h-full">
                                            <p className="text-gray-500">No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${
                                                    msg.senderId === 'currentUser'
                                                        ? 'justify-end'
                                                        : 'justify-start'
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                                        msg.senderId === 'currentUser'
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-100 text-gray-900'
                                                    }`}
                                                >
                                                    <p>{msg.content}</p>
                                                    <span className="text-xs opacity-75">
                                                        {msg.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
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
                                            placeholder="Type a message..."
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
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-gray-500">Select a user to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </AuthenticatedLayout>
        </>
    );
} 
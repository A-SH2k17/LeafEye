import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Dashboard({ pendingShops, reportedPosts, users, success, error }) {
    const [activeTab, setActiveTab] = useState('shops');
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedShopId, setSelectedShopId] = useState(null);
    const [selectedReportedPost, setSelectedReportedPost] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    useEffect(() => {
        if (success || error) {
            setShowAlert(true);
            setAlertMessage(success || error);
            setAlertType(success ? 'success' : 'error');
            
            // Hide alert after 5 seconds
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleShopDecision = (shopId, decision) => {
        if (decision === 'rejected') {
            setSelectedShopId(shopId);
            setShowRejectModal(true);
            return;
        }

        router.post(route('admin.shop.decision'), {
            shop_id: shopId,
            decision: decision,
            reason_of_rejection: null
        }, {
            onSuccess: () => {
                setShowAlert(true);
                setAlertMessage('Decision saved and notification email sent successfully');
                setAlertType('success');
            },
            onError: (errors) => {
                setShowAlert(true);
                setAlertMessage('Failed to process decision: ' + (errors.message || 'Unknown error'));
                setAlertType('error');
            }
        });
    };

    const handleRejectConfirm = () => {
        if (!rejectionReason.trim()) {
            setShowAlert(true);
            setAlertMessage('Please provide a reason for rejection');
            setAlertType('error');
            return;
        }

        router.post(route('admin.shop.decision'), {
            shop_id: selectedShopId,
            decision: 'rejected',
            reason_of_rejection: rejectionReason
        }, {
            onSuccess: () => {
                setShowAlert(true);
                setAlertMessage('Decision saved and notification email sent successfully');
                setAlertType('success');
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedShopId(null);
            },
            onError: (errors) => {
                setShowAlert(true);
                setAlertMessage('Failed to process decision: ' + (errors.message || 'Unknown error'));
                setAlertType('error');
            }
        });
    };

    const deleteUser = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('admin.user.delete', userId));
        }
    };

    const deletePost = (postId) => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(route('admin.post.delete', postId));
        }
    };

    const handleLogout = () => {
        router.post(route('admin.logout'));
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-[#F5F5F5]">
                {/* Header */}
                <div className="bg-[#2E7D32] shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                            </div>
                            <div className="flex items-center">
                                <Link
                                    href={route('admin.logout')}
                                    method="post"
                                    as="button"
                                    className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B5E20] hover:bg-[#1B5E20]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B5E20]"
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert Message */}
                {showAlert && (
                    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
                        alertType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {alertType === 'success' ? (
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{alertMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('shops')}
                                    className={`${
                                        activeTab === 'shops'
                                            ? 'border-[#2E7D32] text-[#2E7D32]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Pending Shops
                                </button>
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`${
                                        activeTab === 'posts'
                                            ? 'border-[#2E7D32] text-[#2E7D32]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Reported Posts
                                </button>
                                <button
                                    onClick={() => setActiveTab('activity')}
                                    className={`${
                                        activeTab === 'activity'
                                            ? 'border-[#2E7D32] text-[#2E7D32]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    User Activity
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="mt-6">
                            {activeTab === 'shops' && (
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Shop Registrations</h3>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Shop Name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Commercial Registration
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {pendingShops.map((shop) => (
                                                    <tr key={shop.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                                                            <div className="text-sm text-gray-500">Owner: {shop.user.username}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{shop.commercial_registration}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                shop.shopAdminDecision && shop.shopAdminDecision.length > 0
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}>
                                                                {shop.shopAdminDecision && shop.shopAdminDecision.length > 0
                                                                    ? 'Pending Review'
                                                                    : 'New Registration'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleShopDecision(shop.id, 'accepted')}
                                                                    className="bg-[#2E7D32] text-white px-4 py-2 rounded-md text-sm hover:bg-[#2E7D32]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={() => handleShopDecision(shop.id, 'rejected')}
                                                                    className="bg-[#D32F2F] text-white px-4 py-2 rounded-md text-sm hover:bg-[#D32F2F]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D32F2F]"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'posts' && (
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Reported Posts</h3>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        {reportedPosts.length === 0 ? (
                                            <p className="text-gray-500 text-sm p-4">No reported posts.</p>
                                        ) : (
                                            <ul className="divide-y divide-gray-200">
                                                {reportedPosts.map((post) => (
                                                    <li key={post.id} className="px-6 py-4 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                Posted by: {post.user.username}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Reports: {post.reports}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setSelectedReportedPost(post)}
                                                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => deletePost(post.id)}
                                                                className="bg-[#D32F2F] text-white px-4 py-2 rounded-md text-sm hover:bg-[#D32F2F]/90"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">User Activity</h3>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Since Login</th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {users.map((user) => (
                                                        <tr key={user.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {user.username}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {user.email}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                    user.role === 'business'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                    {user.role}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {user.shop_name || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {user.last_login}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {user.time_since_login}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                                <button
                                                                    onClick={() => deleteUser(user.id)}
                                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#D32F2F] hover:bg-[#D32F2F]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D32F2F]"
                                                                >
                                                                    Delete User
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rejection Reason Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Shop Registration</h3>
                            <div className="mb-4">
                                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Rejection
                                </label>
                                <textarea
                                    id="rejectionReason"
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter the reason for rejecting this shop registration..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason('');
                                        setSelectedShopId(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectConfirm}
                                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#D32F2F] hover:bg-[#D32F2F]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D32F2F]"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for viewing reported post details */}
                {selectedReportedPost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full">
                            <h3 className="text-lg font-bold mb-2">Reported Post</h3>
                            {selectedReportedPost.image && (
                                <img src={selectedReportedPost.image} alt="Post" className="mb-4 rounded" />
                            )}
                            <p className="mb-2">{selectedReportedPost.content}</p>
                            <p className="text-sm text-gray-500 mb-4">Reports: {selectedReportedPost.reports}</p>
                            <button
                                onClick={() => setSelectedReportedPost(null)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
} 
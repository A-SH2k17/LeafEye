import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import axios from 'axios';

export default function ViewOrders({ auth, orders: initialOrders }) {
    const [orders, setOrders] = useState(initialOrders);
    const [updatingStatus, setUpdatingStatus] = useState({});

    // Configure axios defaults
    axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    axios.defaults.headers.common['Accept'] = 'application/json';

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
            
            const response = await axios.patch(`/business/orders/${orderId}/status`, {
                status: newStatus
            });
            
            if (response.status === 200) {
                // Update the orders state immediately
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId 
                            ? { ...order, status: newStatus }
                            : order
                    )
                );
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            // Revert the status if there's an error
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId 
                        ? { ...order, status: order.status === 'completed' ? 'pending' : 'completed' }
                        : order
                )
            );
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const getStatusButtonClass = (status) => {
        const baseClass = "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200";
        return status === 'completed'
            ? `${baseClass} bg-green-100 text-green-700 hover:bg-green-200`
            : `${baseClass} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Orders</h2>}
        >
            <Head title="Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Date: {new Date(order.date_ordered).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleStatusChange(order.id, order.status === 'completed' ? 'pending' : 'completed')}
                                                disabled={updatingStatus[order.id]}
                                                className={`${getStatusButtonClass(order.status)} ${updatingStatus[order.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {updatingStatus[order.id] ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                ) : order.status === 'completed' ? (
                                                    <>
                                                        <CheckCircle2 size={16} />
                                                        Completed
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock size={16} />
                                                        Pending
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium mb-2 text-gray-700">Customer Information</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Name</p>
                                                    <p className="font-medium">{order.user.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-medium">{order.user.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Phone</p>
                                                    <p className="font-medium">{order.user.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Address</p>
                                                    <p className="font-medium">{order.user.address}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-lg">
                                            <h4 className="font-medium mb-2 text-gray-700">Order Items</h4>
                                            <div className="space-y-2">
                                                {order.products.map((product, index) => (
                                                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                                        <div>
                                                            <span className="font-medium">{product.name}</span>
                                                            <span className="text-gray-500 text-sm ml-2">x{product.quantity}</span>
                                                        </div>
                                                        <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between items-center pt-2 font-semibold">
                                                    <span>Total</span>
                                                    <span>${order.products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {orders.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No orders found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 
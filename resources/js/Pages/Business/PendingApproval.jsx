import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PendingApproval({ status, reason }) {

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="Pending Approval" />
            <div className="min-h-screen bg-leaf-back flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Shop Registration Pending
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Your shop registration is currently under review by our administrators.
                        We will notify you once a decision has been made.
                    </p>
                    
                    <div className="mt-12 mb-8 flex flex-col items-center space-y-4">
                        <button
                            onClick={handleLogout}
                            className="w-full max-w-xs inline-flex justify-center items-center px-6 py-3 bg-leaf-primary text-white text-base font-medium rounded-md hover:bg-leaf-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-leaf-primary transition-colors duration-200 shadow-md bg-leaf-button-main"
                        >
                            Return to Welcome Page
                        </button>
                        <Link
                            href={route('login')}
                            className="w-full max-w-xs inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-leaf-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-leaf-primary transition-colors duration-200 shadow-sm"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
} 
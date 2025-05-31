import { Head, Link } from '@inertiajs/react';

export default function PendingApproval({ status, reason }) {
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
                    
                    <div className="mt-6 flex justify-center">
                        <Link
                            href={route('welcome')}
                            className="inline-flex items-center px-4 py-2 bg-leaf-primary text-white text-sm font-medium rounded-md hover:bg-leaf-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-leaf-primary transition-colors duration-200"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
} 
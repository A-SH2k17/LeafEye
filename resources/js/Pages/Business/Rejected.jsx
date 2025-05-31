import { Head } from '@inertiajs/react';

export default function Rejected({ reason }) {
    return (
        <>
            <Head title="Registration Rejected" />
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Shop Registration Rejected
                    </h2>
                    <div className="mt-2 text-center text-sm text-gray-600">
                        <p className="mb-4">
                            We regret to inform you that your shop registration has been rejected.
                        </p>
                        {reason && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <p className="text-red-700">
                                    Reason: {reason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 
import UnauthenticatedLayout from '@/Layouts/UnauthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {

    return (
        <>
            <Head title="Welcome" />
            <UnauthenticatedLayout>
            <div className='grid sm:grid-cols-2'>
                <div className='p-4'>
                    <h1 className='text-4xl f'>Welcome to LeafEye</h1>
                    <h2 className='text-2xl font-bold'>Let's Grow Green Together</h2>
                    <div className='w-4/5 '>
                        <p className='mt-4 '>
                        Grow healthier plants effortlessly with our all-in-one plant care app! Use AI-powered disease detection and smart fertilizer recommendations, connect with farmers on social media, shop for essentials, and get expert advice from our chatbot. Download now to take your gardening to the next level!
                        </p>
                    </div>
                </div>
                <div className='flex sm:justify-center ml-4'>
                    <img src="images/Welcome/7.png" alt=""/>
                </div>
            </div>
            </UnauthenticatedLayout>
        </>
    );
}

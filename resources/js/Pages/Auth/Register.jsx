import InputError from '@/Components/Primitive/InputError';
import InputLabel from '@/Components/Primitive/InputLabel';
import PrimaryButton from '@/Components/Primitive/PrimaryButton';
import TextInput from '@/Components/Primitive/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name:'',
        location:'',
        phone_number:'',
        email: '',
        password: '',
        password_confirmation: '',
        username:'',
        customerType:'',
    });

    const [step, setStep] = useState(1);
    const [customerType, setCustomerType] = useState('');
    const [showBusinessStep, setShowBusinessStep] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleCustomerTypeChange = (e) => {
        const type = e.target.value;
        setCustomerType(type);
        setData('customerType', type);
        setShowBusinessStep(type === 'business');
      };
    
    const nextStep = () => {
    if (step === 1 && !data.customerType) {
        alert('Please select a customer type');
        return;
    }
    
    if (step === 3 && !showBusinessStep) {
        // Skip business info step for non-business users
        submit();
        return;
    }
    
    setStep(step + 1);
    };

    const prevStep = () => {
    setStep(step - 1);
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                {[1, 2, 3, ...(showBusinessStep ? [4] : [])].map((stepNumber) => (
                    <div 
                    key={stepNumber} 
                    className={`w-${showBusinessStep ? '1/4' : '1/3'} text-center`}
                    >
                    <div 
                        className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center 
                        ${step === stepNumber ? 'bg-leaf-button-main text-white' : 
                            step > stepNumber ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                        {stepNumber}
                    </div>
                    <div className="text-xs mt-1">
                        {stepNumber === 1 && 'User Type'}
                        {stepNumber === 2 && 'Personal Info'}
                        {stepNumber === 3 && 'Account Info'}
                        {stepNumber === 4 && 'Business Info'}
                    </div>
                    </div>
                ))}
                </div>
                <div className="w-full bg-gray-200 h-1 mb-6">
                <div 
                    className="bg-leaf-button-main h-1" 
                    style={{ width: `${(step / (showBusinessStep ? 4 : 3)) * 100}%` }}
                ></div>
                </div>
            </div>

            <form onSubmit={submit}>
                {/* Step 1: Customer Type */}
                {step === 1 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Choose User Type</h2>
                    
                    <div className="mb-4">
                    <label className="flex items-center mb-2">
                        <input
                        type="radio"
                        name="customerType"
                        value="normal"
                        checked={data.customerType === 'normal'}
                        onChange={handleCustomerTypeChange}
                        className="mr-2"
                        />
                        <span>Farming Enthusiast</span>
                    </label>
                    
                    <label className="flex items-center">
                        <input
                        type="radio"
                        name="customerType"
                        value="business"
                        checked={data.customerType === 'business'}
                        onChange={handleCustomerTypeChange}
                        className="mr-2"
                        />
                        <span>Business Owner</span>
                    </label>
                    
                    {errors.customerType && (
                        <div className="text-red-500 text-sm mt-1">{errors.customerType}</div>
                    )}
                    </div>
                </div>
                )}

                {/* Step 2: Personal Information */}
                {step === 2 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className='mt-4'>
                        <InputLabel htmlFor="first_name" value="First Name" />

                        <TextInput
                            id="first_name"
                            name="first_name"
                            value={data.first_name}
                            className="mt-1 block w-full"
                            autoComplete="first_name"
                            isFocused={true}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />

                        <InputError message={errors.first_name} className="mt-2" />
                    </div>

                    <div className='mt-4'>
                        <InputLabel htmlFor="last_name" value="Last Name" />

                        <TextInput
                            id="last_name"
                            name="last_name"
                            value={data.last_name}
                            className="mt-1 block w-full"
                            autoComplete="last_name"
                            isFocused={true}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />

                        <InputError message={errors.last_name} className="mt-2" />
                    </div>

                    <div className='mt-4'>
                        <InputLabel htmlFor="location" value="Address" />

                        <TextInput
                            id="location"
                            name="location"
                            value={data.location}
                            className="mt-1 block w-full"
                            autoComplete="location"
                            isFocused={true}
                            onChange={(e) => setData('location', e.target.value)}
                        />

                        <InputError message={errors.location} className="mt-2" />
                    </div>

                    <div className='mt-4'>
                        <InputLabel htmlFor="phone_number" value="Phone Number" />

                        <TextInput
                            id="phone_number"
                            name="phone_number"
                            value={data.phone_number}
                            className="mt-1 block w-full"
                            autoComplete="phone_number"
                            isFocused={true}
                            onChange={(e) => setData('phone_number', e.target.value)}
                        />

                        <InputError message={errors.phone_number} className="mt-2" />
                    </div>
                </div>
                )}

                {/* Step 3: Account Information */}
                {step === 3 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                    <div className='mt'>
                        <InputLabel htmlFor="username" value="Username" />

                        <TextInput
                            id="username"
                            name="username"
                            value={data.username}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('username', e.target.value)}
                        />

                        <InputError message={errors.username} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>
                )}

                {/* Step 4: Business Information (Conditional) */}
                {step === 4 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Store Information</h2>
                    
                    <div className="mb-4">
                    <label className="block mb-1">Store Name</label>
                    <input
                        type="text"
                        value={data.storeName}
                        onChange={e => setData('storeName', e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.storeName && (
                        <div className="text-red-500 text-sm mt-1">{errors.storeName}</div>
                    )}
                    </div>
                    
                    <div className="mb-4">
                    <label className="block mb-1">Store Address</label>
                    <textarea
                        value={data.storeAddress}
                        onChange={e => setData('storeAddress', e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.storeAddress && (
                        <div className="text-red-500 text-sm mt-1">{errors.storeAddress}</div>
                    )}
                    </div>
                    
                    <div className="mb-4">
                    <label className="block mb-1">Store Phone</label>
                    <input
                        type="text"
                        value={data.storePhone}
                        onChange={e => setData('storePhone', e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.storePhone && (
                        <div className="text-red-500 text-sm mt-1">{errors.storePhone}</div>
                    )}
                    </div>
                    
                    <div className="mb-4">
                    <label className="block mb-1">Store Description</label>
                    <textarea
                        value={data.storeDescription}
                        onChange={e => setData('storeDescription', e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.storeDescription && (
                        <div className="text-red-500 text-sm mt-1">{errors.storeDescription}</div>
                    )}
                    </div>
                </div>
                )}

                <div className="flex justify-between mt-6">
                {step > 1 && (
                    <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={processing}
                    >
                    Previous
                    </button>
                )}
                
                {step < (showBusinessStep ? 4 : 3) ? (
                    <>
                        <Link
                            href={route('login')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Already registered?
                        </Link>
                        <button
                        type="button"
                        onClick={nextStep}
                        className="px-4 py-2 bg-leaf-button-main text-white rounded hover:bg-leaf-button-200"
                        disabled={processing}
                        >
                        Next
                        </button>
                    </>
                    
                ) : (
                    <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:leaf-button-200"
                    disabled={processing}
                    >
                    Register
                    </button>
                )}
                </div>
            </form>
        </GuestLayout>
    );
}

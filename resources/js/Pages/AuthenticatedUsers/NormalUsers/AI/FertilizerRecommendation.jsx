import React from "react";
import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/multilanguage";
import AuthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import Footer from "@/Components/NonPrimitive/Footer";

export default function FertilizerRecommendation() {
    // Multilanguage code
    const { lang, handleChange, languages } = useLanguage();
    const { t } = useTranslation();
    
    // Form handling with Inertia's useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        district_name: '',
        soil_color: '',
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        ph: '',
        rainfall: '',
        temperature: '',
        crop: ''
    });
    
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);

    // Available options for dropdown menus based on the provided data
    const soilColors = ["Black", "Red", "Medium Brown", "Dark Brown", "Light Brown", "Reddish Brown"];
    const cropTypes = ["Sugarcane", "Jowar", "Cotton", "Rice", "Wheat", "Groundnut", "Maize", "Tur", 
                     "Urad", "Moong", "Gram", "Masoor", "Soybean", "Ginger", "Turmeric", "Grapes"];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        
        // Use Inertia post instead of axios
        post('/', {
            preserveScroll: true,
            onSuccess: (response) => {
                // Access the response from the props
                if (response?.props?.recommendation) {
                    setRecommendation(response.props.recommendation);
                }
            },
            onError: (errors) => {
                setError(`Error: ${errors.message || 'Failed to get recommendation'}`);
                console.error("Failed to fetch recommendation:", errors);
            }
        });
    };

    return (
        <>
            <Head title="Fertilizer Recommendation" />
            <AuthenticatedLayout lang={lang}>
                <select value={lang} onChange={handleChange} className='m-4 mt-20'>
                    {languages.map((item) => {
                        return (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.text}
                            </option>
                        );
                    })}
                </select>
                <div className="max-w-md mx-auto p-4">
                    <div className="bg-green-50 p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold text-green-800 mb-2">{t('Fertilizer Recommendation')}</h1>
                        <a href={'/'} className="text-sm text-green-600 mb-6">
                            {t('View Recommendation History')}
                        </a>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('District Name')}</label>
                                <input
                                    type="text"
                                    value={data.district_name}
                                    onChange={e => setData('district_name', e.target.value)}
                                    placeholder={t('Enter district name')}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.district_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.district_name}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('Soil Color')}</label>
                                <select
                                    value={data.soil_color}
                                    onChange={e => setData('soil_color', e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">{t('Select Soil Color')}</option>
                                    {soilColors.map((color) => (
                                        <option key={color} value={color}>{t(color)}</option>
                                    ))}
                                </select>
                                {errors.soil_color && (
                                    <p className="mt-1 text-sm text-red-600">{errors.soil_color}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('Nitrogen (mg/kg)')}</label>
                                <input
                                    type="number"
                                    value={data.nitrogen}
                                    onChange={e => setData('nitrogen', e.target.value)}
                                    step="0.1"
                                    placeholder={t('Enter nitrogen content')}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.nitrogen && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nitrogen}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('Phosphorus (mg/kg)')}</label>
                                <input
                                    type="number"
                                    value={data.phosphorus}
                                    onChange={e => setData('phosphorus', e.target.value)}
                                    step="0.1"
                                    placeholder={t('Enter phosphorus content')}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.phosphorus && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phosphorus}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('Potassium (mg/kg)')}</label>
                                <input
                                    type="number"
                                    value={data.potassium}
                                    onChange={e => setData('potassium', e.target.value)}
                                    step="0.1"
                                    placeholder={t('Enter potassium content')}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.potassium && (
                                    <p className="mt-1 text-sm text-red-600">{errors.potassium}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('pH')}</label>
                                <input
                                    type="number"
                                    value={data.ph}
                                    onChange={e => setData('ph', e.target.value)}
                                    step="0.1"
                                    min="0"
                                    max="14"
                                    placeholder={t('Enter soil pH')}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.ph && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ph}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('Rainfall (mm)')}</label>
                                <input
                                    type="number"
                                    value={data.rainfall}
                                    onChange={e => setData('rainfall', e.target.value)}
                                    step="0.1"
                                    placeholder={t('Enter rainfall')}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.rainfall && (
                                    <p className="mt-1 text-sm text-red-600">{errors.rainfall}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('Temperature (°C)')}</label>
                                <input
                                    type="number"
                                    value={data.temperature}
                                    onChange={e => setData('temperature', e.target.value)}
                                    step="0.1"
                                    placeholder={t('Enter temperature')}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.temperature && (
                                    <p className="mt-1 text-sm text-red-600">{errors.temperature}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('Crop Type')}</label>
                                <select
                                    value={data.crop}
                                    onChange={e => setData('crop', e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">{t('Select Crop Type')}</option>
                                    {cropTypes.map((type) => (
                                        <option key={type} value={type}>{t(type)}</option>
                                    ))}
                                </select>
                                {errors.crop && (
                                    <p className="mt-1 text-sm text-red-600">{errors.crop}</p>
                                )}
                            </div>
                            
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {processing ? t('Processing...') : t('Recommend Fertilizer')}
                                </button>
                            </div>
                        </form>
                        
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        
                        {recommendation && (
                            <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-md">
                                <h2 className="text-lg font-semibold text-green-800 mb-2">{t('Recommended Fertilizer')}:</h2>
                                <p className="text-green-700">{recommendation.fertilizer_name}</p>
                                <p className="text-sm text-green-600 mt-2">{recommendation.description}</p>
                                <div className="mt-3">
                                    <h3 className="text-md font-medium text-green-800">{t('Application Rate')}:</h3>
                                    <p className="text-green-700">{recommendation.application_rate}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Footer lang={lang}/>
            </AuthenticatedLayout>
        </>
    );
}
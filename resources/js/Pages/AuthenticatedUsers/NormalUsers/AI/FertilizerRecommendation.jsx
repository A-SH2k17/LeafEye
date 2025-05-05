import React from "react";
import { useState } from "react";
<<<<<<< HEAD
import { Head,useForm} from "@inertiajs/react";
import axios from "axios";
=======
import { Head, useForm } from "@inertiajs/react";
>>>>>>> dba02db7279009ea098a53cb241ddb3c3bd54b41
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/multilanguage";

export default function FertilizerRecommendation() {
<<<<<<< HEAD
    //multilanguage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();
    //form code
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available options for dropdown menus
  const soilTypes = ["Clay", "Sandy", "Loamy", "Silt", "Peat", "Chalky"];
  const cropTypes = ["Corn", "Wheat", "Rice", "Soybeans", "Cotton", "Potatoes", "Tomatoes"];

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual Flask server URL
      const response = await axios.post(
        "http://localhost:5000/api/fertilizer-recommendation", 
        {
          soil_type: data.soilType,
          temperature: parseFloat(data.temperature),
          humidity: parseFloat(data.humidity),
          crop_type: data.cropType,
        }
      );

      setRecommendation(response.data);
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
      console.error("Failed to fetch recommendation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-green-50 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-green-800 mb-2">Fertilizer Recommendation</h1>
        <p className="text-sm text-green-600 mb-6">View Recommendation History</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Soil Type</label>
            <select
              {...register("soilType", { required: "Soil type is required" })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Soil Type</option>
              {soilTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.soilType && (
              <p className="mt-1 text-sm text-red-600">{errors.soilType.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
            <input
              type="number"
              {...register("temperature", { 
                required: "Temperature is required",
                min: { value: 0, message: "Temperature must be at least 0°C" },
                max: { value: 50, message: "Temperature must be at most 50°C" }
              })}
              step="0.1"
              placeholder="Enter temperature"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {errors.temperature && (
              <p className="mt-1 text-sm text-red-600">{errors.temperature.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Humidity (%)</label>
            <input
              type="number"
              {...register("humidity", { 
                required: "Humidity is required",
                min: { value: 0, message: "Humidity must be at least 0%" },
                max: { value: 100, message: "Humidity must be at most 100%" }
              })}
              step="0.1"
              placeholder="Enter humidity"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {errors.humidity && (
              <p className="mt-1 text-sm text-red-600">{errors.humidity.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Crop Type</label>
            <select
              {...register("cropType", { required: "Crop type is required" })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Crop Type</option>
              {cropTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.cropType && (
              <p className="mt-1 text-sm text-red-600">{errors.cropType.message}</p>
            )}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Recommend Fertilizer"}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {recommendation && (
          <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-md">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Recommended Fertilizer:</h2>
            <p className="text-green-700">{recommendation.fertilizer_name}</p>
            <p className="text-sm text-green-600 mt-2">{recommendation.description}</p>
            <div className="mt-3">
              <h3 className="text-md font-medium text-green-800">Application Rate:</h3>
              <p className="text-green-700">{recommendation.application_rate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
=======
    // Multilanguage code
    const { lang, handleChange, languages } = useLanguage();
    const { t } = useTranslation();
    
    // Form handling with Inertia's useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        soilType: '',
        temperature: '',
        humidity: '',
        cropType: ''
    });
    
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);

    // Available options for dropdown menus
    const soilTypes = ["Clay", "Sandy", "Loamy", "Silt", "Peat", "Chalky"];
    const cropTypes = ["Corn", "Wheat", "Rice", "Soybeans", "Cotton", "Potatoes", "Tomatoes"];

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
            
            <div className="max-w-md mx-auto p-4">
                <div className="bg-green-50 p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold text-green-800 mb-2">{t('Fertilizer Recommendation')}</h1>
                    <a href={'/'} className="text-sm text-green-600 mb-6">
                        {t('View Recommendation History')}
                    </a>
                    
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('Soil Type')}</label>
                            <select
                                value={data.soilType}
                                onChange={e => setData('soilType', e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">{t('Select Soil Type')}</option>
                                {soilTypes.map((type) => (
                                    <option key={type} value={type}>{t(type)}</option>
                                ))}
                            </select>
                            {errors.soilType && (
                                <p className="mt-1 text-sm text-red-600">{errors.soilType}</p>
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
                            <label className="block text-sm font-medium text-gray-700">{t('Humidity (%)')}</label>
                            <input
                                type="number"
                                value={data.humidity}
                                onChange={e => setData('humidity', e.target.value)}
                                step="0.1"
                                placeholder={t('Enter humidity')}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.humidity && (
                                <p className="mt-1 text-sm text-red-600">{errors.humidity}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('Crop Type')}</label>
                            <select
                                value={data.cropType}
                                onChange={e => setData('cropType', e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">{t('Select Crop Type')}</option>
                                {cropTypes.map((type) => (
                                    <option key={type} value={type}>{t(type)}</option>
                                ))}
                            </select>
                            {errors.cropType && (
                                <p className="mt-1 text-sm text-red-600">{errors.cropType}</p>
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
        </>
    );
>>>>>>> dba02db7279009ea098a53cb241ddb3c3bd54b41
}
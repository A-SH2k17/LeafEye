import React, { useState, useEffect } from 'react';
import { Plus, Camera } from 'lucide-react';
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoututhenticatedLayout";
import Footer from "@/Components/NonPrimitive/Footer";

export default function PlantMonitor() {
  // Language handling
  const [lang, setLang] = useState('en');
  
  const languages = [
    { value: 'en', text: 'English' },
    { value: 'es', text: 'Español' },
    { value: 'fr', text: 'Français' }
  ];

  const handleChange = (e) => {
    setLang(e.target.value);
  };

  // Plant data state
  const [plantImages, setPlantImages] = useState([
    {
      id: 1,
      date: '12-03-2025',
      imageUrl: '/images/pngtree-aesthetic-plant-png-image_9052723.png'
    },
    {
      id: 2,
      date: '25-03-2025',
      imageUrl: '/images/pngtree-aesthetic-plant-png-image_9052723.png'
    },
    {
      id: 3,
      date: '01-04-2025',
      imageUrl: '/images/pngtree-aesthetic-plant-png-image_9052723.png'
    },
    {
      id: 4,
      date: '12-04-2025',
      imageUrl: '/images/pngtree-aesthetic-plant-png-image_9052723.png'
    }
  ]);

  // Plant details
  const [plantInfo, setPlantInfo] = useState({
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    datePlanted: '12-03-2025',
    wateringFrequency: '7 days',
    sunlight: 'Indirect light'
  });
  
  // Function to add a new plant image
  const addNewImage = () => {
    // This would typically handle uploading and adding a new image
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    
    setPlantImages([
      ...plantImages,
      {
        id: plantImages.length + 1,
        date: dateStr,
        imageUrl: '/images/pngtree-aesthetic-plant-png-image_9052723.png'
      }
    ]);
  };

  // Translations object (simplified)
  const translations = {
    en: {
      title: 'PEACE LILY MONITOR',
      datePlanted: 'Date Planted',
      addImage: 'Add Image',
      plantDetails: 'Plant Details',
      scientificName: 'Scientific Name',
      wateringFrequency: 'Watering Frequency',
      sunlight: 'Sunlight',
      growthHistory: 'Growth History'
    },
    es: {
      title: 'MONITOR DE LIRIO DE PAZ',
      datePlanted: 'Fecha de plantación',
      addImage: 'Añadir imagen',
      plantDetails: 'Detalles de la planta',
      scientificName: 'Nombre científico',
      wateringFrequency: 'Frecuencia de riego',
      sunlight: 'Luz solar',
      growthHistory: 'Historial de crecimiento'
    },
    fr: {
      title: 'MONITEUR DE LIS DE PAIX',
      datePlanted: 'Date de plantation',
      addImage: 'Ajouter une image',
      plantDetails: 'Détails de la plante',
      scientificName: 'Nom scientifique',
      wateringFrequency: 'Fréquence d\'arrosage',
      sunlight: 'Lumière solaire',
      growthHistory: 'Historique de croissance'
    }
  };

  // Get text based on current language
  const t = (key) => {
    return translations[lang]?.[key] || translations['en'][key];
  };

  return (
    <>
      <Head title={t('title')} />
      <AuthenticatedLayout lang={lang}>
        <div className="flex justify-end p-4 pt-20">
          <select 
            value={lang} 
            onChange={handleChange} 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.text}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-green-50 min-h-screen">
          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-green-800">{t('title')}</h1>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-600">{t('datePlanted')}: {plantInfo.datePlanted}</p>
                  <button
                    onClick={addNewImage}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                  >
                    <Camera size={16} />
                    <span>{t('addImage')}</span>
                  </button>
                </div>
              </div>

              {/* Plant Details */}
              <div className="mb-6 bg-green-100 p-4 rounded-md">
                <h2 className="font-bold text-lg text-green-800 mb-2">{t('plantDetails')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('scientificName')}</p>
                    <p className="font-medium">{plantInfo.scientificName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('wateringFrequency')}</p>
                    <p className="font-medium">{plantInfo.wateringFrequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('sunlight')}</p>
                    <p className="font-medium">{plantInfo.sunlight}</p>
                  </div>
                </div>
              </div>

              {/* Plant Image Gallery */}
              <div className="bg-amber-50 p-4 rounded-md">
                <h2 className="font-bold text-lg text-amber-800 mb-4">{t('growthHistory')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {plantImages.map((image) => (
                    <div key={image.id} className="bg-white p-2 rounded shadow hover:shadow-md transition-shadow">
                      <img
                        src={image.imageUrl}
                        alt={`Plant on ${image.date}`}
                        className="w-full h-48 object-cover rounded"
                      />
                      <p className="text-center mt-2 text-gray-700">{image.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer lang={lang} />
      </AuthenticatedLayout>
    </>
  );
}
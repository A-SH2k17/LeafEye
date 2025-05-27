import React, { useState, useEffect } from 'react';
import { Plus, Camera } from 'lucide-react';
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Footer from "@/Components/NonPrimitive/Footer";
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';

export default function PlantMonitor(props) {
  // Language handling
  //multilangiage code
      const {lang,handleChange,languages} = useLanguage();
      const {t} = useTranslation();


  // Plant data state
  const plantImages = props.images;

  const handleAdd = () =>{
    router.post(
      route('monitor.add_plant_imagePost'),{
        'exactDate':props.exactDate,
      }
    )
  }
  return (
    <>
      <Head title={t('title')} />
      <AuthenticatedLayout lang={lang}>

        <div className="bg-green-50 min-h-screen">
          {/* Main Content */}
          <main className="container mx-auto px-4 py-6 pt-32">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-green-800">{props.type} - {props.collection}</h1>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-600">Date Planted: {props.plantDate}</p>
                  <button
                    onClick={()=>{handleAdd()}}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                  >
                    <Camera size={16} />
                    <span>{t('Add Image')}</span>
                  </button>
                </div>
              </div>

              

              {/* Plant Image Gallery */}
              <div className="bg-amber-50 p-4 rounded-md">
                <h2 className="font-bold text-lg text-amber-800 mb-4">{t('growthHistory')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {plantImages.map((image) => (
                    <div key={Date.now()} className="bg-white p-2 rounded shadow hover:shadow-md transition-shadow">
                      <img
                       src={`/storage/${image.image_path}`} 
                        alt={`Plant on ${image.datePlanted}`}
                        className="w- h-48 object-cover rounded"
                      />
                      <p className="text-center mt-2 text-gray-700">{image.datePlanted}</p>
                      <p className="text-center mt-2 text-gray-700">Health Staus: {image.diagnosis?image.diagnosis:"not diagnosed"}</p>
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
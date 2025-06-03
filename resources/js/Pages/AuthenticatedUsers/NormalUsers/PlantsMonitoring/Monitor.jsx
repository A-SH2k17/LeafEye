import React, { useState } from 'react';
import { Plus, Camera } from 'lucide-react';
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Footer from "@/Components/NonPrimitive/Footer";
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';
import { crops } from '/Users/alielsharkawy/Documents/Ali_Uni/Uni_Studies/Grad/LeafEyeMobile_53SDK/app/(fertilizerreccomendation)/cropsData.ts';

export default function PlantMonitor(props) {
  // Language handling
  const {lang,handleChange,languages} = useLanguage();
  const {t} = useTranslation();

  // Plant data state
  const plantImages = props.images;

  // Tab state
  const [tab, setTab] = useState('timeline');

  // Find crop data by name
  const crop = crops.find(c => c.name.toLowerCase() === props.type?.toLowerCase());

  const handleAdd = () => {
    router.visit(route('ai.disease_index', { user: props.auth.user.username }));
  };

  return (
    <>
      <Head title={t('title')} />
      <AuthenticatedLayout lang={lang}>
        <div className="bg-green-50 min-h-screen">
          <main className="container mx-auto px-4 py-6 pt-20">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-green-800">{props.type} - {props.collection}</h1>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-600">Date Planted: {props.plantDate}</p>
                  <button
                    onClick={handleAdd}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                  >
                    <Camera size={16} />
                    <span>{t('Add Image')}</span>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                  <button onClick={() => setTab('timeline')} className={`px-3 py-2 font-medium text-sm rounded-t ${tab === 'timeline' ? 'bg-green-100 text-green-800' : 'text-gray-500 hover:text-green-700'}`}>Timeline</button>
                  <button onClick={() => setTab('info')} className={`px-3 py-2 font-medium text-sm rounded-t ${tab === 'info' ? 'bg-green-100 text-green-800' : 'text-gray-500 hover:text-green-700'}`}>Plant Info</button>
                  <button onClick={() => setTab('care')} className={`px-3 py-2 font-medium text-sm rounded-t ${tab === 'care' ? 'bg-green-100 text-green-800' : 'text-gray-500 hover:text-green-700'}`}>Plant Care</button>
                </nav>
              </div>

              {/* Tab Content */}
              {tab === 'timeline' && (
                <div className="bg-amber-50 p-4 rounded-md">
                  <h2 className="font-bold text-lg text-amber-800 mb-4">{t('growthHistory')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {plantImages.map((image, idx) => (
                      <div key={image.image_path + idx} className="bg-white p-2 rounded shadow hover:shadow-md transition-shadow">
                        <img
                          src={`/storage/${image.image_path}`}
                          alt={`Plant on ${image.datePlanted}`}
                          className="w-full h-48 object-cover rounded"
                        />
                        <p className="text-center mt-2 text-gray-700">{t("diagnose_date")}: {image.datePlanted}</p>
                        <p className="text-center mt-2 text-gray-700">{t("healt")}: {image.diagnosis ? image.diagnosis : "not diagnosed"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'info' && crop && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <h2 className="font-bold text-lg text-blue-800 mb-4">Plant Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-green-700 mb-2">Quick Facts</h3>
                      <ul className="list-disc ml-6 text-gray-700">
                        <li>Type: {crop.name}</li>
                        <li>Lifespan: {crop.lifespan}</li>
                        <li>Distribution: {crop.distribution}</li>
                        <li>Height: {crop.height}</li>
                        <li>Spread: {crop.spread}</li>
                        <li>Leaf: {crop.leaf}</li>
                        <li>Planting: {crop.planting}</li>
                        <li>Difficulty: {crop.difficulty}</li>
                        <li>Toughness: {crop.toughness}</li>
                        <li>Maintenance: {crop.maintenance}</li>
                        <li>Perks: {crop.perks && crop.perks.join(', ')}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700 mb-2">Toxicity & Propagation</h3>
                      <ul className="list-disc ml-6 text-gray-700">
                        <li>Toxicity: {crop.toxicity}</li>
                        <li>Propagation: {crop.propagation}</li>
                        <li>Weed: {crop.weed}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'care' && crop && (
                <div className="bg-green-50 p-4 rounded-md">
                  <h2 className="font-bold text-lg text-green-800 mb-4">Plant Care</h2>
                  <div className="mb-4">
                    <h3 className="font-semibold text-green-700 mb-2">Care Instructions</h3>
                    <pre className="whitespace-pre-wrap text-gray-700 bg-white p-2 rounded">{crop.care}</pre>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-700 mb-2">Fertilization</h3>
                    <pre className="whitespace-pre-wrap text-gray-700 bg-white p-2 rounded">{crop.fertilization}</pre>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
        <Footer lang={lang} />
      </AuthenticatedLayout>
    </>
  );
}
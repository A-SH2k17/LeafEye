import Footer from "@/Components/NonPrimitive/Footer";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/multilanguage";
import { Head } from "@inertiajs/react";
import PageTitle from "@/Components/Primitive/PageTitle";
import { useState, useRef } from "react";
import PrimaryButton from "@/Components/Primitive/PrimaryButton";
import { router } from "@inertiajs/react";

export default function AddPlant(props) {
    // Multilanguage code
    const { lang, handleChange, languages } = useLanguage();
    const { t } = useTranslation();

    // Plant image and type code
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [plantType, setPlantType] = useState("");
    const [collectionName, setCollectionName] = useState("");
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setSelectedImage(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };
      
    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = () => {
        if (!selectedImage) {
            alert("Please upload a plant image");
            return;
        }

        if (!plantType.trim()) {
            alert("Please enter the plant type");
            return;
        }

        if (!collectionName.trim()) {
            alert("Please enter collection name");
            return;
        }

        setIsSubmitting(true);

        // Create FormData object to send to server
        const formData = new FormData();
        formData.append('username', props.auth.user.username);
        formData.append("image", selectedImage);
        formData.append("plantType", plantType);
        formData.append("collectionName",collectionName)

        // Send to server using Inertia
        router.post('/plant/add', formData, {
            forceFormData: true,
            onSuccess: () => {
                // Reset form after successful submission
                setSelectedImage(null);
                setImagePreview(null);
                setPlantType("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setIsSubmitting(false);
                if (props.onPlantAdded) props.onPlantAdded();
            },
            onError: (errors) => {
                alert("Error adding plant");
                console.error('Error submitting plant image:', errors);
                setIsSubmitting(false);
            }
        });
    };

    return(
        <AuthenticatedLayout lang={lang}>
            <Head title={t("add_plant")} />
            <div className="bg-opacity-90">
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
                <div className="p-4">
                    <div className="max-w-2xl mx-auto bg-green-50 rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <h1 className="text-xl font-bold text-green-800">{props.auth.user.username} - Add Plant</h1>
                        </div>

                        <div className="mb-6 border-2 border-dashed border-gray-300 bg-white p-4 rounded-lg">
                            {imagePreview ? (
                                <div className="relative">
                                    <img 
                                        src={imagePreview}
                                        alt="Plant Preview" 
                                        className="max-h-64 mx-auto object-contain"
                                    />
                                    <button 
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        type="button"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    className="flex flex-col items-center justify-center cursor-pointer py-6"
                                    onClick={triggerFileInput}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-600">Upload Image</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="plantType" className="block text-gray-700 font-medium mb-2">
                                Plant Type
                            </label>
                            <input
                                type="text"
                                id="plantType"
                                name="plantType"
                                value={plantType}
                                onChange={(e) => setPlantType(e.target.value)}
                                placeholder="Enter plant type"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="plantType" className="block text-gray-700 font-medium mb-2">
                               Collection Name
                            </label>
                            <input
                                type="text"
                                id="collectionName"
                                name="collectionName"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)}
                                placeholder="Enter plant type"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <PrimaryButton  onClick={handleSubmit}
                                disabled={isSubmitting}>
                                    {isSubmitting ? "Adding..." : "Add Plant"}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
            <Footer lang={lang}/>
        </AuthenticatedLayout>
    );
}
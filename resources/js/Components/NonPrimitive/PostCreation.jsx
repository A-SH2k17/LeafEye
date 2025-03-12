import React, { useState, useRef, useEffect } from "react";
import { router } from '@inertiajs/react';
import PrimaryButton from "../Primitive/PrimaryButton";
import { useLanguage } from "@/multilanguage";
import { useTranslation } from "react-i18next";

export default function PostCreation(props) {
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreveiw, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();

    const handlePostSubmit = () => {
        if (!postText.trim() && !selectedImage) {
            alert("Please enter some text or upload an image");
            return;
        }

        setIsSubmitting(true);

        // Create FormData object to send to server
        const formData = new FormData();
        formData.append('text', postText);
        formData.append('username', props.username);
        
        console.log(selectedImage);
        if (selectedImage) {
            formData.append("image", selectedImage); // Directly send file, no base64
        }

        // Send to server using Inertia
        router.post('/post', formData, {
            forceFormData: true,
            onSuccess: () => {
                // Reset form after successful submission
                setPostText('');
                setSelectedImage(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setIsSubmitting(false);
            },
            onError: (errors) => {
                alert(errors)
                console.error('Error submitting post:', errors);
                setIsSubmitting(false);
                // You could show these errors to the user
            }
        });
    };

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
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-[#e8fcef] hover:shadow-green-300 shadow-md p-4 rounded-2xl max-w-xl my-4">
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="relative">
                        <img 
                            src="/images/Welcome/cust.jpg" 
                            alt="Profile Avatar" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-200"
                        />
                    </div>
                    <span className="ml-3 text-lg text-gray-600 font-medium">{props.username}</span>
                </div>

                {/* Image Preview Section */}
                {selectedImage && (
                <div className="mb-4 relative">
                    <img 
                        src={imagePreveiw} 
                        alt="Preview" 
                        className="w-full h-64 object-contain rounded-lg border border-gray-200"
                    />
                    <button 
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-100"
                        disabled={isSubmitting}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                )}
                
                <div className="mb-4">
                    <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder={t("post_placeholder")}
                        className="w-full p-2 text-base font-bold focus:outline-none resize-none"
                        rows={2}
                        disabled={isSubmitting}
                    />
                </div>
                
                <div className="flex justify-end items-center gap-2">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                        disabled={isSubmitting}
                    />
                    <button 
                        className="p-2 text-gray-600 rounded-full hover:bg-gray-100 disabled:opacity-50" 
                        onClick={triggerFileInput}
                        disabled={isSubmitting}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </button>
                    
                    <PrimaryButton 
                        onClick={handlePostSubmit} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t("post_button_submitted") : t("post_button")}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}
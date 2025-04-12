import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';

export default function BusinessDashboard({ auth,lng}) {

    //code to save csrf and beareer token to avoid the 419 and 401 error in post
        useEffect(() => {
            // Extract CSRF token from URL parameters
            const params = new URLSearchParams(window.location.search);
            const token = params.get("csrfToken");
            const bearer = params.get("bearer_token");
    
            if (token) {
                localStorage.setItem("csrf_token", token); // Save to localStorage
                //setCsrfToken(token); // Update state
                console.log("CSRF Token saved:", token);
    
                // Remove csrfToken from URL
                params.delete("csrfToken");
                const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
                window.history.replaceState({}, "", newUrl);
            }
    
            if(bearer){
                localStorage.setItem("bearer_token", bearer); // Save to localStorage
                //setCsrfToken(token); // Update state
                console.log("Bearer Token saved:", bearer);
    
                // Remove csrfToken from URL
                params.delete("bearer_token");
                const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
                window.history.replaceState({}, "", newUrl);
            }
        }, []);


        //multilangiage code
            const {lang,handleChange,languages} = useLanguage();
            const {t} = useTranslation();



    return (
        <AuthenticatedLayout
            lang = {lang}
        >
            <Head title="Business Dashboard" />
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Welcome, Business Owner!</h1>
                            <p>This is your business dashboard. Here you can manage your shop and products.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 
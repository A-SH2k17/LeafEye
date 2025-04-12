import React, {useState} from "react";
import { useForm } from '@inertiajs/inertia-react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/NonPrimitive/Navbar";

export default function AddProduct({auth,shop}){
        //multilangiage code
        const {lang,handleChange,languages} = useLanguage();
        const {t} = useTranslation();
        return(
            <AuthenticatedLayout>
                <Head title="Add Product"/>
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
            </AuthenticatedLayout>
        )
}

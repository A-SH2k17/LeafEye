import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useLanguage } from "@/multilanguage";
import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";

export default function Feed(){
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();

    return(
        <>
            <AuthenticatedLayout lang={lang}>
                <Head title="Feed"/>
                <select value={lang} onChange={handleChange} className='m-4'>
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


        </>
    )
}
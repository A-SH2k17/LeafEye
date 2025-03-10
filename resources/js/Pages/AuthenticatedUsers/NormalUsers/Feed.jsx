import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useLanguage } from "@/multilanguage";
import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";
import PostCreation from "@/Components/NonPrimitive/PostCreation";
import Test from "@/Components/NonPrimitive/test";
import Test2 from "@/Components/NonPrimitive/Test2";

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
                {/**post creation section */}
                <PostCreation/>
                
                ggggggg
                gggjgrsgter
                <Test2/>
                


            </AuthenticatedLayout>


        </>
    )
}
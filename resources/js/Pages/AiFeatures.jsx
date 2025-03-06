import Footer from "@/Components/NonPrimitive/Footer";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/multilanguage";

export default function AiFeatures(){


    //multilanguage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();

    return(
        <>
        <Head title={t("ai_features_title")} />
        <UnauthenticatedLayout
        lang={lang}>
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
                <div className="px-5 py-4">
                <h1 className="text-2xl sm:3xl md:text-4xl border-b-2 w-fit border-[#000501] pb-1 mb-8">{t("ai_features_title")}</h1>

                {/**This is The crop Disease detection Feature */}
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
                        <div className="flex items-center">
                            <img src="images/AiFeatures/apple-orchard.jpg" alt="" className="rounded-xl shadow-lg max-w-full"/>
                        </div>
                        <div className="p-4 flex flex-col justify-center">
                                <h2 className="mb-4 text-xl sm:text-2xl md:text-3xl font-semibold">{t("disease_title")}</h2>
                                <p className="leading-relaxed text-base md:text-lg">
                                    {t("crop_text")}
                                </p>
                        </div>
                    </div>
                </div>


                {/**This is the Fertilizer Feature */}
                <div className="py-4 px-5 bg-[#D1E3C9]">
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
                    <div className="p-4 flex flex-col justify-center">
                                <h2 className="mb-4 text-xl sm:text-2xl md:text-3xl font-semibold">{t("fert_title")}</h2>
                                <p className="leading-relaxed text-base md:text-lg">
                                    {t("fert_content")}
                                </p>
                        </div>
                        <div className="flex items-center">
                            <img src="images/AiFeatures/fert.png" alt="" className="rmax-w-full"/>
                        </div>
                    </div>
                </div>
                <Footer lang={lang}/>
        </UnauthenticatedLayout>
        </>
    )
}
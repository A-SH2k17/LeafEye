import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Feed(){
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();

    return(
        <>
            <AuthenticatedLayout lang={lang}>
                <Head title="Feed."/>
            </AuthenticatedLayout>


        </>
    )
}
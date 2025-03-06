import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

const languages = [
    { value: "", text: "Options" },
    { value: "en", text: "English" },
    { value: "ar", text: "Arabic" },
    { value: "es", text: "Español" },
    { value: "de", text: "Deutsch" },
];

export const useLanguage = () => {
    const [lang, setLang] = useState(localStorage.getItem("selectedLang") || "en");
    const {url} = usePage();
    
    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        const urlLang = params.get("lng");
        if (urlLang) {
            setLang(urlLang);
            localStorage.setItem("selectedLang", urlLang);
        }
    }, []);
    
    const handleChange = (e) => {
        setLang(e.target.value);
        let loc = url.split("?")[0];
        window.location.replace(loc + "?lng=" + e.target.value);
    };
    
    return { lang, handleChange, setLang,languages };
};
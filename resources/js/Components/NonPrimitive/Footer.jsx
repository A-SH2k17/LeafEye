import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer({lang}){
    const {t} = useTranslation();
    return(
        <footer className="bg-leaf-nav-back p-6 md:p-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                {/* Logo & Slogan */}
                <div>
                <img src="/images/logo_trans.png" alt="Leaf-EYE Logo" className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 mx-auto md:mx-0" />
                <h2 className="font-bold text-lg mt-2">{t("slogan")}</h2>
                </div>
                
                {/* Discover */}
                <div>
                <h3 className="font-bold text-lg">{t("discover")}</h3>
                <ul className="mt-2 space-y-1">
                    <li><a href={`/?lng=${lang}`} className="hover:underline">{t("home_link")}</a></li>
                    <li><a href={route('features_ai',{lng: lang})} className="hover:underline">{t("f_listing2")}</a></li>
                </ul>
                </div>

                {/* About */}
                <div>
                <h3 className="font-bold text-lg">{t("About")}</h3>
                <ul className="mt-2 space-y-1">
                    <li><a href="#" className="hover:underline">{t("aboutUs")}</a></li>
                    <li><a href="#" className="hover:underline">{t("t_service")}</a></li>
                </ul>
                </div>

                {/* Help */}
                <div>
                <h3 className="font-bold text-lg">{t("Help")}</h3>
                <ul className="mt-2 space-y-1">
                    <li><a href="#" className="hover:underline">{t("contact")}</a></li>
                    <li><a href="#" className="hover:underline">FAQ</a></li>
                </ul>
                </div>
            </div>
            {/* Horizontal Line */}
            <hr className="mt-6 border-gray-400" />
            <p className="text-gray-700 mt-1">2025 LeafEye GradProject Team</p>
        </footer>
    )
}
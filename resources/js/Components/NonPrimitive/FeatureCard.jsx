import { Link } from "@inertiajs/react";
import React from "react";
import { useTranslation } from "react-i18next";
import "../../i18n.js";

export default function FeatureCard(props){

    const { t } = useTranslation();
    
    return(
        <div className=" p-6 h-full">
            <div className="flex flex-col items-center text-center">
                <div className="flex flex-shrink-0">
                    <div className="mb-4">
                    {props.img}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                    {props.isAiFeatures?<Link
                                            className="text-[#A96C0B]"
                                            href={route('dashboard')}
                                        >{t(props.title)}
                                        </Link>:t(props.title)}
                </h3>
            </div>
        </div>
    )
}
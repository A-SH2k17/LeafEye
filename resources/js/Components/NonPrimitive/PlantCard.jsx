import react from "react";
import { useTranslation } from 'react-i18next';

export default function PlantCard({plant}){
    const {t} = useTranslation();

    return (
        <div className="sm:w-[25vh] md:w-[50vh]  bg-[#A6C5A7] m-5 rounded-2xl p-4 shadow-lg">
            <div className="bg-gray-200 rounded-lg overflow-hidden mb-4 flex">
                <img 
                src={`/storage/${plant.image_path}`} 
                alt={plant.type} 
                className="h-[150px] w-1/2 object-cover"
                />
                <div className="p-4">
                    <p className="font-medium">{t("plant_type")}</p>
                    <p className="text-gray-600 mb-2">{plant.type}</p>
                    
                    <p className="font-medium">{t("date_plant")}</p>
                    <p className="text-gray-600 mb-4">{plant.datePlanted}</p>
                </div>
            </div>
            <div className="p-2">
                
                <button className="w-full bg-leaf-button-main text-white py-2 px-4 rounded hover:bg-green-800 transition-colors">
                {t("monitor")}
                </button>
            </div>
        </div>
    )
}
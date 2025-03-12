import React from "react";
import PrimaryButton from "../Primitive/PrimaryButton";
import { Heart, MessageSquare } from 'lucide-react';

export default function PostCard(){
    return(
        <div className="p-4  rounded-lg shadow-xl my-3 max-w-xl bg-[#e8fcef]">
            <div className="flex items-center">
                <div className="relative">
                    <img 
                        src="images/Welcome/cust.jpg" 
                        alt="Profile Avatar" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-200"
                    />
                </div>
                <span className="mx-3 text-lg text-gray-600 font-medium">User Name</span>
                <PrimaryButton>Follow</PrimaryButton>
            </div>
            <img 
                        src="images/SocialMedia/tomato.jpg" 
                        alt="Profile Avatar" 
                        className="w-3/4 mt-2 mb-4 mx-auto"
            />
            <div className="p-4">
                <div className="flex items-center space-x-4 text-sm mb-2">
                    <div className="flex items-center">
                    <Heart size={16} className="mr-1 text-black" />
                    <span>10</span>
                    </div>
                    <div className="flex items-center">
                    <MessageSquare size={16} className="mr-1 text-black" />
                    <span>10</span>
                    </div>
                </div>
                
                <div className="mb-2">
                    <div className="font-medium">User A</div>
                </div>
                
                <div className="mb-3">
                    <p className="text-sm">
                    "Fresh, juicy, and homegrown! 🍅 Nothing beats the taste of 
                    perfectly ripe tomatoes straight from the garden. ✨💚 
                    #HomeGrown #FreshTomatoes #GardenToTable"
                    </p>
                </div>
                
                <div className="text-xs text-gray-500">
                    Posted 4 Days Ago
                </div>
            </div>
        </div>
    )
}
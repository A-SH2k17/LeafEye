import React from "react";
import PrimaryButton from "../Primitive/PrimaryButton";
import { Heart, MessageSquare } from 'lucide-react';
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function PostCard(props){

    const [likeCounts,setLikeCounts] = useState(props.post.like_counts)
    const [likedByUser,setLikedByUser] = useState(props.post.liked_by_user)

    const [error, setError] = useState(null);

    const likeSwitch = () => {
        fetch(route("feed.user_like",{user:props.active_user,post:props.post.post_id}), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
            },
            body: JSON.stringify({
                user: props.active_user,
                post: props.post.post_id,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            setLikeCounts(data.like_counts);
            setLikedByUser(data.liked);
        })
        .catch((error) => console.error("Error:", error));
    };
    
    
    
    
    return(
        <div className="p-4  rounded-lg shadow-xl my-3 max-w-xl bg-[#e8fcef]">
            <div className="flex items-center">
                <div className="relative">
                    <img 
                        src="/images/Welcome/cust.jpg" 
                        alt="Profile Avatar" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-200"
                    />
                </div>
                <span className="mx-3 text-lg text-gray-600 font-medium">{props.post.post_user}</span>
                <PrimaryButton>Follow</PrimaryButton>
            </div>
            {
                props.post.post_image &&
                <img 
                        src={props.post.post_image} 
                        alt="Profile Avatar" 
                        className="w-3/4 mt-2 mb-4 mx-auto"
                />
            }
            <div className="p-4 bg-[#fafcff] rounded-md m-2">
                <div className="flex items-center space-x-4 text-sm mb-2">
                    <div className="flex items-center">
                    <Heart size={16} className="mr-1 text-black active:scale-125" fill={likedByUser?"red":"white"} onClick={likeSwitch}/>
                    <span>{likeCounts}</span>
                    </div>
                    <div className="flex items-center">
                    <MessageSquare size={16} className="mr-1 text-black" />
                    <span>{props.post.comment_counts}</span>
                    </div>
                </div>    
                <div className="mb-3">
                    <p className="text-sm">
                    {props.post.post_description}
                    </p>
                </div>
                
                <div className="text-xs text-gray-500">
                    Posted 4 Days Ago
                </div>
            </div>
        </div>
    )
}
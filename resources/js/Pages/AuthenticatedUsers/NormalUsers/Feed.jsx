import React, { useState,useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useLanguage } from "@/multilanguage";
import { useTranslation } from "react-i18next";
import { Head,router} from "@inertiajs/react";
import PostCreation from "@/Components/NonPrimitive/PostCreation";
import Footer from "@/Components/NonPrimitive/Footer";
import PrimaryButton from "@/Components/Primitive/PrimaryButton";
import PostCard from "@/Components/NonPrimitive/PostCard";

export default function Feed(props){
    //multilanguage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();




    const posts = props.posts.original.posts;

    //console.log(posts[0])
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
                <div className="grid grid-rows-2 md:grid-cols-2">
                    <div className="div1">
                        {/**post creation section */}
                        <div className="p-4">
                            <h1 className="text-xl sm:text-2xl md:text-3xl border-b-2 border-[#000501] w-fit">{t("farmer_feed_title")}</h1>
                            <PostCreation username={props.auth.user.username}/>
                            
                            {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post.post_id} post={post} active_user={props.auth.user.id} />
                            ))
                            ) : (
                            <p className="text-gray-500">{t("no_posts_available")}</p>
                            )}
                        </div>
                        
                    </div>
                    <div className="div2">
                    </div>
                    <div className="div3">
                    </div>
                </div>
             <Footer lang={lang}/>
            </AuthenticatedLayout>

        </>
    )
}
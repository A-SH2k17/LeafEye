import React, { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useLanguage } from "@/multilanguage";
import { useTranslation } from "react-i18next";
import { Head, router } from "@inertiajs/react";
import PostCreation from "@/Components/NonPrimitive/PostCreation";
import Footer from "@/Components/NonPrimitive/Footer";
import PrimaryButton from "@/Components/Primitive/PrimaryButton";
import PostCard from "@/Components/NonPrimitive/PostCard";
import axios from "axios";

export default function Feed(props) {
    // multilanguage code
    const { lang, handleChange, languages } = useLanguage();
    const { t } = useTranslation();

    // State for posts
    const [posts, setPosts] = useState(props.posts.original.posts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    // Reference to detect when user scrolls to bottom
    const observer = useRef();
    const lastPostElementRef = useRef();

    // Function to load more posts
    const loadMorePosts = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await axios.get(`/api/posts?page=${nextPage}&limit=3`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('bearer_token')}`
                }
            });
            
            const newPosts = response.data.posts;
            
            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Error loading more posts:", error);
        } finally {
            setLoading(false);
        }
    };

    // Setup intersection observer for infinite scrolling
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 0.1
        };
        
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                loadMorePosts();
            }
        }, options);
        
        if (lastPostElementRef.current) {
            observer.current.observe(lastPostElementRef.current);
        }
        
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [hasMore, loading, page]);


    // Function to fetch latest posts
    const fetchLatestPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/posts?page=1&limit=3`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('bearer_token')}`
                }
            });
            setPosts(response.data.posts); // Update state with new posts
            setPage(1);
            setHasMore(true);
        } catch (error) {
            console.error("Error fetching latest posts:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthenticatedLayout lang={lang}>
                <Head title="Feed" />
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
                            <PostCreation 
                                username={props.auth.user.username} 
                                onPostCreated={fetchLatestPosts}
                            />
                            {posts && posts.length > 0 ? (
                                posts.map((post, index) => {
                                    // Add ref to last post element
                                    if (posts.length === index + 1) {
                                        return (
                                            <div ref={lastPostElementRef} key={post.post_id}>
                                                <PostCard 
                                                    post={post} 
                                                    active_user_id={props.auth.user.id} 
                                                    active_username={props.auth.user.username} 
                                                />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <PostCard 
                                                key={post.post_id} 
                                                post={post} 
                                                active_user_id={props.auth.user.id} 
                                                active_username={props.auth.user.username} 
                                            />
                                        );
                                    }
                                })
                            ) : (
                                <p className="text-gray-500">{t("no_posts_available")}</p>
                            )}
                            
                            {loading && (
                                <div className="text-center py-4">
                                    <p>{t("loading_more_posts")}</p>
                                </div>
                            )}
                            
                            {!hasMore && posts.length > 0 && (
                                <div className="text-center py-4">
                                    <p>{t("no_more_posts")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="div2">
                    </div>
                    <div className="div3">
                    </div>
                </div>
                <Footer lang={lang} />
            </AuthenticatedLayout>
        </>
    );
}
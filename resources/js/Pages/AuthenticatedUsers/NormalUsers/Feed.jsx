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
import MessagesCard from "@/Components/NonPrimitive/MesagesCard";
import FollowerCard from "@/Components/NonPrimitive/FollowerCard";
import { MessageSquare, UserPlus } from "lucide-react";

export default function Feed(props) {
    // multilanguage code
    const { lang, handleChange, languages } = useLanguage();
    const { t } = useTranslation();

    // State for posts
    const [posts, setPosts] = useState(props.posts.original.posts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    // Track followed users globally
    const [followedUsers, setFollowedUsers] = useState(
        posts.reduce((acc, post) => {
            acc[post.user_id] = post.user_followed;
            return acc;
        }, {})
    );
    
    // Reference to detect when user scrolls to bottom
    const observer = useRef();
    const lastPostElementRef = useRef();

    // Function to handle follow/unfollow
    const handleFollowUser = async (userId) => {
        try {
            const response = await fetch(
                route("feed.user_follow", {
                    user: userId,
                    followed_by: props.auth.user.id
                }), 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": localStorage.getItem("csrf_token"),
                        "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`,
                    },
                }
            );
            const data = await response.json();
            
            // Update all posts with this user
            setFollowedUsers(prev => ({
                ...prev,
                [userId]: data.followed
            }));
        } catch (error) {
            console.error("Error:", error);
        }
    };

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
                // Update posts and also update followed users state
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
                
                // Update followed users state with new posts
                const newFollowedUsers = {};
                newPosts.forEach(post => {
                    newFollowedUsers[post.user_id] = post.user_followed;
                });
                
                setFollowedUsers(prev => ({
                    ...prev,
                    ...newFollowedUsers
                }));
                
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
            
            const latestPosts = response.data.posts;
            setPosts(latestPosts); // Update state with new posts
            
            // Update followed users state with new posts
            const newFollowedUsers = {};
            latestPosts.forEach(post => {
                newFollowedUsers[post.user_id] = post.user_followed;
            });
            
            setFollowedUsers(newFollowedUsers);
            
            setPage(1);
            setHasMore(true);
        } catch (error) {
            console.error("Error fetching latest posts:", error);
        } finally {
            setLoading(false);
        }
    };


    //adjusting the message appearance
    const [messageActive,setMessageActive] = useState(false)
    const messageSwitch = () =>{
        setMessageActive(!messageActive)
    }

    //adjusting the follower appearance
    const [followersActive,setFollowersActive] = useState(false)
    const FollowSwitch = () =>{
        setFollowersActive(!followersActive)
    }
    return (
        <>
            <AuthenticatedLayout lang={lang}>
                <Head title="Feed" />
                <select value={lang} onChange={handleChange} className='m-4 mt-20'>
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
                            <h1 className="text-xl sm:text-2xl md:text-3xl border-b-2 border-[#000501] w-fit">{t("farmer_feed_title")} </h1>
                            <div className="flex justify-evenly mt-4">
                                <h1 className="text-lg sm:text-xl block md:hidden">Mesages <button onClick={messageSwitch}><MessageSquare className="md:hidden inline w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700"/></button></h1>
                                <h1 className="text-lg sm:text-xl block md:hidden">Followers <button onClick={FollowSwitch}><UserPlus className="md:hidden inline w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700"/></button></h1>
                            </div>
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
                                                    post={{
                                                        ...post,
                                                        user_followed: followedUsers[post.user_id]
                                                    }} 
                                                    active_user_id={props.auth.user.id} 
                                                    active_username={props.auth.user.username}
                                                    onFollowToggle={handleFollowUser}
                                                />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <PostCard 
                                                key={post.post_id} 
                                                post={{
                                                    ...post,
                                                    user_followed: followedUsers[post.user_id]
                                                }} 
                                                active_user_id={props.auth.user.id} 
                                                active_username={props.auth.user.username}
                                                onFollowToggle={handleFollowUser}
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
                            
                        </div>
                    </div>
                    <MessagesCard user_id = {props.auth.user.id} active={messageActive} toggle={messageSwitch}/>
                    <FollowerCard user_id = {props.auth.user.id} active={followersActive} toggle={FollowSwitch}/>
                </div>
                <Footer lang={lang} />
            </AuthenticatedLayout>
        </>
    );
}
import React from "react";
import PrimaryButton from "../Primitive/PrimaryButton";
import { Heart, MessageSquare, X, Flag } from 'lucide-react';
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function PostCard(props){
    const [likeCounts, setLikeCounts] = useState(props.post.like_counts)
    const [commentCounts, setCommentCounts] = useState(props.post.comment_counts)
    const [likedByUser, setLikedByUser] = useState(props.post.liked_by_user)
    const [error, setError] = useState(null);
    const [followed, setFollow] = useState(props.post.user_followed);
    const [commentActive, setCommentActive] = useState(false);
    const [comments, setComments] = useState(props.post.comments || [])
    const [userComment, setUserComment] = useState("")
    const [reportCount, setReportCount] = useState(props.post.report_count || 0)
    const [reportedByUser, setReportedByUser] = useState(props.post.reported_by_user || false)
    
    // Use the parent component's follow handler
    const followSwitch = () => {
        if (props.onFollowToggle) {
            props.onFollowToggle(props.post.user_id);
            // Update local state to reflect change immediately
            setFollow(!followed);
        }
    }

    // Update followed state when props change
    React.useEffect(() => {
        setFollow(props.post.user_followed);
    }, [props.post.user_followed]);

    //comment button activation
    const commentSwitch = () => {
        setCommentActive(!commentActive);
    }
    
    //like api requuest
    const likeSwitch = () => {
        fetch(route("feed.user_like", {user: props.active_user_id, post: props.post.post_id}), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": localStorage.getItem("csrf_token")
            },
            body: JSON.stringify({
                user: props.active_user_id,
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
    
    
    //comment api request
    const handleComment = () => {
        if (!userComment || userComment.trim() === "") return;
        
        fetch(route("feed.user_comment", {user: props.active_user_id, post: props.post.post_id, content: userComment}), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": localStorage.getItem("csrf_token")
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setCommentCounts(data.comments_count);
            setComments(prev => [...prev, data.comment]);
            setUserComment("");
        })
        .catch((error) => console.error("Error:", error));
    };
    
    const updateUserComment = (e) => {
        setUserComment(e.target.value);
    }
    
    //report api request
    const handleReport = () => {
        fetch(route("feed.report_post", {user: props.active_user_id, post: props.post.post_id}), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": localStorage.getItem("csrf_token")
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setReportCount(data.report_count);
            setReportedByUser(data.reported);
        })
        .catch((error) => console.error("Error:", error));
    };
    
    return(
        <div className="p-4 rounded-lg shadow-xl my-3 max-w-xl bg-[#e8fcef]">
            <div className="flex items-center">
                <div className="relative">
                    <img 
                        src="/images/Welcome/cust.jpg" 
                        alt="Profile Avatar" 
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </div>
                <span className="mx-3 text-lg text-gray-600 font-medium">{props.post.post_user}</span>
                {props.active_username != props.post.post_user &&
                <PrimaryButton onClick={followSwitch}>{followed ? "Unfollow" : "Follow"}</PrimaryButton>}
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
                        <Heart size={16} className="mr-1 text-black active:scale-125" fill={likedByUser ? "red" : "white"} onClick={likeSwitch}/>
                        <span>{likeCounts}</span>
                    </div>
                    <div className="flex items-center">
                        <MessageSquare size={16} className="mr-1 text-black active:scale-125" onClick={commentSwitch}/>
                        <span>{commentCounts}</span>
                    </div>
                    <div className="flex items-center">
                        <Flag 
                            size={16} 
                            className={`mr-1 text-black active:scale-125 cursor-pointer ${reportedByUser ? 'text-red-500' : ''}`} 
                            onClick={handleReport}
                        />
                        <span>{reportCount}</span>
                    </div>
                </div>    
                <div className="mb-3">
                    <p className="text-sm">
                    {props.post.post_description}
                    </p>
                </div>
                
                <div className="text-xs text-gray-500">
                    Posted {props.post.posted_since}
                </div>
            </div>

            {/**Comments Section */}
            {commentActive && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Comments</h3>
                            <button onClick={commentSwitch}>
                                <X className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-sm">No comments yet</p>
                            ) : (
                                comments.map((comment, index) => (
                                    <div key={index} className="mb-2">
                                        <p className="text-gray-500">{comment.commenter}</p>
                                        <p className="text-gray-700 ml-3">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-4 pt-2 border-t">
                            <textarea 
                                className="w-full p-2 border rounded-md" 
                                placeholder="Add a comment..."
                                rows="2"
                                onChange={updateUserComment}
                                value={userComment}
                            ></textarea>
                            <PrimaryButton className="my-4" onClick={handleComment}>Add Comment</PrimaryButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
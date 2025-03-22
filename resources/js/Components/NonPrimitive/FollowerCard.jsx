import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function FollowerCard(props) {
    const [limitFollowers, setLimitFollowers] = useState(false);
    

    const [followers,setFollowers]  = useState([]);
        const [i,setI] = useState(0);
        const getFollowers = ()=>{
            try{
                fetch(route('followers.retrieve',{user:props.user_id}))
                .then((response)=>response.json())
                .then((data)=>(
                    console.log(data),
                    setI((prev)=>prev + 1),
                    setFollowers(data.followers || [])
                ))
            }catch(error){
                console.error("error: ",error)
            }
        }

        
    //constantly retrieving messages every 5 secconds
        useEffect(() => {
            const interval = setInterval(() => {
               getFollowers()
               //console.log(messages)
            }, 5000);
    
            return () => clearInterval(interval); 
        }, []); 


    // Function to check scroll position and adjust follower count
    useEffect(() => {
        const handleScroll = () => {
            // Calculate how close we are to the bottom of the page
            const scrollPosition = window.scrollY + window.innerHeight;
            const footerPosition = document.querySelector('footer')?.offsetTop || 10000;
            const distanceToFooter = footerPosition - scrollPosition;
            
            // If we're approaching the footer, limit followers
            if (distanceToFooter < 250) {
                setLimitFollowers(true);
            } else {
                setLimitFollowers(false);
            }
        };
        
        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
        
        // Initial check
        handleScroll();
        
        // Clean up
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <div className={`div3 ${!props.active?"hidden":"block inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"} md:block fixed md:top-[25rem] md:right-0 px-6 md:w-1/2`}>
            <div className={`bg-[#e8fcef] w-full rounded-md shadow-xl flex flex-col p-4 mb-4 ${!limitFollowers?"h-[25em]":""} overflow-y-auto`}>
                <button onClick={props.toggle} className={`${!props.active?"hidden":"block"}`}>
                        <X className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
                </button> 
                <p className="font-bold text-center mb-4">Followers</p>
                {followers.length==0 &&
                <p>{i==0?"Loading Followers...":"There are no followers..."}</p>}
                {
                    followers.length>0 &&
                    <>
                    {/* Always show the first follower */}
                        <div className="message-item flex items-center mb-3">
                        <div className="relative mr-3">
                            <img 
                                src="/images/Welcome/cust.jpg" 
                                alt="Profile Avatar" 
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        </div>
                            <div className="flex-1">
                                <p className="font-semibold">{followers[0].follower}</p>
                            </div>
                            <p className="text-sm">{followers[0].followed_from}</p>
                        </div>
                        {/* Conditionally show these followers based on scroll position */}
                        {(!limitFollowers && followers.length>1) && (
                            <>
                                {
                                    followers.slice(1).map((follower)=>(
                                        <div className="message-item flex items-center mb-3">
                                            <div className="relative mr-3">
                                                <img 
                                                    src="/images/Welcome/cust.jpg" 
                                                    alt="Profile Avatar" 
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">{follower.follower}</p>
                                            </div>
                                            <p className="text-sm">{follower.followed_from}</p>
                                        </div>
                                    ))
                                }
                            </>
                        )}
                    </>
                }
            </div>
        </div>
    );
}
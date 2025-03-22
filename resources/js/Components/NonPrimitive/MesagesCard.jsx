import { X } from "lucide-react";
import React, { use, useEffect, useState } from "react";

export default function MessagesCard(props){

    const [messages,setMessages]  = useState([]);
    
    const [i,setI] = useState(0);
    const getMessages = ()=>{
        try{
            fetch(route('message.retrieve',{user:props.user_id}))
            .then((response)=>response.json())
            .then((data)=>(
                console.log(data),
                setI((prev)=>prev +1 ),
                setMessages(data.messages || [])
            ))
        }catch(error){
            console.error("error: ",error)
        }
    }

    //constantly retrieving messages every 5 secconds
    useEffect(() => {
        const interval = setInterval(() => {
           getMessages()
           //console.log(messages)
        }, 5000);

        return () => clearInterval(interval); 
    }, []); 
    return(
        <div className={`div2 ${!props.active?"hidden":"block inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"} md:block fixed md:top-20 md:right-0 px-6 md:w-1/2`}>
            <div className="bg-[#e8fcef] w-full rounded-sm shadow-xl flex flex-col mb-4 h-[19em] overflow-y-auto px-10 pt-4">
                <button onClick={props.toggle} className={`${!props.active?"hidden":"block"}`}>
                    <X className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
                </button> 
                <p className="font-bold text-center mb-4"> Recieved Messages </p>
                {messages.length==0 &&
                <p className="py-14">{i==0?"loading messages..":"There are no messages..."}</p>}
                {
                    messages.length>0 &&
                    messages.map((message,index)=>(
                        <div className="message-item flex items-center mb-3" key={index}>
                            <div className="flex-1">
                                <li><p className="font-semibold">{message.sender}</p></li>
                                <p className="text-sm">Recieved {message.sent_from}</p>
                            </div>
                            <button className="text-sm text-green-700">View Message</button>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
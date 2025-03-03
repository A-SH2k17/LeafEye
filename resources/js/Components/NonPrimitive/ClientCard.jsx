import React from "react";

export default function ClientCard(props){
    return(
        <div className='sm:w-[25vh] md:w-[50vh] h-[350px] bg-[#BFE1D6] m-5 rounded-2xl p-4 shadow-lg
                    '>
                        {/**This is the Profile and the Title */}
                        <div className='flex items-center'>
                            <img src="images/Welcome/cust.jpg" className='w-32 h-32 object-cover rounded-full' />
                            
                        </div>
                        <h1 className='md:ml-4 sm:ml-3 text-xl sm:text-sm'>{props.name}</h1>  
                        {/**This is for the comment */}
                        <p className='mt-4'>
                            {props.comment}
                        </p>
        </div>
    )
}
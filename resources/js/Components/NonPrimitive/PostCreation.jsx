import React from "react";

export default function PostCreation(){
    return(
        <div className="bg-green-50 p-4 rounded-lg max-w-2xl mx-auto my-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="relative">
              <img 
                src="/api/placeholder/64/64" 
                alt="Profile Avatar" 
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-200"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-200 rounded-full w-6 h-6 flex items-center justify-center">
                <div className="bg-amber-100 rounded-full w-5 h-5"></div>
              </div>
            </div>
            <span className="ml-3 text-xl text-gray-600 font-medium">UserName</span>
          </div>
          
          <div className="mb-4">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What Are You Planting Today...."
              className="w-full p-2 text-2xl font-bold focus:outline-none resize-none"
              rows={2}
            />
          </div>
          
          <div className="flex justify-end items-center gap-2">
            <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            
            <button 
              onClick={handlePostSubmit}
              className="bg-green-700 text-white font-medium px-6 py-2 rounded-md hover:bg-green-800 transition-colors"
            >
              POST
            </button>
          </div>
        </div>
      </div>
    )
}
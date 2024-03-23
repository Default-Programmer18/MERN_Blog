import React, { useEffect, useState } from 'react'
import moment from 'moment'

const Comment = ({comment}) => {
    //get users info of the comment
    const [user,setUser]=useState({})
   
    useEffect(() => {
        const getUsers=async()=>{
            try{
                const res=await fetch(`/api/user/getUser/${comment.userId}`)
                const data=await res.json()
                if(!res.ok)
                {
                    console.log(data.message)
                }
                else{
                    setUser(data)
                    console.log(data.message)
                    
                }

          }
          catch(error){
            console.log(error.message)
            
          }  
        }
        getUsers();
    },[comment]);


  return (
    <div className='flex gap-2 mt-5  pb-4 border-b dark:border-gray-600'>
    <img src={user.profilePicture} className='rounded-full h-10 w-10 object-cover '></img>
    <div className=' flex flex-col gap-2 text-xs'>
    <div className='flex gap-1'>
    <p className='font-bold truncate'>{user? `@${user.username}`:"anonymous user"}</p>
    {/* //fromNow() comes from mooment (npm i moment) */}
    <span className='text-gray-400'>{moment(comment.createdAt).fromNow()}</span>
    </div>
        <p className='text-gray-500 mb-2'>{comment.content}</p>
    </div>

    </div>
  )
}

export default Comment
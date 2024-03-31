import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike ,onEdit}) => {
  //get users info of the comment
  const { currentUser } = useSelector((state) => state.user);

  const [user, setUser] = useState({});
   const [isEditing, setIsEditing] = useState(false);
   const[editedContent,setEditedContent]=useState(comment.content)



  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`/api/user/getUser/${comment.userId}`);
        const data = await res.json();
        if (!res.ok) {
        } else {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUsers();
  }, [comment]);
  console.log("0-------------------------");
  // console.log(comment.createdAt)

 const handleEdit=async()=>{
  setIsEditing(true)
  setEditedContent(comment.content)
 }

 const handleSave=async()=>{
  try {
    const res= await fetch(`/api/comment/editComment/${comment._id}`,{
      method:"PUT",
      headers:{
        'content-Type': "application/json"
      },
      body:JSON.stringify({
        content:editedContent
      })
    })
    if(res.ok) {
      onEdit(comment,editedContent)
      setIsEditing(false)
    }
}
  catch(error)
  {
    console.log(error)
  }
 }

  return (
    <div className="flex gap-2 mt-5  pb-4 border-b dark:border-gray-600">
      <img
        src={user.profilePicture}
        className="rounded-full h-10 w-10 object-cover "
      ></img>
      <div className=" flex flex-col gap-2 text-xs">
        <div className="flex gap-1">
          <p className="font-bold truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </p>
          {/* //fromNow() comes from mooment (npm i moment) */}
          <span className="ml-2 text-gray-400">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
<div>
{isEditing ? (
  <div className="w-full"><Textarea
              className='mb-2 min-w-[500px]'
              rows={3}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
           <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
               gradientDuoTone="purpleToBlue" 
               onClick={()=>{ handleSave() }}
                >Save</Button>
              <Button color="failure" type='button'
                size='sm' onClick={()=>{
                 setEditedContent(comment.content)
                setIsEditing(false)
               
              }}>Cancel</Button>
            </div>
            </div>
            ):


      ( <>
      <p className="text-gray-500 mb-2 ">{comment.content}</p>
           
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              <button
                type='button'
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  '!text-blue-500'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    ' ' +
                    (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {
                currentUser && currentUser._id === comment.userId && 
                (<button
                  type='button'
                onClick={() =>handleEdit()}
                className="text-gray-400 hover:text-blue-500">
                Edit
                </button>)
              }
     

        </div>
        </>  
        
        )}
        </div>
      </div>
    </div>
  );
};

export default Comment;

import { Alert, Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import { Link } from 'react-router-dom';
import noBlog from "../assets/noBlog.jpg"
import { BsFillExclamationOctagonFill } from 'react-icons/bs';
const DashPosts = () => {

  const {currentUser}=useSelector(state=>state.user);
  const [userPosts,setUserPosts] = useState([])
  const [showMore,setShowMore]=useState(true);
  const [showModal,setShowModal] = useState(false);
  const [postIdToDelete,setPostIdToDelete] = useState(null);
  const [showError,setShowError] = useState(null);
  const [showSuccess,setShowSuccess] = useState(null);
 
 
  
 useEffect(() => {
  
  const fetchPosts = async () => {

    try {
      const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
      const data = await res.json();
      
      if (res.ok) {
        setUserPosts(data.posts);
        if(data.posts.length<9)
        {
              setShowMore(false)
        }
       
        }
      }
    catch (error) {
      console.log(error.message);
    }
  };
  if (currentUser.isAdmin) {
    fetchPosts();
  }
}, [currentUser._id]);

const handleShowMore=async()=>{
  try {

    const startIndex=userPosts.length;
    const res=await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`)
   
    const data=await res.json();
    if(res.ok)
    {
      setUserPosts((prev)=>[...prev,...data.posts])
      if(data.posts.length <9)
        setShowMore(false)
    }
    
  } 
  catch (error) {
    console.log(error.message);
  }
}

const handleDeletePost=async()=>{
  setShowModal(false)
  try{
    const res=await fetch(`/api/post/deletePost/${postIdToDelete}/${currentUser._id}`,{
      method:"DELETE"
    })
    const data=await res.json();
    if(!res.ok)
    {
      console.log(data)
      setShowError(data.message)
     
    }
    else
    {
      setUserPosts((prev)=>prev.filter((post)=>post._id!==postIdToDelete))
      setShowSuccess(data)
     

    }

  }
  catch(error)
  {console.log(error.message);

  }
}

useEffect(() => {
  let timeoutId;

  if (showSuccess) {
    timeoutId = setTimeout(() => {
      setShowSuccess(null);
    }, 6000);
  } else if (showError) {
    timeoutId = setTimeout(() => {
      setShowError(null);
    }, 6000);
  }

  // Clean up the timeout
  return () => {
    clearTimeout(timeoutId);
  };
}, [showSuccess, showError]);



  return (
    <div className='w-full h-full ' >
    {
      currentUser.isAdmin && userPosts.length>0? (
        <div className='min-h-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
      <Table hoverable  className="shadow-md m-6"  striped>
      
      <Table.Head >
        <Table.HeadCell>Date Updated</Table.HeadCell>
        <Table.HeadCell>Post Image</Table.HeadCell>
        <Table.HeadCell>Post Title</Table.HeadCell>
        <Table.HeadCell>Category</Table.HeadCell>
        <Table.HeadCell>Delete</Table.HeadCell>
        <Table.HeadCell>Edit</Table.HeadCell>

      </Table.Head>
      <Table.Body className='divide-y'>
     { userPosts.map((post)=>(

      
        <Table.Row  className='bg-white  dark:border-gray-700 dark:bg-gray-800'>
          <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
          <Table.Cell>
          <Link to={`post/${post.slug}`} as="div">
            <img src={post.image} alt={post.title} className='object-cover  w-20 h-10 bg-gray-500' />
            </Link>
          </Table.Cell>
          <Table.Cell><Link to={`post/${post.slug}`} as="div" className='font-medium text-gray-900 dark:text-white'>{post.title}</Link></Table.Cell>
          <Table.Cell>{post.category}</Table.Cell>
          <Table.Cell>
        <span   className='text-red-600 hover:underline font-semibold cursor-pointer' 
        onClick={()=>{
          setShowModal(true)
          setPostIdToDelete(post._id)
        }}>
        Delete</span>
          </Table.Cell>
          <Table.Cell>
          <Link to={`/update-post/${post._id}`} as="div" className='text-teal-500  hover:underline font-semibold cursor-pointer'>
          Edit
          </Link>
          </Table.Cell>
        </Table.Row>
     
      ))} </Table.Body>
      

      </Table>  
       
      {showMore &&
    <button className="text-teal-400 hover:text-teal-600 self-center w-full font-semibold p-4" onClick={handleShowMore}>
     Show More</button>}
     {showSuccess && <Alert color="success">{showSuccess}</Alert>}
     {showError && <Alert color="failure">{showError}</Alert>}   
     
     
     </div>)

      :
      (
       
        <div className="flex flex-col justify-center items-center my-20 flex-1 ">
 
 <img src={noBlog} className='w-[32%] h-[32%]'></img> 
         <h1 className='font-semibold text-2xl'>You have no post yet... </h1>
        <h2 className='mt-6  font-bold  text-teal-500 '>Tech up your voice!!!</h2>
        
        <Link to={"/create-post"} as="div">
      <Button  gradientDuoTone="purpleToBlue"className='mt-3 ' >Create a post</Button>
      </Link> 
        
      </div>
        
      )
    } 
    <Modal dismissible popup show={showModal} onClose={()=>setShowModal(false)}>
        <Modal.Header/>
           <Modal.Body >
           <div className='text-center font-semibold'>
           <BsFillExclamationOctagonFill className='text-red-600 mx-auto text-6xl mb-5'/>
            <h3 className='text-gray-500 dark:text-gray-400' >Are you sure you want to delete the Post?</h3>
           </div>
           <div className='flex justify-center gap-5 mt-6'>
            <Button color="failure" onClick={handleDeletePost}>Yes,I'm sure</Button>
            <Button  color="gray" onClick={()=>setShowModal(false)}>No,cancel</Button>
           </div>
           </Modal.Body>

      </Modal>

   
    </div>
  )
}

export default DashPosts

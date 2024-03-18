import { Button, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import { Link } from 'react-router-dom';
const DashPosts = () => {
 
  const {currentUser}=useSelector(state=>state.user);
  const [userPosts,setUserPosts] = useState([])
 console.log(userPosts)
 
  
 useEffect(() => {
  
  const fetchPosts = async () => {

    try {
      const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
      const data = await res.json();
      
      if (res.ok) {
        setUserPosts(data.posts);
       
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


  return (
    <div  className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
    {
      currentUser.isAdmin && userPosts.length>0? (<>
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
        <span   className='text-red-600 hover:underline font-semibold cursor-pointer'>Delete</span>
          </Table.Cell>
          <Table.Cell>
          <Link to={`/update-post/${post._id}`} as="div" className='text-teal-500  hover:underline font-semibold cursor-pointer'>
          Edit
          </Link>
          </Table.Cell>
        </Table.Row>
     
      ))} </Table.Body>
      

      </Table>      </>)

      :
      (
        <div className="mx-auto">
        <h2>You have no post yet... </h2>
        <h3 className='mt-3'>Tech up your voice - debut your first post now!"</h3>
        
        <Link to={"/create-post"} as="div">
      <Button  gradientDuoTone="purpleToBlue"className='mt-3 w-full' >Create a post</Button>
      </Link>
        
      </div>
        
      )
    } 
    </div>
  )
}

export default DashPosts

import { Alert, Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import { Link } from 'react-router-dom';
import noUser from "../assets/noUser.jpg"
import { BsFillExclamationOctagonFill } from 'react-icons/bs';
import {FaCheck,FaTimes} from 'react-icons/fa';
const DashUsers = () => {

  const {currentUser}=useSelector(state=>state.user);
  const [users,setUsers] = useState([])
  const [showMore,setShowMore]=useState(true);
  const [showModal,setShowModal] = useState(false);
  const [userIdToDelete,setUserIdToDelete] = useState(null)
 
  const [showError,setShowError] = useState(null);
  const [showSuccess,setShowSuccess] = useState(null);
 
 
  
 useEffect(() => {
  
  const fetchUsers = async () => {

    try {
      const res = await fetch(`/api/user/getUsers`);
      const data = await res.json();
      
      if (res.ok) {
        setUsers(data.users);
        if(data.users.length<9)
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
    fetchUsers();
  }
}, [currentUser._id]);

const handleShowMore=async()=>{
  try {

    const startIndex=users.length;
    const res=await fetch(`/api/user/getUsers?startIndex=${startIndex}`)
   
    const data=await res.json();
    if(res.ok)
    {
      setUsers((prev)=>[...prev,...data.users])
      if(data.users.length <9)
        setShowMore(false)
    }
    
  } 
  catch (error) {
    console.log(error.message);
  }
}

const handleDeleteUser=async()=>{
  setShowModal(false)
  try{
    console.log(userIdToDelete)
    const res=await fetch(`/api/user/delete/${userIdToDelete}`,{
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
      setUsers((prev)=>prev.filter((user)=>user._id!==userIdToDelete))
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
      currentUser.isAdmin && users.length>0 ?(
        <div className='min-h-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
      <Table hoverable  className="shadow-md m-6"  striped>
      
      <Table.Head >
        <Table.HeadCell>Date Created</Table.HeadCell>
        <Table.HeadCell>User Image</Table.HeadCell>
        <Table.HeadCell>Username</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>

        <Table.HeadCell>Admin</Table.HeadCell>
        <Table.HeadCell>Delete</Table.HeadCell>
        
      </Table.Head>
      <Table.Body className='divide-y'>
     { users.map((user)=>(

      
        <Table.Row  className='bg-white  dark:border-gray-700 dark:bg-gray-800' key={user._id}>
          <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
          <Table.Cell>
          
            <img src={user.profilePicture} alt={user.username} className='  w-12 h-12 rounded-full bg-gray-500 object-cover' />
            
          </Table.Cell>
          <Table.Cell >{user.username}</Table.Cell>
          <Table.Cell>{user.email}</Table.Cell>
          <Table.Cell>{user.isAdmin?(<FaCheck className='text-lime-500 text-xl'/>):(<FaTimes className='text-red-500 text-xl'/>)}</Table.Cell>
          <Table.Cell>
        <span   className='text-red-600 hover:underline font-semibold cursor-pointer' 
        onClick={()=>{
          setShowModal(true)
          setUserIdToDelete(user._id)
        }}>
        Delete</span>
          </Table.Cell>
          
        </Table.Row>
     
      ))} </Table.Body>
      

      </Table>  
       
      {showMore &&
    <button className="text-teal-400 hover:text-teal-600 self-center w-full font-semibold p-4" onClick={handleShowMore}>
     Show More</button>}
     {showSuccess && <Alert color="success">{showSuccess}</Alert>}
     {showError && <Alert color="failure">{showError}</Alert>}   
     
    
     </div>):
     ( 
        <div className="flex flex-col justify-center items-center my-20 flex-1 ">
 
         <img src={noUser} className='w-[25%] h-[25%]'></img> 
         <h1 className='font-semibold text-2xl'>You have no users yet... </h1>
       
        
      </div>
        
      )
    } 
        <Modal dismissible popup show={showModal} onClose={()=>setShowModal(false)}>
        <Modal.Header/>
           <Modal.Body >
           <div className='text-center font-semibold'>
           <BsFillExclamationOctagonFill className='text-red-600 mx-auto text-6xl mb-5'/>
            <h3 className='text-gray-500 dark:text-gray-400' >Are you sure you want to delete the User?</h3>
           </div>
           <div className='flex justify-center gap-5 mt-6'>
            <Button color="failure" onClick={handleDeleteUser}>Yes,I'm sure</Button>
            <Button  color="gray" onClick={()=>setShowModal(false)}>No,cancel</Button>
           </div></Modal.Body>

      </Modal>
       
    
    </div>
    
)}

export default DashUsers

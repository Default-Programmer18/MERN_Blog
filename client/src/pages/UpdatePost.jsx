import React, { useEffect, useState } from 'react'
import {Alert, Button, FileInput, Select, TextInput} from "flowbite-react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
getStorage, ref,
uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';




const CreatePost = () => {
  const[file,setFile]=useState(null);
  const [imageUploadProgress,setImageUploadProgress]=useState(null)
  const[imageUploadError,setImageUploadError]=useState(null)
  const [imageUrl,setImageUrl]=useState(null)
  const [formData,setFormData]=useState({})
  const [publishError,setPublishError]=useState(null)
const navigate=useNavigate()
const {postId}=useParams()
const {currentUser}=useSelector((state)=>state.user)
console.log(postId)

useEffect(() => {
  const clearError = () => {
    setPublishError(null);
    setImageUploadError(null);
  };

  const publishErrorTimeout = setTimeout(clearError, 6000);

  return () => {
    clearTimeout(publishErrorTimeout);
  };
}, [publishError, imageUploadError]);
 


    
  const handleUploadImage=async()=>{
    if(!file)
    {
      setImageUploadError("Please choose an image to upload...")
      return;
    }
   
    const storage = getStorage(app);
    const fileName = new Date().getTime()+"-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
    try{
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setImageUploadProgress(progress.toFixed(0));
          setImageUploadError(null)
        //console.log("progress",progress)
      },
      (error) => {
        setImageUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
          //console.log("error",error)
          setImageUploadProgress(null)
          
        
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null)
          setImageUploadError(null)
          setImageUrl(downloadURL)
          setFormData({...formData,image:downloadURL})
          
        
        });
      }
    );
    }
    catch(error)
    {
      setImageUploadProgress(null)
      setImageUploadError("Image upload failed...")
      console.log(error)

    }}
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`/api/post/updatePost/${postId}/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data=await res.json()
        if(!res.ok)
        {
            setPublishError(data.message)
            return;
        }
        else
        {
          setPublishError(null);
          navigate('/post/'+data.slug)

        }
      }
      catch(error)
      {setPublishError("Something went wrong...")

      }
  }

//updatework/////////////////////
useEffect(()=>{
    const fetchPosts= async()=>{
    try{

        const res=await fetch(`/api/post/getPosts?postId=${postId}`);
        const data=await res.json()
        if(!res.ok)
        {
            setPublishError(data.message)
            return;
        }
        else
        {  
            console.log(data)
            setPublishError(null);
            setFormData(data.posts[0])
            console.log(formData)
        }
    }
    catch(error)
    {
        setPublishError(error)
    }
}
fetchPosts()

},[postId])



  return (
    <div className='max-w-3xl  min-h-screen p-3 mx-auto mt-5'>
    <h1 className='text-center font-semibold text-3xl mb-6'>
        Update Post  
    </h1>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
    <div className='flex flex-col sm:flex-row gap-4'>
        <TextInput id="Title" placeholder='Title'  type="text" className='flex-1' required
        onChange={(e)=>{
          setFormData({...formData, title: e.target.value})
        }}
        value={formData.title}></TextInput>
        <Select 
        onChange={(e)=>{
          setFormData({...formData, category: e.target.value})
        }} 
        value={formData.category} required>
          <option value="uncategorized">Select a value</option>
          <option value="javaScript">JavaScript</option>
          <option value="react.js">React js</option>

        </Select>
    </div> 
    <div className='flex flex-col sm:flex-row  justify-between items-center gap-4 border-4 border-teal-500 border-dotted p-3'>
      <FileInput type="file" accept="image/*" onChange={(e)=>{setFile(e.target.files[0])}}></FileInput>
      <Button gradientDuoTone="purpleToBlue" outline  size="sm" onClick={handleUploadImage} disabled={imageUploadProgress}>
      {imageUploadProgress? (
      <div className='w-16 h-16'>
        <CircularProgressbar  value={imageUploadProgress} text={`${imageUploadProgress|| 0}%`}
         
        />
      </div>):("Upload Image")}
      
      </Button>
    </div>
    {formData.image && 
      <img src={formData.image} alt="Uploaded Image " className='w-full h-72 object-cover'></img>}
      
    {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
    <ReactQuill theme="snow" placeholder='Write something...' className='h-72 mb-3'
    onChange={(value)=>{
          setFormData({...formData, content: value})
        }}
        value={formData.content}
        />
    <Button gradientDuoTone="purpleToPink" type="submit" className='mt-10'>Update</Button>
    </form>
    {publishError &&<Alert color="failure" className='my-3'>{publishError}</Alert>} 
    
    </div>
  )
}

export default CreatePost
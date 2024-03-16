import {Alert, Button, FileInput, Label, TextInput } from 'flowbite-react';
import { useSelector } from "react-redux"
import {useEffect, useRef, useState} from "react"
import {
  getDownloadURL,
  
  uploadBytesResumable,
} from 'firebase/storage';
import { getStorage, ref } from "firebase/storage";
import {app} from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashProfile = () => {
  const {currentUser}=useSelector((state)=>state.user)
  const[imageFile,setImageFile]=useState(null);
  const[imageFileUrl,setImageFileUrl]=useState(null);
  const filePickerRef=useRef()
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null)
  
  const [imageFileUploadError,setImageFileUploadError]=useState(null)

  const handleImageChange=(event)=>{
    const file=event.target.files[0]
    if(file)
    {
      setImageFile(file)
      //creates url in localhost
      //setImageFileUrl(URL.createObjectURL(file))
    }
    
  }

  useEffect(()=>{

    if(imageFile)
    {
      uploadFile()
    }
  },[imageFile])

  const uploadFile=async()=>{

    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read; 
    //       allow write:
    //       if
    //       request.resource.size< 2*1024 *1024 &&
    //       request.resource.contentType.matches("image/*.");
    //     }
    
    // Create a root reference

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
        console.log("progress",progress)
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than  2MB)'
        
        );  console.log("error",error)
        
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);  console.log("done")
        
        });
      }
    );
  };


   

  // console.log(imageFile)
  return (
    <div className="max-w-lg mt-5 mx-auto" >
    <div className='text-center font-semibold mb-5 text-2xl'>Profile</div>
    <form className="flex flex-col mx-6 ">
    <FileInput  type="file"  accept="image/*"  onChange={handleImageChange} ref={filePickerRef} className='hidden'></FileInput>
    <div  className="  relative w-32 h-32 cursor-pointer  mx-auto mb-3 " onClick={()=>filePickerRef.current.click()}>
    {/* overflow-hidden self-center */}
    {imageFileUploadProgress && 
    (<CircularProgressbar value={imageFileUploadProgress||0} 
    text={`${imageFileUploadProgress}%`} 
           strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
              />)}
      <img src={imageFileUrl||currentUser.profilePicture} alt="user" 
      className=" w-full h-full border-4 mb-3 border-[lightgray] rounded-full object-cover shadow-md  "
        
      />
      
      </div>
      {imageFileUploadError && 
      <Alert color="failure" className='mb-3'> {imageFileUploadError}</Alert>}
     
      <Label htmlFor="username" value="Username:" className='mb-2' />
      <TextInput id="username" placeholder='username' type="text" defaultValue={currentUser.username} className='mb-3'></TextInput>

      <Label htmlFor="email" value="Email:" className='mb-2' />
      <TextInput id="email" placeholder='email' type="email" defaultValue={currentUser.email} className='mb-3'></TextInput>
      
      <Label htmlFor="Password" value="Password:" className='mb-2' />
      <TextInput id="Password" placeholder='Password' type="password"  className='mb-3'></TextInput>

      <Button  gradientDuoTone="purpleToBlue" outline type="submit" >Update</Button>

      <div className=' flex  justify-between mt-2  text-red-500'>
        <span>Delete Profile </span>
        <span>Sign Out</span>
      </div>

      


     
    </form>
    </div>
  )
}
export default DashProfile

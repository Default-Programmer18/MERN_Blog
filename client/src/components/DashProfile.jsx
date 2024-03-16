import {Alert, Button, FileInput, Label, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from "react-redux"
import {useEffect, useRef, useState} from "react"
import {
  getDownloadURL,
  
  uploadBytesResumable,
} from 'firebase/storage';
import { getStorage, ref } from "firebase/storage";
import {app} from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure,updateStart,updateSuccess } from '../redux/user/userSlice';

const DashProfile = () => {
  const {currentUser}=useSelector((state)=>state.user)
  const dispatch=useDispatch()
  const[imageFile,setImageFile]=useState(null);
  const[imageFileUrl,setImageFileUrl]=useState(null);
  const filePickerRef=useRef()
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null)
  const [formData,setFormData]=useState({})
 
  const [imageFileUploadError,setImageFileUploadError]=useState(null)
  const [imageFileUploading,setImageFileUploading]=useState(false)
   const [updateUserSuccess,setUpdateUserSuccess]=useState(false)
   const [updateUserError,setUpdateUserError]=useState(false)
 
   const[handlePasswordAlert,setHandlePasswordAlert]= useState(false);
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   const [passwordConstraints,setPasswordConstraints] = useState({
    passLength: false,
    passAlp: false,
    passNumber: false,
    passSpecial: false,
    valid: false,
  })

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

 
 /// messsage set null after 6sfor success
  useEffect(()=>{

   setTimeout(()=>{
    setUpdateUserSuccess(false)
    setUpdateUserError(false)
   },6000)
  },[updateUserSuccess])

  ///errror messsage set null after 6s for error
  useEffect(()=>{

    setTimeout(()=>{
      setUpdateUserSuccess(false)
     setUpdateUserError(false)
    },6000)
   },[updateUserError])

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
        setImageFileUploading(true)
        //console.log("progress",progress)
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 6MB)'
        );
          //console.log("error",error)
          setImageFileUploadProgress(null)
          setImageFile(null)
          setImageFileUrl(null)
          setImageFileUploadError(null)
          setImageFileUploading(false)
        
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); 
          // console.log("done")
          setFormData({...formData,profilePicture:downloadURL})
          setImageFileUploading(false)
          setUpdateUserSuccess("Image file uploaded successfully")
        
        });
      }
    );
  };

  const passwordChecker=(passwordValue)=>{
    setPasswordConstraints({
      valid: passwordRegex.test(passwordValue),
      passLength: passwordValue.length >= 8,
      passAlp: /[A-Za-z]/.test(passwordValue),
      passNumber: /[0-9]/.test(passwordValue),
      passSpecial: /[@$!%*?&]/.test(passwordValue),
    });
    
    

  }
    const  handleOnChange=(e)=>{

      if(e.target.id==="Password")
      {
       passwordChecker(e.target.value.trim())
      
       setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
      // console.log(formData)
      }
      else
      setFormData({...formData,[e.target.id]:e.target.value})
    }


    const handleSubmit = async (e)=>{
      e.preventDefault()
     // console.log(formData)
      if(Object.keys(formData).length===0)
      {
        setUpdateUserError("No changes made.")
        return;
      }
      if(formData.hasOwnProperty('Password') && passwordConstraints.valid===false)
        {setUpdateUserError("New password does not satisfy all neccessary constraints.")
        return;
        }
        
     if(imageFileUploading) 
     {setUpdateUserError("Please wait till the image upload is completed.")
      return;
    }
        try{
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok)
     {  dispatch(updateFailure(data.message))
      setUpdateUserError(data.message)
      return;
    
    }
    else{
      dispatch(updateSuccess(data))
      setUpdateUserSuccess("User profile has been updated successfully")
      setFormData({})
    }


    }
   catch(error)
   {
    dispatch(updateFailure(error.message))
    setUpdateUserError(error.message)
    
    }
   }
  
  // console.log(imageFile)
  return (
    <div className="max-w-lg mt-5 mx-auto" >
    <div className='text-center font-semibold mb-5 text-2xl'>Profile</div>
    <form className="flex flex-col mx-6 " onSubmit={handleSubmit}>
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
      <TextInput id="username" placeholder='username' type="text" defaultValue={currentUser.username} className='mb-3' 
      onChange={handleOnChange}></TextInput>

      <Label htmlFor="email" value="Email:" className='mb-2' />
      <TextInput id="email" placeholder='email' type="email" defaultValue={currentUser.email} className='mb-3'  
      onChange={handleOnChange}></TextInput>
      
      <Label htmlFor="Password" value="Password:" className='mb-2' />
      <TextInput id="Password" placeholder='Password' type="password"  className='mb-3'  
       onFocus={()=>setHandlePasswordAlert(true)}
              onBlur={()=>setHandlePasswordAlert(false)}
      onChange={handleOnChange}></TextInput>

{handlePasswordAlert && 
           <>                     
            { passwordConstraints.passLength && <Alert className="mt-2 " color="success">At least 8 characters long.</Alert>}
            { !passwordConstraints.passLength && <Alert className="mt-2 " color="failure">At least 8 characters long.</Alert>}
            { passwordConstraints.passAlp && <Alert className="mt-2 " color="success">Contains at least one letter.</Alert>}
            { !passwordConstraints.passAlp && <Alert className="mt-2 " color="failure">Contains at least one letter.</Alert>}
            { passwordConstraints.passNumber && <Alert className="mt-2 " color="success">Contains at least one digit.</Alert>}
            { !passwordConstraints.passNumber && <Alert className="mt-2 " color="failure">Contains at least one digit.</Alert>}
            { passwordConstraints.passSpecial && <Alert className="mt-2 " color="success">Contains at least one special character (e.g., @$!%*?&).</Alert>}
            { !passwordConstraints.passSpecial && <Alert className="mt-2 " color="failure">Contains at least one special character (e.g., @$!%*?&).</Alert>}
            </>   
            
           }

      <Button  gradientDuoTone="purpleToBlue" outline type="submit" className='mt-3'>Update</Button>

      <div className=' flex  justify-between mt-2  text-red-500'>
        <span>Delete Profile </span>
        <span>Sign Out</span>
      </div>

      {updateUserSuccess && <Alert color="success" className='mt-3'>{updateUserSuccess}</Alert>}

      {updateUserError && <Alert color="failure" className='mt-3'>{updateUserError}</Alert>}
     
    </form>
    </div>
  )
}
export default DashProfile

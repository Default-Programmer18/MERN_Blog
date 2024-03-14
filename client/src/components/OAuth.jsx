import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess,signInFailure,signInStart } from '../redux/user/userSlice';
import { useState , useEffect} from 'react';


const OAuth = () => {
 const navigate=useNavigate();
 const dispatch = useDispatch();
const auth=getAuth(app);
const [serverError,setServerError]= useState(false);


  //show password code
  
  useEffect(()=>{

    setTimeout(()=>{
    setServerError(false);
    },5000)

  },[serverError])


  const handleGoogleClick = async () =>{
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    try {
        const resultsFromGoogle = await signInWithPopup(auth, provider)
       console.log(resultsFromGoogle)
       const res = await fetch("api/auth/google",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username:resultsFromGoogle.user.displayName,
          email:resultsFromGoogle.user.email,
          googlePhotoUrl:resultsFromGoogle.user.photoURL,

        }),
      })
        if(res.ok)
        {
          const data = await res.json()
          console.log(data)
          dispatch(signInSuccess(data))
          navigate("/")
        }
        else
        {
     
        setServerError(true);
        
        }
      
      
        }
    catch (error) {
        console.log(error);
    }
} 
  return (
    //type='button' to stop refresh ,if refreshed popup wont appear
    <Button type='button' gradientDuoTone="purpleToBlue" className='mt-3' onClick={()=>handleGoogleClick()}>
    <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
    Continue with Google
</Button>
  )
}

export default OAuth
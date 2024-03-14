import { Alert, Button, Label, Spinner, TextInput, Toast } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signup_img from "../assets/signup_img.jpg";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { signInFailure,signInStart,signInSuccess } from "../redux/user/userSlice";
import { useDispatch ,useSelector} from "react-redux";
import OAuth from "../components/OAuth";
import { HiExclamation} from "react-icons/hi"


const SignIn = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();

  //from glovbal state
  const {loading,error:errorMessage}=useSelector(state=>state.user)
  const [formData, setFormData] = useState({});
  const [serverError,setServerError]= useState(false);

  //show password code
  const [showPassword, setShowPassword] = useState(false);
  useEffect(()=>{
    setTimeout(()=>{
    setServerError(false);
    },5000)

  },[serverError])

  const handlechange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if( !formData.password|| !formData.email)
    {
      return dispatch(signInFailure(("All fields are required...")));
    }
    //console.log(formData);
    try{
     dispatch(signInStart)
       const res=await fetch('/api/auth/sign-in',{
          method: 'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
       });
     
       if (res.ok) {  
        
       const data= await res.json();
       if ( data.success === false) 
        {console.log(data);
         dispatch(signInFailure(data.message));}
       
       else{
         dispatch(signInSuccess(data));
         navigate('/');
       }}
       else
       {
    
       setServerError(true);
       
       }
       
    }catch(error)
    {
      
    dispatch(signInFailure(error.message))

    }
    
  };

  return (
    <div className="min-h-screen min-w-screen max-w-screen">
    {serverError && <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
          <HiExclamation className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">Internal Server Error</div>
        <Toast.Toggle />

      </Toast>}

      <div className="flex flex-row mx-auto mt-20 p-8 gap-20  max-w-5xl ">
        {/* left */}
        <div className="flex-1">
          <Link
            to="/"
            className="self-center  whitespace-nowrap font-semibold text-3xl dark:text-white rounded-md"
          >
            <span className=" px-2 py-1 bg-gradient-to-r from-blue-500   via-purple-500 to-rose-500  text-white rounded-md">
              Blog
            </span>
            space
          </Link>
          <p className="mt-7 text-sm">
            "Embark on a journey of words and wisdom with
            <span className="font-extrabold"> Blog</span>
            <span className="font-semibold">space</span> . Join our community,
            express yourself, and explore a world of diverse perspectives. Sign
            up now to start sharing!"
          </p>

          <form onSubmit={handleSubmit} >
            
            <Label htmlFor="email" className="mt-2">
              Email:
            </Label>
            
            <TextInput
              id="email"
              placeholder="name@company.com"
              type="email"
              className="mt-2"
              onChange={handlechange}
              required
            ></TextInput>


            <Label className="mt-2" htmlFor="password">
              Password:
            </Label>
            
            <div className="flex flex-col relative ">
            <TextInput
              id="password"
              placeholder="Password"
              type={showPassword?"text":"password"}
              className="mt-2"
              onChange={handlechange}
             
              required
            ></TextInput>
            <button onClick={()=>{setShowPassword(!showPassword)}}  className="absolute right-5 top-[40%] text-xl">
              {showPassword?<FiEye />:<FiEyeOff color="#9CA3AF"/>}
            </button>
            </div>

            <Button
              gradientDuoTone="purpleToBlue"
              outline
              className="mt-4"
              type="submit"
              disabled={loading}
            >
            {
              loading?
              (<>
              <Spinner size="sm"/><span className="pl-3">Loading...</span>
              </>)
              :(
               "Sign In"
              )}
            
            </Button>

          </form>

          <OAuth></OAuth>

          <div className="flex flex-row text-sm mt-1">
            <span>New User?</span>
            <Link to="/sign-up" className="text-sky-500 ml-1">
              Sign up
            </Link>
          </div>
          {errorMessage && <Alert className="mt-4 " color="failure"> {errorMessage}</Alert>}

        </div>
        {/* right */}
        <div className="flex-1 md:inline hidden   ">
          <img
            src={signup_img}
            className=" min-w-[140%] max-w-[140%] min-h-[100%] shadow-2xl  shadow-blue-900/50 "
          ></img>
        </div>
      </div>
    </div>
  );
};



export default SignIn
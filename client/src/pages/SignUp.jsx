import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signup_img from "../assets/signup_img.jpg";
import { FiEye, FiEyeOff } from 'react-icons/fi';

const SignUp = () => {
  const navigate=useNavigate();

  const [formData, setFormData] = useState({});
  const [confirmPasswordInput,setConfirmPasswordInput] = useState(null)
  const[loading,setLoading] = useState(false);
  const[handlePasswordAlert,setHandlePasswordAlert]= useState(false);
  const [errorMessage,setErrorMessage] = useState(null);
  
  
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [passwordConstraints,setPasswordConstraints] = useState({
    passLength: false,
    passAlp: false,
    passNumber: false,
    passSpecial: false,
    valid: false,
  })
  //show password code
  const [showPassword, setShowPassword] = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword] = useState(false);


 
const handleConfirmPass=(e)=>{
  setConfirmPasswordInput(e.target.value)
}
  const handlechange = (e) => {
    if (e.target.id === "password") {
      const passwordValue = e.target.value.trim();
  
      setPasswordConstraints({
        valid: passwordRegex.test(passwordValue),
        passLength: passwordValue.length >= 8,
        passAlp: /[A-Za-z]/.test(passwordValue),
        passNumber: /[0-9]/.test(passwordValue),
        passSpecial: /[@$!%*?&]/.test(passwordValue),
      });
  
     
        setFormData({ ...formData, [e.target.id]: passwordValue });
      
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!formData.username || !formData.password|| !confirmPasswordInput || !formData.email)
    {
      return setErrorMessage("All fields are required...");
    }
    
   
    if(!passwordConstraints.valid)
    {
      return setErrorMessage("Password does not meet the required criteria...");
    }
    if( formData.password !== confirmPasswordInput )
    return setErrorMessage("Passwords do not match...");

    //console.log(formData);
    try{
      setLoading(true);
      setErrorMessage(null)
       const res=await fetch('/api/auth/sign-up',{
          method: 'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
       });

     const data= await res.json()
     // console.log(data)
     
      if(data.success==false)
      return setErrorMessage(data.message)
       
      setLoading(false);
      if(res.ok)
      navigate("/sign-in")
       
    }catch(error)
    {
      setErrorMessage(error.message)
      setLoading(false)

    }
    
  };

  return (
    <div className="min-h-screen min-w-screen max-w-screen">
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
            
            <Label htmlFor="username" className="mt-2">
              Username:
            </Label>
            
            <TextInput
              id="username"
              placeholder="Username"
              type="text"
              className="mt-2"
              onChange={handlechange}
              required
            ></TextInput> 
           

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
              onFocus={()=>setHandlePasswordAlert(true)}
              onBlur={()=>setHandlePasswordAlert(false)}
              required
            ></TextInput>
            <button onClick={()=>{setShowPassword(!showPassword)}}  className="absolute right-5 top-[40%] text-xl">
              {showPassword?<FiEye />:<FiEyeOff color="#9CA3AF"/>}
            </button>
            </div>

           
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




            <Label className="mt-2" htmlFor="confirmPassword">
              Confirm Password:
            </Label>
            <div className="relative">
            <TextInput
              id="confirmPassword"
              placeholder="Confirm Password"
              type={showConfirmPassword?"text":"password"}
              className="mt-2"
              onChange={handleConfirmPass}
              required
            ></TextInput>
            <button onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}} className="absolute right-5 top-[25%] text-xl">
              {showConfirmPassword?<FiEye/>:<FiEyeOff color="#9CA3AF"/>}
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
               "Sign Up"
              )}
            
            </Button>

          </form>

          <Button gradientDuoTone="purpleToBlue" className="mt-4">
            Continue with Google
          </Button>

          <div className="flex flex-row text-sm">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-sky-500">
              Sign in
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

export default SignUp;

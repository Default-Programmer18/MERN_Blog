import {Button, Label, TextInput } from 'flowbite-react';
import { useSelector } from "react-redux"

const DashProfile = () => {
  const {currentUser}=useSelector((state)=>state.user)
  return (
    <div className="max-w-lg mt-5 mx-auto" >
    <div className='text-center font-semibold mb-5 text-2xl'>Profile</div>
    <form className="flex flex-col ">

    <div  className=" flex w-32 h-32 cursor-pointer  mx-auto ">
    {/* overflow-hidden self-center */}
      <img src={currentUser.profilePicture} alt="user" 
      className=" w-full h-full border-4 mb-3 border-[lightgray] rounded-full object-cover shadow-md  "/>
      </div>
     
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

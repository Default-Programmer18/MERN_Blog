import React from 'react'
import {Button, Navbar, TextInput} from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from "react-icons/ai";
import {FaMoon} from "react-icons/fa";

const Header = () => {
  const path=useLocation().pathname;
  return (
    <Navbar className='border-b-2'>
        <Link to="/" className="self-center  whitespace-nowrap font-semibold text-sm sm:text-xl dark:text-white rounded-md">
            <span className=' px-2 py-1 bg-gradient-to-r from-blue-500   via-purple-500 to-rose-500  text-white rounded-md'> Let's Blog</span>
        </Link>
        <form>
        <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
             className='hidden lg:inline'
        />
       
        </form>
        <Button className='w-10 h-10 lg:hidden ' color="gray" pill><AiOutlineSearch/></Button>
       
        <div className='flex gap-2 md:order-2'> 
            <Button className='w-12 h-10  hidden sm:inline   ' color="gray" pill><FaMoon/></Button>
            <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>Sign In</Button>
            </Link>
            <Navbar.Toggle/> 
        </div>
        <Navbar.Collapse >
          <Navbar.Link active={path==="/"} as={"div"} >
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path==="/about"} as={"div"}>
            <Link to="/about" >About</Link>
          </Navbar.Link>
          {/* //nav.link creates an anchor tag ,link to also creates the same,anchor nesting not supported ,so shows problem ,use as={"div"}*/}
          <Navbar.Link>
            <Link to="/blog" active={path==="/blog"} as={"div"}>Blog</Link>
          </Navbar.Link>
        </Navbar.Collapse>

        
        
    
    
    
    </Navbar>

  )
}

export default Header
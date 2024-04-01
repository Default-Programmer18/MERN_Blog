import React, { useEffect, useState } from 'react'
import {Avatar, Button, Dropdown, Navbar, TextInput} from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from "react-icons/ai";
import {FaMoon,FaSun} from "react-icons/fa";
import { useSelector ,useDispatch} from 'react-redux';
import { toggleTheme} from "../redux/theme/themeSlice.js"
const Header = () => {
  // const {toogleTheme}=useSelector(state=>state.theme)
  const path=useLocation().pathname;
  const navigate=useNavigate()
  const {currentUser}=useSelector(state=>state.user)
  const { theme } = useSelector((state) => state.theme);
  const dispatch=useDispatch()

const[searchTerm,setSearchTerm]=useState("")
useEffect(()=>{
  const urlParams=new URLSearchParams(location.search)
  
  const searchTermFromUrl=urlParams.get('searchTerm')
  // console.log("searchTermFromUrl")
  // console.log(searchTermFromUrl)
  if(searchTermFromUrl)
    setSearchTerm(searchTermFromUrl)
},[location.search])


const handleSubmit=(e)=>{
  e.preventDefault()
  const urlParams=new URLSearchParams(location.search)
  urlParams.set('searchTerm',searchTerm)
  const searchQuery=urlParams.toString()
  navigate(`/search?${searchQuery}`)

  }


  return (
    <Navbar className='border-b-2'>
        <Link to="/" className="self-center  whitespace-nowrap font-semibold text-sm sm:text-xl dark:text-white rounded-md">
            <span className=' px-2 py-1 bg-gradient-to-r from-blue-500   via-purple-500 to-rose-500  text-white rounded-md'> Blog</span>space
        </Link>
        <form onSubmit={handleSubmit}>
        <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
             className='hidden lg:inline'
             value={searchTerm}
             onChange={(e)=>{setSearchTerm(e.target.value)}}
        />
       
        </form>
        <Button className='w-10 h-10 lg:hidden ' color="gray" pill><AiOutlineSearch/></Button>
       
        <div className='flex gap-2 md:order-2'> 
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={()=>dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser?(<Dropdown
            arrowIcon={false} 
            inline
            label={
              <Avatar
              img={currentUser.profilePicture}
              alt='user' rounded></Avatar>
            } >
              <Dropdown.Header>
                <span className='text-sm  block '>@{currentUser.username}</span>
                <span className='text-sm block truncate font-semibold'>{currentUser.email}</span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}><Dropdown.Item>Profile</Dropdown.Item></Link>
              <Dropdown.Divider/>
              <Dropdown.Item>Sign out</Dropdown.Item>
            </Dropdown>

            ):( <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>Sign In</Button>
            </Link>)
            }
            
           
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
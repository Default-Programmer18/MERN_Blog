import React from 'react'
import {Footer} from "flowbite-react"

const FooterCompnent = () => {
  return (
    <Footer container className='border border-t-4 border-teal-500'>
<div className='grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1'>
        <div>
        <Link to="/" className="self-center  whitespace-nowrap font-semibold text-sm sm:text-xl dark:text-white rounded-md">
            <span className=' px-2 py-1 bg-gradient-to-r from-blue-500   via-purple-500 to-rose-500  text-white rounded-md'> Blog</span>space
        </Link>
        </div>
        <div>

        </div>
        </div>
    </Footer>

  )
}

export default FooterCompnent 
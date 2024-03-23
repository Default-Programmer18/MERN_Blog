import { Button, Spinner } from 'flowbite-react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentSection from '../components/CommentSection'

const PostPage = () => {
 
    const{postSlug}=useParams()
    const[loading,setLoading]=useState(true);
    const [error,setError]=useState(null)
    const [post,setPost]=useState(null)
    console.log(post)

 
 useEffect(()=>{
   
    const fetchPost=async()=>{
    try{
        setLoading(true)
        const res=await fetch(`/api/post/getPosts?slug=${postSlug}`)
        const data=await res.json()
        if(!res.ok)
        {
            setError(data.message)
            setLoading(false)
            return;
        }
        else
        {
            setLoading(false)
            setPost(data.posts[0])
            setError(null)

        }
 
    }
    catch(error){
        console.log(error)
        setError(error)
        setLoading(false)
    }
}
    fetchPost()
 },[postSlug])

 if(loading)
 {
    return(
        <div className='flex justify-center items-center min-h-screen'>
            <Spinner size="xl"/>
        </div>
    )
 }

  return (
    <main className='flex flex-col min-h-screen max-w-7xl mx-auto p-3   '>
        <h1 className='text-center text-3xl  lg:text-4xl p-3 mt-10 font-serif mx-auto max-w-2xl'>{post && post.title}</h1>
        {post && post.category && 
        <Link to={`/search?category=${post.category}`} >
        <Button color='gray' pill size='xs' className="mx-auto mt-4">
          { post.category}
        </Button>
        
        </Link>}
        <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-6 p-3 max-h-[450px]  w-full object-cover'
      />
      <div className='flex justify-between   border-b border-slate-400 mx-auto w-full max-w-[95%] text-xs italic' >
        <span>{post && new Date(post.createdAt).toLocaleDateString()} </span>
        <span> {post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{__html:post && post.content}}>


        </div>

        <CommentSection postId={post._id}/>
        
    </main>

   
  )
}

export default PostPage
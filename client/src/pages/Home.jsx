import React, { useEffect, useState } from "react";
import noBlog from "../assets/noBlog.jpg"
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
       
        toast.error(error.message);
      }
    };
    fetchPosts();
  
  }, []);

  return (
    <div className="">
      <div className="mt-8 flex flex-col gap-5 lg:px-28 p-5 mx-6">
        <h1 className="text-4xl  lg:text-5xl font-semibold ">
          Welcome to{" "}
          <div className="sm:mt-0 mt-5 mb-3 sm:inline-block  text-3xl  lg:text-5xl">
            <span
              className=" bg-gradient-to-r from-blue-500  
           via-purple-500 to-rose-500 text-white   px-2 py-1 rounded-md"
            >
              Blog
            </span>
            <span className="text-gray-600">space</span>
          </div>
        </h1>
        <p className="text-gray-500 text-sm">
          BlogSpace: Your tech oasis. Your go-to destination for diverse,
           captivating content. Explore tech, lifestyle, travel, and more. Share your voice, 
           connect with fellow enthusiasts, 
          and dive into engaging discussions. Join us and be part of a vibrant blogging community today!
        </p>

        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7 ">
        {posts && posts.length > 0 ?(
          <div className="w-full">
            <h2 className="font-semibold text-2xl text-center">Recent Posts</h2>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 ">
              {posts.map((post) => {
               
               return <PostCard key={post._id} post={post} />;
              })}
            </div>
            <div className="mt-5 text-center">
            <Link
              to={'/search'}
              className='text-lg font-bold text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
            </div>
          </div>
        ):(
        <div className="flex flex-col justify-center items-center my-20 flex-1 ">

        <h2 className="font-semibold text-2xl text-center">Recent Posts</h2>
 
 <img src={noBlog} className='w-[32%] h-[32%]'></img> 
         <h1 className='font-semibold text-2xl'>Nothing posted yet... </h1>
        <h2 className='mt-6  font-bold  text-teal-500 '>Tech up your voice!!!</h2>
       
        
      </div>)}
      </div>
    </div>
  );
};

export default Home;

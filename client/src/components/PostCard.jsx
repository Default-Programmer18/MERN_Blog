import { Button } from "flowbite-react"
import { Link } from "react-router-dom"

const PostCard = ({post}) => {
  return (
    <div className="group relative sm:w-[370px] w-full h-[340px] overflow-hidden rounded-md shadow-md border-0 hover:border-2 m-2 border-teal-400">
        <Link to={`/post/${post.slug}`} >
            <div className="p-5" >
                <img src={post.image} alt="Post Cover Image" 
                 className="h-[200px] group-hover:h-[150px]  w-full object-cover transition-all duration-300 z-20 rounded-md"></img>
            </div>
            <div className="flex flex-col gap-3 px-5 pb-2">
            <p className="text-gray-800 dark:text-gray-200 font-bold text-md line-clamp-2">
                {post.title}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs italic " >
                {post.category}
            </p>
            <Link to={`/post/${post.slug}`}>
            <Button gradientDuoTone="purpleToBlue" outline 
            className="z-10 group-hover:bottom-3  absolute bottom-[-800px] 
            left-2 right-2 transition-all duration-300 " >Read Article...</Button></Link>
            </div>
        </Link>
    </div>
  )
}

export default PostCard
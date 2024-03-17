import React from 'react'
import {Button, FileInput, Select, TextInput} from "flowbite-react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  return (
    <div className='max-w-3xl  min-h-screen p-3 mx-auto mt-5'>
    <h1 className='text-center font-semibold text-3xl mb-6'>
        Create a Post  
    </h1>
    <form className='flex flex-col gap-4'>
    <div className='flex flex-col sm:flex-row gap-4'>
        <TextInput id="Title" placeholder='Title'  type="text" className='flex-1' required></TextInput>
        <Select>
          <option value="uncategorized">Select a value</option>
          <option value="javaScript">JavaScript</option>
          <option value="react.js">React js</option>

        </Select>
    </div> 
    <div className='flex flex-col sm:flex-row  justify-between items-center gap-4 border-4 border-teal-500 border-dotted p-3'>
      <FileInput type="file" accept="image/*"></FileInput>
      <Button gradientDuoTone="purpleToBlue" size="sm">Upload Image</Button>
    </div>
    <ReactQuill theme="snow" placeholder='Write something...' className='h-72 mb-3'></ReactQuill>
    <Button gradientDuoTone="purpleToPink" type="submit">Publish</Button>
    </form>
    </div>
  )
}

export default CreatePost
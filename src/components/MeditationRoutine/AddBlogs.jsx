import axios from 'axios';
import React, { useState } from 'react';
import { Card, Snackbar, Alert, Button, Divider } from '@mui/material';
import { AiFillPlusCircle, AiOutlineClose } from 'react-icons/ai';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import "react-quill/dist/quill.bubble.css";
// import { addTailwindToText } from "../shared/index";
import api from '../../utils/api';
import { uploadToS3 } from "../../utils/uploadToS3";
import UploadComponent from '../shared/UploadComponent';

const AddBlog = ({ addBlog, onClose }) => {
    const [title, setTitle] = useState('');
    const [blogType, setBlogType] = useState('meditation-routines');
    const [text, setText] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    //upload to s3
    // const [file,setFile]=useState(null);
    const [objectUrl,setObjectUrl]=useState('');

    const [uploadInProgress, setUploadInProgress] = useState(false);

    const handleTagsChange = (event) => {
        setTags(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.authToken) {
                // Handle the case where authToken is not available (e.g., redirect or show an error message).
                return;
            }

            const authTokenUser = user.authToken;

            const newBlog={
                title,
                blogType,
                text,
                author,
                tags: tags.split(',').map((tag) => tag.trim()),
                imageUrl: objectUrl || imageUrl,
            }

            setUploadInProgress(true);

            addBlog(newBlog);

            const response = await api.post(
                '/blogs',
                newBlog,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokenUser}`,
                    },
                });

                // console.log(response);

            if (response.status === 200) {
                setSnackbarMessage('Blog added successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                onClose();
            }
        } catch (error) {
            console.error("Failed to add blog",error);
            setSnackbarMessage('Failed to add blog');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
        finally
        {
            setUploadInProgress(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleEditorChange = (content) => {
        setText(content);
    };
    
    const handleFileChange=async (files)=>
    {
        const selectedFile=files[0];

        try
        {
            setUploadInProgress(true);

            const fileObject={
                file: selectedFile,
                fileType: "image",
                featureName: "meditation-routine",
            };

            const url=await uploadToS3(fileObject);
            setObjectUrl(url);
        }
        catch(error)
        {
            console.error("Error uploading to S3",error);
        }
        finally
        {
            setUploadInProgress(false);
        }
    }

    return (
        <div className="bg-white p-4 rounded-3xl w-[75vw] lg:w-[50vw] h-[70vh] max-h-[95vh] overflow-auto mx-auto px-10 py-8 relative">
            <div className="absolute top-0 right-0 m-4 flex gap-1 items-center">
              <button className="text-white bg-black px-2 py-2 rounded-3xl" onClick={onClose}>
                <AiOutlineClose />
              </button>
            </div>
            <h1 className="text-2xl mb-4 font-bold text-center">Blog Details</h1>
            <form onSubmit={handleSubmit} className='flex flex-col'>
                <div className='flex flex-wrap gap-2 mb-4'>
                    <div className="pr-2">
                        <label className="block text-gray-700 text-sm font-medium" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 rounded p-2"
                        /></div>
                    <div className="pr-2">
                        <label className="block text-gray-700 text-sm font-medium" htmlFor="author">
                            Author
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="border border-gray-300 rounded p-2"
                        /></div>
                    <div className="pr-2">
                        <label className="block text-gray-700 text-sm font-medium" htmlFor="blogType">
                            Blog Type
                        </label>
                        <select
                        id="blogType"
                        name="blogType"
                        value={blogType}
                        onChange={(e) => setBlogType(e.target.value)}
                        className="w-full block appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        >
                        <option value="">Please select a blog type</option>
                        <option value="users">Users</option>
                        <option value="doctors">Doctors</option>
                        <option value="meditation-routines">Meditation Routines</option>
                        </select>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium" htmlFor="text">
                        Text
                    </label>
                    <ReactQuill
                        id="text"
                        name="text"
                        value={text}
                        onChange={handleEditorChange}
                        theme='snow'
                        // className="w-full border border-gray-300 rounded p-2"
                    />
                    {/* <textarea
                        id="text"
                        name="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                    /> */}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium" htmlFor="tags">
                        Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={tags}
                        onChange={handleTagsChange}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium" htmlFor="imageUrl">
                        Image URL
                    </label>
                    <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={objectUrl || imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                    disabled={objectUrl}
                    />
                </div>
                <Divider textAlign='center'>OR</Divider>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium">
                        Add an Image
                    </label>
                    <UploadComponent handleFileChange={handleFileChange} inputId={"imageFile"}/>
                </div>
                <div className='flex justify-center items-center'>
                <button type='submit' className={`w-full bg-purple-500 text-white text-xl py-2 px-4 rounded-2xl
                      ${uploadInProgress ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      disabled={uploadInProgress}>
                    {uploadInProgress ? "Uploading..." : "Submit"}
                  </button>
                </div>
            </form>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddBlog;

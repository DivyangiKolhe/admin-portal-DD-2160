import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineSave, AiOutlineArrowLeft, AiOutlineClose } from 'react-icons/ai';
import { Alert, Snackbar } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import api from "../../utils/api";
import UploadComponent from '../shared/UploadComponent';
import { uploadToS3 } from '../../utils/uploadToS3';

const ViewBlog = ({ blog, blogFor, onDelete, onClose }) => {

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState({ ...blog });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  //s3
  const [objectUrl, setObjectUrl] = useState('');

  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleDelete = () => {
    onDelete(blog.id);
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.authToken) {
        navigate('/login');
        return;
      }

      // Access authToken from the user object
      const authToken = user.authToken;

      const { id, ...editedBlogWithoutId } = editedBlog;

      setUploadInProgress(true);

      // Send a PATCH request to update the edited blog
      const response = await api.patch(`/blogs/${editedBlog.id}`, editedBlogWithoutId, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      // console.log(response);

      // Check the response status and handle it accordingly
      if (response.status === 200) {
        setIsEditing(false);
        setSuccessMessage('Blog successfully edited');
        setSnackbarOpen(true);
        setUploadInProgress(false);
      } else {
        setSuccessMessage('Blog Editing Failed!');
        setUploadInProgress(false);
      }
    }
    catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEditorChange = (content) => {
    setEditedBlog({ ...editedBlog, text: content })
  };

  const handleFileChange = async (files) => {
    const selectedFile = files[0];

    try {
      setUploadInProgress(true);

      const fileObject = {
        file: selectedFile,
        fileType: "image",
        featureName: blogFor.slice(0, -1),
      };

      const url = await uploadToS3(fileObject);
      setObjectUrl(url);

      setEditedBlog({ ...editedBlog, imageUrl: url });
      setUploadInProgress(false);
    }
    catch (error) {
      console.error("Error uploading to S3", error);
      setUploadInProgress(false);
    }
  }

  const handleGoBack = () => {
    setIsEditing(false); // Exit editing mode
  };

  return (
    <div className="relative w-[75vw] lg:w-[52vw] h-[80vh] bg-white rounded-3xl overflow-auto">
      {isEditing ? (
        // Edit mode with a form to update the blog
        <div className="flex gap-2 p-4 justify-between items-center flex-col">
          <h1 className='text-3xl font-bold'>Edit Blog</h1>
          <div className='flex gap-4'>
            <div className=''>
              <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={editedBlog.title}
                className="text-black w-full my-2 p-2 rounded border border-black"
                onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
                placeholder="Title"
              />
            </div>
            <div className=''>
              <label className="block text-gray-700 text-sm font-bold mb-2">Author</label>
              <input
                type="text"
                value={editedBlog.author}
                className="text-black w-full my-2 p-2 rounded border border-black"
                onChange={(e) => setEditedBlog({ ...editedBlog, author: e.target.value })}
                placeholder="Author"
              />
            </div>
          </div>
          <div className='w-full'>
            <label className="block text-gray-700 text-sm font-bold mb-2">Text</label>
            <ReactQuill
              id="text"
              name="text"
              value={editedBlog.text}
              onChange={handleEditorChange}
              theme='snow'
              placeholder="Text"
            // className="w-full border border-gray-300 rounded p-2"
            />
            {/* <textarea
              type="text"
              value={editedBlog.text}
              className="text-black w-full my-2 p-2 rounded h-40 border border-black"
              onChange={(e) => setEditedBlog({ ...editedBlog, text: e.target.value })}
              placeholder="Text"
            /> */}
          </div>
          <div className='flex gap-4'>
            <div className=''>
              <label className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
              <input
                type="text"
                value={editedBlog.tags}
                className="text-black w-full my-2 p-2 rounded border border-black"
                onChange={(e) => setEditedBlog({ ...editedBlog, tags: e.target.value.split(',').map((tag) => tag.trim()) })}
                placeholder="Tags"
              />
            </div>
            <div className=''>
              <label className="block text-gray-700 text-sm font-bold mb-2">ImageURL</label>
              <input
                type="text"
                value={objectUrl || editedBlog.imageUrl}
                className="text-black w-full my-2 p-2 rounded border border-black"
                onChange={(e) => setEditedBlog({ ...editedBlog, imageUrl: e.target.value })}
                placeholder="ImageURL"
                disabled={objectUrl}
              />
            </div>
          </div>
          <div className='w-2/3'>
            <UploadComponent handleFileChange={handleFileChange} inputId={"blogEditedImageFile"} />
          </div>
          <div className='flex gap-4'>
            <button className={`text-white bg-green-500 p-2 rounded-lg flex gap-2 items-center justify-center mt-2 
                      ${uploadInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSave}
              disabled={uploadInProgress}>
              <AiOutlineSave /> {uploadInProgress ? "Uploading..." : "Submit"}
            </button>
            <button className="text-white bg-gray-500 p-2 rounded-lg flex gap-2 items-center justify-center mt-2" onClick={handleGoBack}>
              <AiOutlineArrowLeft />Go Back
            </button>
          </div>
        </div>
      ) : (
        // View mode with blog image, title, text, and author
        <div>
          <div className="flex flex-col w-full h-[30vh] bg-slate-300 rounded-t-3xl relative bg-cover bg-center" style={{ backgroundImage: `url(${editedBlog.imageUrl})`, backgroundSize: "cover" }}>
            <div className="absolute top-0 right-0 m-4 flex gap-1 items-center">
              <button className="text-white bg-blue-500 px-2 py-2 rounded-3xl" onClick={handleEdit}>
                <AiOutlineEdit />
              </button>
              <button className="text-white bg-red-500 px-2 py-2 rounded-3xl" onClick={handleDelete}>
                <AiOutlineDelete />
              </button>
              <button className="text-white bg-black px-2 py-2 rounded-3xl" onClick={onClose}>
                <AiOutlineClose />
              </button>
            </div>
            <div className="absolute bottom-3 left-8 text-white">
              <h1 className="text-sm md:text-xl lg:text-2xl drop-shadow-md font-bold">
                {editedBlog.title}
              </h1>
              {`Author: ${editedBlog.author}`}

            </div>
          </div>
          <div className="text-md text-slate-700 w-[75vw] lg:w-[50vw] font-medium p-5">
            <p dangerouslySetInnerHTML={{ __html: editedBlog.text }} />
          </div>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Adjust position
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ViewBlog;

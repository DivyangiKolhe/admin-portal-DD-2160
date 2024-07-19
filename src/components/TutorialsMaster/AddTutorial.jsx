import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineSave } from 'react-icons/ai';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UploadComponent from '../shared/UploadComponent';
import { Alert, Divider, Snackbar } from '@mui/material';
import { uploadToS3 } from '../../utils/uploadToS3';
import api from '../../utils/api';

const AddTutorial = ({ addTutorial, onClose }) => {
    const [title, setTitle] = useState('');
    const [assetType, setAssetType] = useState('audio');
    const [description, setDescription] = useState('');
    const [assetLink, setAssetLink] = useState('');
    const [thumbnailLink, setThumbnailLink] = useState('');
    const [duration, setDuration] = useState(0);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    //upload to s3
    const [objectUrlThumnbail, setObjectUrlThumbnail] = useState('');
    const [objectUrlAsset, setObjectUrlAsset] = useState('');

    const [uploadInProgress, setUploadInProgress] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Logic for submitting the tutorial

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.authToken) {
                // Handle the case where authToken is not available (e.g., redirect or show an error message).
                return;
            }

            const authTokenUser = user.authToken;

            const newTutorial={
                name: title,
                description,
                duration,
                assetLink: objectUrlAsset || assetLink,
                thumbnailLink: objectUrlThumnbail || thumbnailLink,
                assetType,
            }

            // console.log(newTutorial);

            setUploadInProgress(true);

            addTutorial(newTutorial);

            const response = await api.post(
                '/tutorials',
                newTutorial,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokenUser}`,
                    },
                });

                // console.log(response);

            if (response.status === 200) {
                setSnackbarMessage('Tutorial added successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setUploadInProgress(false);
                onClose();
            }
        } catch (error) {
            console.error("Failed to add tutorial",error);
            setSnackbarMessage('Failed to add tutorial');
            setSnackbarSeverity('error');
            setUploadInProgress(false);
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleEditorChange = (content) => {
        setDescription(content);
    };

    const handleThumbnailChange = async (files) => {
        const selectedFile = files[0];

        try {
            setUploadInProgress(true);

            const tutorialFile = {
                file: selectedFile,
                fileType: "image",
                featureName: "tutorials",
                filePath:"tutorials/images",
            };

            const url = await uploadToS3(tutorialFile);
            setObjectUrlThumbnail(url);

            setUploadInProgress(false);
        }
        catch (error) {
            console.error("Error uploading to S3", error);
            setUploadInProgress(false);
        }
    }

    const handleAssetChange = async (files) => {
        const selectedFile = files[0];

        console.log(selectedFile);

        try {
            setUploadInProgress(true);

            const assetFile = {
                file: selectedFile,
                fileType: `${assetType}`,
                featureName: "tutorials",
                filePath:"",
                
            };

            const url = await uploadToS3(assetFile);
            setObjectUrlAsset(url);

            setUploadInProgress(false);
        }
        catch (error) {
            console.error("Error uploading to S3", error);
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
            <h1 className="text-2xl mb-2 font-bold text-center">Tutorial Details:</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className='flex flex-wrap justify-between gap-2 mb-2'>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium" htmlFor="assetType">
                            Asset Type
                        </label>
                        <select
                            id="assetType"
                            name="assetType"
                            value={assetType}
                            onChange={(e) => setAssetType(e.target.value)}
                            className="w-full block appearance-none px-6 bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        >
                            <option value="audio">Audio</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                </div>
                <div className="w-full mb-2">
                    <label className="block text-gray-700 text-sm font-medium" htmlFor="description">
                        Description
                    </label>
                    {/* <ReactQuill
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleEditorChange}
                        theme="snow"
                    /> */}
                    <textarea name="description" id="description" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full border border-gray-300 rounded p-2" />
                </div>
                <div className='w-full flex flex-wrap justify-between gap-2 mb-2'>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium" htmlFor="thumbnailLink">
                            Thumbnail Link
                        </label>
                        <input
                            type="text"
                            id="thumbnailLink"
                            name="thumbnailLink"
                            value={objectUrlThumnbail || thumbnailLink}
                            onChange={(e) => setThumbnailLink(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            disabled={objectUrlThumnbail}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium" htmlFor="assetLink">
                            Asset Link
                        </label>
                        <input
                            type="text"
                            id="assetLink"
                            name="assetLink"
                            value={objectUrlAsset || assetLink}
                            onChange={(e) => setAssetLink(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            disabled={objectUrlAsset}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium" htmlFor="duration">
                            Duration
                        </label>
                        <input
                            type="text"
                            id="duration"
                            name="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                        />
                    </div>
                </div>
                <Divider textAlign='center' className='w-full'>OR</Divider>
                <div className='flex flex-wrap'>
                    <div className="w-full mb-4">
                        <label className="block text-gray-700 text-sm font-medium">Add Thumbnail</label>
                        <UploadComponent handleFileChange={handleThumbnailChange} inputId={"thumbnailImage"} />
                    </div>
                    <div className="w-full mb-4">
                        <label className="block text-gray-700 text-sm font-medium">Add Asset</label>
                        <UploadComponent handleFileChange={handleAssetChange} inputId={"assetFile"} />
                    </div>
                </div>
                <div className="flex justify-center items-center w-1/4">
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

export default AddTutorial;

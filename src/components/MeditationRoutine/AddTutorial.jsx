import React, { useState } from 'react';
import { Card, Snackbar, Alert, Divider } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import UploadComponent from '../shared/UploadComponent';
import { uploadToS3 } from '../../utils/uploadToS3';
import rehabAPI from '../../utils/rehab';

const AddTutorial = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [assetLink, setAssetLink] = useState('');
  const [thumbnailLink, setThumbnailLink] = useState('');
  const [assetType, setAssetType] = useState('video');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.authToken) {
         console("user not authorized")
        return;
      }

      const authTokenUser = user.authToken;

      const newTutorial = {
        name,
        description,
        duration,
        assetLink,
        thumbnailLink,
        assetType,
      };

      setUploadInProgress(true);

      const response = await rehabAPI.post(`/meditation-routine/tutorials`, newTutorial, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokenUser}`,
        },
      });

      if (response.status === 200) {
        setSnackbarMessage('Tutorial added successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onClose();
      }
    } catch (error) {
      console.error('Failed to add tutorial', error);
      setSnackbarMessage('Failed to add tutorial');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFileChange = async (files, fileType) => {
    const selectedFile = files[0];

    try {
      setUploadInProgress(true);

      const fileObject = {
        file: selectedFile,
        fileType: fileType === 'video' ? 'video' : 'image',
        featureName: 'meditation-routine',
      };

      const url = await uploadToS3(fileObject);
      if (fileType === 'video') {
        setAssetLink(url);
      } else {
        setThumbnailLink(url);
      }
    } catch (error) {
      console.error('Error uploading to S3', error);
    } finally {
      setUploadInProgress(false);
    }
  };


  return (
    <div className="bg-white p-4 rounded-3xl w-[75vw] lg:w-[50vw] h-[70vh] max-h-[95vh] overflow-auto mx-auto px-10 py-8 relative">
      <div className="absolute top-0 right-0 m-4 flex gap-1 items-center">
        <button className="text-white bg-black px-2 py-2 rounded-3xl" onClick={onClose}>
          <AiOutlineClose />
        </button>
      </div>
      <h1 className="text-2xl mb-4 font-bold text-center">Tutorial Details</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-700 text-sm font-medium">
            Duration
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="assetLink" className="block text-gray-700 text-sm font-medium">
            Asset Link
          </label>
          <input
            type="text"
            id="assetLink"
            name="assetLink"
            value={assetLink}
            onChange={(e) => setAssetLink(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <Divider textAlign="center">OR</Divider>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">Add a Video or Audio</label>
          <UploadComponent handleFileChange={(files) => handleFileChange(files, 'video')} inputId="videoFile" />
        </div>
        <div className="mb-4">
          <label htmlFor="assetType" className="block text-gray-700 text-sm font-medium">
            Asset Type
          </label>
          <select
            id="assetType"
            name="assetType"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="w-full block appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="thumbnailLink" className="block text-gray-700 text-sm font-medium">
            Thumbnail Link
          </label>
          <input
            type="text"
            id="thumbnailLink"
            name="thumbnailLink"
            value={thumbnailLink}
            onChange={(e) => setThumbnailLink(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <Divider textAlign="center">OR</Divider>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">Add a Thumbnail</label>
          <UploadComponent handleFileChange={(files) => handleFileChange(files, 'image')} inputId="thumbnailFile" />
        </div>
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className={`w-full bg-purple-500 text-white text-xl py-2 px-4 rounded-2xl ${
              uploadInProgress ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={uploadInProgress}
          >
            {uploadInProgress ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </form>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>    </div>
  );
};

export default AddTutorial;

import React, { useState } from 'react';
import { Card, Snackbar, Alert, Divider } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import UploadComponent from '../shared/UploadComponent';
import { uploadToS3 } from '../../utils/uploadToS3';
import rehabAPI from '../../utils/rehab';

const AddPlaylist = ({ onClose }) => {
  const [name, setName] = useState('');
  const [totalDuration, setTotalDuration] = useState('');
  const [thumbnailLink, setThumbnailLink] = useState('');
  const [genre, setGenre] = useState('');
  const [isRadio, setIsRadio] = useState(false);
  const [language, setLanguage] = useState('');
  const [year, setYear] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.authToken) {
          console("user not authorized");
        return;
      }

      const authTokenUser = user.authToken;

      const newPlaylist = {
        name,
        totalDuration,
        thumbnailLink,
        genre,
        isRadio,
        language,
        year,
      };

      setUploadInProgress(true);

      const response = await rehabAPI.post(`/meditation-routine/playlist`, newPlaylist, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokenUser}`,
        },
      });

      if (response.status === 200) {
        setSnackbarMessage('Playlist added successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onClose();
      }
    } catch (error) {
      console.error('Failed to add playlist', error);
      setSnackbarMessage('Failed to add playlist');
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

  const handleFileChange = async (files) => {
    const selectedFile = files[0];

    try {
      setUploadInProgress(true);

      const url = await uploadToS3({
        file: selectedFile,
        fileType: 'image',
        featureName: 'meditation-routine',
      });

      setThumbnailLink(url);
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
      <h1 className="text-2xl mb-4 font-bold text-center">Add Playlist</h1>
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
          <label htmlFor="totalDuration" className="block text-gray-700 text-sm font-medium">
            Total Duration
          </label>
          <input
            type="text"
            id="totalDuration"
            name="totalDuration"
            value={totalDuration}
            onChange={(e) => setTotalDuration(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
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
          <UploadComponent handleFileChange={(files) => handleFileChange(files)} inputId="thumbnailFile" />
        </div>
        <div className="mb-4">
          <label htmlFor="genre" className="block text-gray-700 text-sm font-medium">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isRadio" className="block text-gray-700 text-sm font-medium">
            Is Radio
          </label>
          <input
            type="checkbox"
            id="isRadio"
            name="isRadio"
            checked={isRadio}
            onChange={(e) => setIsRadio(e.target.checked)}
            className="mx-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="language" className="block text-gray-700 text-sm font-medium">
            Language
          </label>
          <input
            type="text"
            id="language"
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="year" className="block text-gray-700 text-sm font-medium">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className={`w-full bg-purple-500 text-whitetext-xl py-2 px-4 rounded-2xl ${uploadInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      </Snackbar>
    </div>
  );
};

export default AddPlaylist;

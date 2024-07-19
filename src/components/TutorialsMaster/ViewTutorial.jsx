import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose, AiOutlineSave, AiOutlineArrowLeft, AiFillPlayCircle } from 'react-icons/ai';
import TutorialPlayer from './TutorialPlayer';
import { Alert, Snackbar } from '@mui/material';
import api from "../../utils/api";
import UploadComponent from '../shared/UploadComponent';
import { uploadToS3 } from '../../utils/uploadToS3';

const ViewTutorial = ({ tutorial, onDelete, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTutorial, setEditedTutorial] = useState({ ...tutorial });
  const [tutorialPlaying, setTutorialPlaying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  //upload to s3
  const [objectUrlThumnbail, setObjectUrlThumbnail] = useState('');
  const [objectUrlAsset, setObjectUrlAsset] = useState('');

  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleEdit = () => {
    if (tutorialPlaying) {
      setTutorialPlaying(false);
    }
    setIsEditing(true);
  };

  const handleDelete = () => {
    onDelete(tutorial.id);
    onClose();
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

      editedTutorial.thumbnailLink=objectUrlThumnbail || editedTutorial.thumbnailLink;
      editedTutorial.assetLink=objectUrlAsset || editedTutorial.assetLink;

      const { id, ...editedTutorialWithoutId } = editedTutorial;

      // console.log(editedTutorialWithoutId);

      setUploadInProgress(true);

      // Send a PATCH request to update the edited blog
      const response = await api.patch(`/tutorials/${editedTutorial.id}`, editedTutorialWithoutId, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      // console.log(response);

      // Check the response status and handle it accordingly
      if (response.status === 200) {
        setIsEditing(false);
        setSuccessMessage('Tutorial successfully edited');
        setSnackbarOpen(true);
        setUploadInProgress(false);
      } else {
        setSuccessMessage('Tutorial Editing Failed!');
        setUploadInProgress(false);
      }
    }
    catch (error) {
      console.error('Error saving tutorial:', error);
    }
  };

  const handleStartTutorial = () => {
    setTutorialPlaying(true);
  };

  const handleGoBack = () => {
    if (isEditing) {
      setIsEditing(false);
    } else if (tutorialPlaying) {
      setTutorialPlaying(false);
    }
  };

  const handleThumbnailChange = async (files) => {
    const selectedFile = files[0];

    try {
      setUploadInProgress(true);

      const tutorialFile = {
        file: selectedFile,
        fileType: "image",
        featureName: "tutorials",
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
        fileType: `${editedTutorial.assetType}`,
        featureName: "tutorials",
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
    <div className="relative w-[75vw] lg:w-[52vw] h-[80vh] bg-white rounded-3xl overflow-auto">
      {tutorialPlaying ? (
        <div className="w-full h-full">
          <TutorialPlayer tutorial={tutorial} handleDelete={handleDelete} handleClose={onClose} handleEdit={handleEdit} handleGoBack={handleGoBack} />
        </div>
      ) : (
        <div>
          {isEditing ? (
            <div className="flex gap-2 p-4 justify-between items-center flex-col">
              <h1 className='text-3xl font-bold'>Edit Tutorial</h1>
              <div className='flex gap-4'>
                <div className=''>
                  <label className="block text-gray-700 text-sm font-bold">Name</label>
                  <input
                    type="text"
                    value={editedTutorial.name}
                    className="text-black w-full my-2 p-2 rounded border border-black"
                    onChange={(e) => setEditedTutorial({ ...editedTutorial, name: e.target.value })}
                    placeholder="Name"
                  />
                </div>
                <div className=''>
                  <label className="block text-gray-700 text-sm font-bold">Description</label>
                  <input
                    type="text"
                    value={editedTutorial.description}
                    className="text-black w-full my-2 p-2 rounded border border-black"
                    onChange={(e) => setEditedTutorial({ ...editedTutorial, description: e.target.value })}
                    placeholder="Description"
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className=''>
                  <label className="block text-gray-700 text-sm font-bold ">Thumbnail Link</label>
                  <input
                    type="text"
                    value={objectUrlThumnbail || editedTutorial.thumbnailLink}
                    className="text-black w-full my-2 p-2 rounded border border-black"
                    onChange={(e) => setEditedTutorial({ ...editedTutorial, thumbnailLink: e.target.value })}
                    placeholder="Thumbnail Link"
                  // disabled={objectUrlThumnbail}
                  />
                </div>
                <div className=''>
                  <label className="block text-gray-700 text-sm font-bold ">Asset Link</label>
                  <input
                    type="text"
                    value={objectUrlAsset || editedTutorial.assetLink}
                    className="text-black w-full my-2 p-2 rounded border border-black"
                    onChange={(e) => setEditedTutorial({ ...editedTutorial, assetLink: e.target.value })}
                    placeholder="Asset Link"
                  // disabled={objectUrlAsset}
                  />
                </div>
              </div>
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
              <div className='flex gap-4'>
                  <button className={`text-white bg-green-500 p-2 rounded-lg flex gap-2 items-center justify-center mt-2 
                      ${uploadInProgress ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      onClick={handleSave} 
                      disabled={uploadInProgress}>
                    <AiOutlineSave /> {uploadInProgress ? "Uploading..." : "Submit"}
                  </button>
                <button className="text-white bg-gray-500 p-2 rounded-lg flex gap-2 items-center justify-center mt-2" onClick={handleGoBack}>
                  <AiOutlineArrowLeft /> Go Back
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col w-full h-[30vh] bg-slate-300 rounded-t-3xl relative bg-cover bg-center" style={{ backgroundImage: `url(${editedTutorial.thumbnailLink})` }}>
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
                    {editedTutorial.name}
                  </h1>
                  {/* type */}
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <button onClick={handleStartTutorial} className='px-4 py-3 text-white font-bold bg-purple-500 rounded-2xl w-1/2 mt-4 flex items-center justify-center gap-2'> <AiFillPlayCircle /> Start Tutorial</button>
              </div>
              <div className="text-md text-left text-slate-700 font-medium p-5">
                <div className='h-auto min-h-0 whitespace-pre-line overflow-x-hidden'><span className='font-bold'>Description:</span> {editedTutorial.description}</div>
              </div>
            </div>
          )}
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

export default ViewTutorial;

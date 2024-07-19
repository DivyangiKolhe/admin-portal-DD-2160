import React, { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineClose, AiOutlineSave } from "react-icons/ai";
import { Alert, Snackbar } from "@mui/material";
import rehabAPI from "../../utils/rehab";
import UploadComponent from "../shared/UploadComponent";
import { uploadToS3 } from "../../utils/uploadToS3";

const AddSongModal = ({ open, onClose, playlistId, onSongAdded }) => {
  const [songDetails, setSongDetails] = useState({
    name: "",
    duration: 0,
    thumbnailLink: "",
    assetLink: "",
    artistName: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSongDetails((prevSongDetails) => ({
      ...prevSongDetails,
      [name]: value,
    }));
  };

  const handleThumbnailChange = async (files) => {
    const selectedFile = files[0];
    try {
      setUploadInProgress(true);
      const thumbnailFile = {
        file: selectedFile,
        fileType: "image",
        featureName: "music-therapy",
        filePath:"music-therapy/images",
      };

      const url = await uploadToS3(thumbnailFile);
      setSongDetails((prevSongDetails) => ({
        ...prevSongDetails,
        thumbnailLink: url
      }));
      setUploadInProgress(false);
    } catch (error) {
      console.error("Error uploading thumbnail to S3", error);
      setUploadInProgress(false);
    }
  };

  const handleSongUpload = async (files) => {
    const selectedFile = files[0];
    try {
      setUploadInProgress(true);
      const songFile = {
        file: selectedFile,
        fileType: "audio",
        featureName: "music-therapy",
        filePath:"music-therapy/audios",
      };

      const url = await uploadToS3(songFile);
      setSongDetails((prevSongDetails) => ({
        ...prevSongDetails,
        assetLink: url
      }));
      setUploadInProgress(false);
    } catch (error) {
      console.error("Error uploading song to S3", error);
      setUploadInProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.authToken) {
        console.log("User not authorized");
        return;
      }
      const authTokenUser = user.authToken;
      const response = await rehabAPI.post(
        "/music-therapy/song",
        {
          playlistId,
          ...songDetails,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokenUser}`,
          },
        }
      );
      onSongAdded(response.data);
      onClose();
      setSuccessMessage("Song added successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding song:", error);
      setSuccessMessage("Error adding song");
      setSnackbarOpen(true);
    }
  };

  const handleGoBack = () => {
    onClose();
  };

  return (
    <div>
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-4 rounded-3xl w-[75vw] lg:w-[50vw] max-h-[95vh] overflow-auto">
            <div className="absolute top-0 right-0 m-4">
              <button onClick={onClose}>
                <AiOutlineClose />
              </button>
            </div>
            <button
              className="text-white bg-gray-500 p-2 rounded-lg flex gap-2 items-center justify-center"
              onClick={handleGoBack}
            >
              <AiOutlineArrowLeft />
              Go Back
            </button>
            <h1 className="text-2xl mb-2 font-bold text-center">Add Song</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={songDetails.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter song name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="artistName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Artist Name
                </label>
                <input
                  type="text"
                  id="artistName"
                  name="artistName"
                  value={songDetails.artistName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter artist name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (in seconds)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={songDetails.duration}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter song duration"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="thumbnailLink"
                  className="block text-gray-700 text-sm font-medium"
                >
                  Thumbnail Link
                </label>
                <input
                  type="text"
                  id="thumbnailLink"
                  name="thumbnailLink"
                  value={songDetails.thumbnailLink}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
                <UploadComponent
                  handleFileChange={handleThumbnailChange}
                  inputId="thumbnailFile"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="assetLink"
                  className="block text-gray-700 text-sm font-medium"
                >
                  Song Link
                </label>
                <input
                  type="text"
                  id="assetLink"
                  name="assetLink"
                  value={songDetails.assetLink}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Enter or paste song link"
                  required
                />
                <UploadComponent
                  handleFileChange={handleSongUpload}
                  inputId="songFile"
                />
              </div>
              <div className="px-4 py-3 sm:px-6 flex justify-center items-center">
                <button
                  type="submit"
                  className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    uploadInProgress ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={uploadInProgress}
                >
                  <AiOutlineSave className="mr-2" />
                  {uploadInProgress ? "Uploading..." : "Add Song"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity={successMessage.includes("Error") ? "error" : "success"}
          onClose={() => setSnackbarOpen(false)}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddSongModal;

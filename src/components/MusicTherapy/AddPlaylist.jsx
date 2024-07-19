import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import UploadComponent from "../shared/UploadComponent"; // Import the UploadComponent
import { uploadToS3 } from "../../utils/uploadToS3";
import rehabAPI from "../../utils/rehab";
import { Alert, Snackbar } from "@mui/material";
// Add/Edit Playlist component

const AddPlaylist = ({ onClose }) => {
  const [playlist, setPlaylist] = useState({
    name: "",
    genre: "",
    totalDuration: 0,
    isRadio: false,
    thumbnailLink: "",
    language: "",
    year: 0,
  });

  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.authToken) {
        console.log("user not authorized");
        return;
      }

      const authTokenUser = user.authToken;

      setUploadInProgress(true);

      const response = await rehabAPI.post(
        `/music-therapy/playlist`,
        playlist,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokenUser}`,
          },
        }
      );
      setSuccessMessage("playlist added successfully");
      setSnackbarOpen(true);
      if (response.status === 200) {
        setUploadInProgress(false);
        onClose();
      }
    } catch (error) {
      console.error("Failed to add playlist", error);
      setUploadInProgress(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPlaylist((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = async (files) => {
    const selectedFile = files[0];
    try {
      setUploadInProgress(true);
      const tutorialFile = {
        file: selectedFile,
        fileType: "image",
        featureName: "music-therapy",
      };

      const url = await uploadToS3(tutorialFile);
      setPlaylist((prev) => ({
        ...prev,
        thumbnailLink: url,
      }));
      setUploadInProgress(false);
    } catch (error) {
      console.error("Error uploading to S3", error);
      setUploadInProgress(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Adjust position
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
      <div className="bg-white p-4 rounded-3xl w-[75vw] lg:w-[50vw] h-[70vh] max-h-[95vh] overflow-auto mx-auto px-10 py-8 relative z-10">
        <div className="absolute top-0 right-0 m-4 flex gap-1 items-center">
          <button
            className="text-white bg-black px-2 py-2 rounded-full"
            onClick={onClose}
          >
            <AiOutlineClose />
          </button>
        </div>
        <h1 className="text-2xl mb-2 font-bold text-center">Add Playlist</h1>
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
              value={playlist.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter playlist name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700"
            >
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={playlist.genre}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter genre"
              required
            />
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              value={playlist.language}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter language"
              required
            />
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700"
            >
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={playlist.year}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter year"
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
              value={playlist.thumbnailLink}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
            {/* UploadComponent for uploading thumbnail */}
            <UploadComponent
              handleFileChange={handleThumbnailChange}
              inputId="thumbnailFile"
            />
          </div>

          <div className="px-4 py-3 sm:px-6 flex justify-center items-center">
            <button
              type="submit"
              className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm
              ${uploadInProgress ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={uploadInProgress}
            >
              {uploadInProgress ? "Uploading..." : "Add Playlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlaylist;

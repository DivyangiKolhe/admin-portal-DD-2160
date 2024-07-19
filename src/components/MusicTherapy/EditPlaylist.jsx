import React, { useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineArrowLeft,
  AiOutlineClose,
  AiOutlineSave,
} from "react-icons/ai";
import { Alert, Snackbar } from "@mui/material";
import rehabAPI from "../../utils/rehab";
import UploadComponent from "../shared/UploadComponent";
import { uploadToS3 } from "../../utils/uploadToS3";

const EditPlaylist = ({ playlist, onClose }) => {
    const defaultLanguage = "English"; // Default language
    const defaultYear = 2022; // Default year
    const defaultGenre = "Pop"; // Default genre
  
    const [isEditing, setIsEditing] = useState(true);
    const [editedPlaylist, setEditedPlaylist] = useState({
      ...playlist,
      language: playlist.language || defaultLanguage,
      year: playlist.year || defaultYear,
      genre: playlist.genre || defaultGenre,
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [uploadInProgress, setUploadInProgress] = useState(false);
  
    const handleEdit = () => {
      setIsEditing(true);
    };
  
    const handleSave = async () => {
      try {
        // Check if user is authenticated
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.authToken) {
          // Redirect to login page if user is not authenticated
          navigate("/login");
          return;
        }
  
        const authToken = user.authToken;
  
        // Exclude ID field from the edited playlist
        const { id, isMeditationRoutine, ...editedPlaylistWithoutId } =
          editedPlaylist;
  
        // Convert isRadio to boolean
        editedPlaylistWithoutId.isRadio = !!editedPlaylistWithoutId.isRadio;
  
        // Set isMeditationRoutine to 0
        editedPlaylistWithoutId.isMeditationRoutine = false;
  
        // Set upload in progress
        setUploadInProgress(true);
  
        // Patch the edited playlist data
        const response = await rehabAPI.patch(
          `/music-therapy/playlist/${editedPlaylist.id}`,
          editedPlaylistWithoutId,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
  
        // Handle response status
        if (response.status === 200) {
          setIsEditing(false);
          setSuccessMessage("Playlist successfully edited");
          setSnackbarOpen(true);
          onClose();
        } else {
          setSuccessMessage("Playlist Editing Failed!");
        }
      } catch (error) {
        console.error("Error saving playlist:", error);
      } finally {
        // Reset upload progress state
        setUploadInProgress(false);
      }
    };
  
    const handleGoBack = () => {
      setIsEditing(false);
      onClose();
    };
  
    const handleFileChange = async (files) => {
      const selectedFile = files[0];
  
      try {
        // Set upload in progress
        setUploadInProgress(true);
  
        // Upload thumbnail to S3 and get the URL
        const url = await uploadToS3({
          file: selectedFile,
          fileType: "image",
          featureName: "music-therapy",
        });
  
        // Set the thumbnail link in the edited playlist
        setEditedPlaylist({ ...editedPlaylist, thumbnailLink: url });
      } catch (error) {
        console.error("Error uploading thumbnail to S3", error);
      } finally {
        // Reset upload progress state
        setUploadInProgress(false);
      }
    };
  
    return (
      <div className="relative w-[75vw] lg:w-[52vw] h-[80vh] bg-white rounded-3xl overflow-auto">
        {isEditing ? (
          <div className="flex gap-2 p-4 justify-between items-center flex-col">
            <h1 className="text-3xl font-bold">Edit Playlist</h1>
            <div className="flex gap-4">
              <div className="">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editedPlaylist.name}
                  className="text-black w-full my-2 p-2 rounded border border-black"
                  onChange={(e) =>
                    setEditedPlaylist({ ...editedPlaylist, name: e.target.value })
                  }
                  placeholder="Name"
                />
              </div>
              <div className="">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Total Duration
                </label>
                <input
                  type="text"
                  value={editedPlaylist.totalDuration}
                  className="text-black w-full my-2 p-2 rounded border border-black"
                  onChange={(e) =>
                    setEditedPlaylist({
                      ...editedPlaylist,
                      totalDuration: e.target.value,
                    })
                  }
                  placeholder="Total Duration"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Language
                </label>
                <input
                  type="text"
                  value={editedPlaylist.language}
                  className="text-black w-full my-2 p-2 rounded border border-black"
                  onChange={(e) =>
                    setEditedPlaylist({
                      ...editedPlaylist,
                      language: e.target.value,
                    })
                  }
                  placeholder="Language"
                />
              </div>
              <div className="">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={editedPlaylist.year}
                  className="text-black w-full my-2 p-2 rounded border border-black"
                  onChange={(e) =>
                    setEditedPlaylist({ ...editedPlaylist, year: e.target.value })
                  }
                  placeholder="Year"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  value={editedPlaylist.genre}
                  className="text-black w-full my-2 p-2 rounded border border-black"
                  onChange={(e) =>
                    setEditedPlaylist({
                      ...editedPlaylist,
                      genre: e.target.value,
                    })
                  }
                  placeholder="Genre"
                />
              </div>
            </div>
            <div className="border border-gray-300 p-2 rounded w-2/3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Thumbnail Link
              </label>
              <input
                type="text"
                value={editedPlaylist.thumbnailLink}
                className="text-black w-full my-2 p-2 rounded border border-black"
                onChange={(e) =>
                  setEditedPlaylist({
                    ...editedPlaylist,
                    thumbnailLink: e.target.value,
                  })
                }
                placeholder="Thumbnail Link"
              />
              <UploadComponent
                handleFileChange={(files) => handleFileChange(files)}
                inputId={"thumbnailEditedFile"}
              />
            </div>
            <div className="flex gap-4">
              <button
                className={`text-white bg-green-500 p-2 rounded-lg flex gap-2 items-center justify-center mt-2 ${
                  uploadInProgress ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSave}
                disabled={uploadInProgress}
              >
                <AiOutlineSave /> {uploadInProgress ? "Uploading..." : "Submit"}
              </button>
              <button
                className="text-white bg-gray-500 p-2 rounded-lg flex gap-2 items-center justify-center mt-2"
                onClick={handleGoBack}
              >
                <AiOutlineArrowLeft />
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <div>{/* Render view mode of the playlist */}</div>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
            {successMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  };
  
  export default EditPlaylist;
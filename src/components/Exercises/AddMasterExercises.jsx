import React, { useState } from "react";
import { Modal, Snackbar, Alert, Divider } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import UploadComponent from "../shared/UploadComponent";
import { uploadToS3 } from "../../utils/uploadToS3";
import rehabAPI from "../../utils/rehab";

const AddMasterExercises = ({ onClose }) => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [content, setContent] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.authToken) {
        console.warn("User not authorized");
        return;
      }

      const authTokenUser = user.authToken;

      const newMasterYoga = {
        name,
        thumbnail,
        content,
      };

      setUploadInProgress(true);

      const response = await rehabAPI.post("/exercises/master-excercise", newMasterYoga, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokenUser}`,
        },
      });

      if (response.status === 200) {
        setSnackbarMessage("Master Exercise added successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        onClose();
      }
    } catch (error) {
      console.error("Failed to add master Exercise", error);
      setSnackbarMessage("Failed to add master Exercise");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFileChange = async (files) => {
    const selectedFile = files[0];

    try {
      setUploadInProgress(true);

      const fileObject = {
        file: selectedFile,
        fileType: "image",
        featureName: "master-exercise",
      };

      const url = await uploadToS3(fileObject);
      setThumbnail(url);
    } catch (error) {
      console.error("Error uploading to S3", error);
    } finally {
      setUploadInProgress(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-3xl w-[75vw] lg:w-[50vw] h-[70vh] max-h-[95vh] overflow-auto mx-auto px-10 py-8 relative">
      <div className="absolute top-0 right-0 m-4 flex gap-1 items-center">
        <button
          className="text-white bg-black px-2 py-2 rounded-3xl"
          onClick={onClose}
        >
          <AiOutlineClose />
        </button>
      </div>
      <h1 className="text-2xl mb-4 font-bold text-center">Add Master Exercise</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Form fields */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-medium"
          >
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
          <label
            htmlFor="thumbnail"
            className="block text-gray-700 text-sm font-medium"
          >
            Thumbnail
          </label>
          <input
            type="text"
            id="thumbnail"
            name="thumbnail"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <Divider textAlign="center">OR</Divider>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">
            Upload Thumbnail
          </label>
          <UploadComponent
            handleFileChange={handleFileChange}
            inputId="thumbnailFile"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 text-sm font-medium"
          >
            Content
          </label>
          <input
            type="text"
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className={`w-full bg-purple-500 text-white text-xl py-2 px-4 rounded-2xl ${
              uploadInProgress ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={uploadInProgress}
          >
            {uploadInProgress ? "Uploading..." : "Submit"}
          </button>
        </div>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddMasterExercises;

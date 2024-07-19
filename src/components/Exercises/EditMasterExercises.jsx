import React, { useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineArrowLeft,
  AiOutlineClose,
  AiOutlineSave,
} from "react-icons/ai";
import { Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import rehabAPI from "../../utils/rehab";
import UploadComponent from "../shared/UploadComponent";
import { uploadToS3 } from "../../utils/uploadToS3";
import neurorehabAPI from "../../utils/neurorehab";

const EditMasterExercise = ({ masterExercise, onClose }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(true);
  const [editedMasterExercise, setEditedMasterExercise] = useState({
    ...masterExercise,
    totalDuration: 100,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.authToken) {
        navigate("/login");
        return;
      }

      const authToken = user.authToken;

      const { id, createdAt, updatedAt, ...editedMasterExerciseWithoutId } =
        editedMasterExercise;

      setUploadInProgress(true);

      const response = await neurorehabAPI.patch(
        `/master-exercises/${editedMasterExercise.id}`,
        editedMasterExerciseWithoutId,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        setSuccessMessage("Master Exercise successfully edited");
        setSnackbarOpen(true);
      } else {
        setSuccessMessage("Master Exercise Editing Failed!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error saving Master Exercise:", error);
      setSuccessMessage("error while saving");
      setSnackbarOpen(true);
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleGoBack = () => {
    setIsEditing(false);
  };

  const handleFileChange = async (files, fileType) => {
    const selectedFile = files[0];

    try {
      setUploadInProgress(true);

      const fileObject = {
        file: selectedFile,
        fileType: fileType === "video" ? "video" : "image",
        featureName: "Master-Exercise",
      };

      const url = await uploadToS3(fileObject);
      if (fileType === "video") {
        setEditedMasterExercise({ ...editedMasterExercise, ExerciseVideoLink: url });
      } else {
        setEditedMasterExercise({ ...editedMasterExercise, thumbnail: url });
      }
    } catch (error) {
      console.error("Error uploading to S3", error);
    } finally {
      setUploadInProgress(false);
    }
  };

  return (
    <div className="relative w-[75vw] lg:w-[52vw] h-[80vh] bg-white rounded-3xl overflow-auto">
      {isEditing ? (
        <div className="flex gap-2 p-4 justify-between items-center flex-col">
          <h1 className="text-3xl font-bold">Edit Master Exercise</h1>
          <div className="flex gap-4">
            <div className="">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                value={editedMasterExercise.name}
                className="text-black w-full my-2 p-2 rounded border border-black"
                onChange={(e) =>
                  setEditedMasterExercise({
                    ...editedMasterExercise,
                    name: e.target.value,
                  })
                }
                placeholder="Name"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Content
            </label>
            <textarea
              type="text"
              value={editedMasterExercise.content}
              className="text-black w-full my-2 p-2 rounded h-25 border border-black"
              onChange={(e) =>
                setEditedMasterExercise({
                  ...editedMasterExercise,
                  content: e.target.value,
                })
              }
              placeholder="Content"
            />
          </div>
          <div className="flex gap-4">
            <div className="border border-gray-300 p-2 rounded w-2/3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Thumbnail
              </label>
              <input
                type="text"
                value={editedMasterExercise.thumbnail}
                className="text-black w-full my-2 p-2 rounded border border-black"
                onChange={(e) =>
                  setEditedYogaMaster({
                    ...editedMasterExercise,
                    thumbnail: e.target.value,
                  })
                }
                placeholder="Thumbnail Link"
              />
              <UploadComponent
                handleFileChange={(files) => handleFileChange(files, "image")}
                inputId={"thumbnailEditedFile"}
              />
            </div>
            <div className="border border-gray-300 p-2 rounded w-2/3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
              Exercise Video Link
              </label>
              <input
                type="text"
                value={editedMasterExercise.ExerciseVideoLink}
                className="text-black w-full my-2 p-2 rounded border border-black"
                onChange={(e) =>
                  setEditedMasterExercise({
                    ...editedMasterExercise,
                   ExerciseVideoLink: e.target.value,
                  })
                }
                placeholder="Exercise Video Link"
              />
              <UploadComponent
                handleFileChange={(files) => handleFileChange(files, "video")}
                inputId={"ExerciseVideoEditedFile"}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Total Duration
            </label>
            <input
              type="number"
              value={editedMasterExercise.totalDuration}
              className="text-black w-full my-2 p-2 rounded border border-black"
              onChange={(e) =>
                setEditedYogaMaster({
                  ...editedMasterExercise,
                  totalDuration: e.target.value,
                })
              }
              placeholder="Total Duration"
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
        <div>
          <div
            className="flex flex-col w-full h-[30vh] bg-slate-300 rounded-t-3xl relative bg-cover bg-center"
            style={{
              backgroundImage: `url(${editedMasterExercise.thumbnail})`,
              backgroundSize: "cover",
            }}
          >
            <div className="absolute top-0 right-0 m-4 flex gap-1 items-center">
              <button
                className="text-white bg-blue-500 px-2 py-2 rounded-3xl"
                onClick={handleEdit}
              >
                <AiOutlineEdit />
              </button>
              <button
                className="text-white bg-black px-2 py-2 rounded-3xl"
                onClick={onClose}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="absolute bottom-3 left-8 text-white">
              <h1 className="text-sm md:text-xl lg:text-2xl drop-shadow-md font-bold">
                {editedMasterExercise.name}
              </h1>
            </div>
          </div>
          <div className="text-md text-slate-700 w-[75vw] lg:w-[50vw] font-medium p-5">
            {editedMasterExercise.content}
          </div>
        </div>
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
      {!isEditing && (
        <div className="col-span-1 md:col-span-2 flex items-center justify-center mb-4">
          <video
            src={editedMasterExercise.ExerciseVideoLink}
            controls
            className="w-full max-w-md h-auto max-h-56 object-contain bg-black rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default EditMasterExercise;

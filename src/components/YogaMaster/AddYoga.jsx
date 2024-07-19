import React, { useState, useEffect } from "react";
import { Card, Snackbar, Alert, Divider } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import UploadComponent from "../shared/UploadComponent";
import { uploadToS3 } from "../../utils/uploadToS3";
import rehabAPI from "../../utils/rehab";

const AddYoga = ({ onClose }) => {
  const [name, setName] = useState("");
  const [breakThumbnail, setBreakThumbnail] = useState("");
  const [setsThumbnail, setSetsThumbnail] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [yogaVideoLink, setYogaVideoLink] = useState("");
  const [numberOfSets, setNumberOfSets] = useState(0);
  const [sets, setSets] = useState([]);
  const [shortDescription, setShortDescription] = useState("");
  const [masterYogaId, setMasterYogaId] = useState(""); // New state for storing the selected master yoga ID
  const [masterYogas, setMasterYogas] = useState([]); // State to store the list of master yogas

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [uploadInProgress, setUploadInProgress] = useState(false);

  useEffect(() => {
    const fetchMasterYogas = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.authToken) {
          console.warn("User not authorized");
          return;
        }

        const authTokenUser = user.authToken;

        const response = await rehabAPI.get("/yoga/master-yoga", {
          headers: {
            Authorization: `Bearer ${authTokenUser}`,
          },
        });

        setMasterYogas(response.data.data);
      } catch (error) {
        console.error("Error fetching master yogas", error);
      }
    };

    fetchMasterYogas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.authToken) {
        console.warn("User not authorized");
        return;
      }

      const authTokenUser = user.authToken;

      const newYoga = {
        name,
        masterYogaId, // Use the selected master yoga ID
        breakThumbnail,
        setsThumbnail,
        thumbnail,
        yogaVideoLink,
        numberOfSets,
        sets,
        shortDescription,
      };

      setUploadInProgress(true);

      const response = await rehabAPI.post("/yoga", newYoga, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokenUser}`,
        },
      });

      if (response.status === 200) {
        setSnackbarMessage("Yoga added successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        onClose();
      }
    } catch (error) {
      console.error("Failed to add yoga", error);
      setSnackbarMessage("Failed to add yoga");
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

  const handleFileChange = async (files, fileType) => {
    const selectedFile = files[0];

    try {
      setUploadInProgress(true);

      const fileObject = {
        file: selectedFile,
        fileType: fileType === "video" ? "video" : "image",
        featureName: "yoga",
        filePath: fileType === "video" ? "yoga/videos" : "yoga/images",
      };

      const url = await uploadToS3(fileObject);
      if (fileType === "video") {
        setYogaVideoLink(url);
      } else if (fileType === "thumbnail") {
        setThumbnail(url);
      } else if (fileType === "breakThumbnail") {
        setBreakThumbnail(url);
      } else if (fileType === "setsThumbnail") {
        setSetsThumbnail(url);
      }
    } catch (error) {
      console.error("Error uploading to S3", error);
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleAddSet = () => {
    setSets([...sets, { reps: [], break: 0 }]);
  };

  const handleRepChange = (setIndex, repIndex, field, value) => {
    const newSets = [...sets];
    if (!newSets[setIndex]) {
      newSets[setIndex] = { reps: [] };
    }
    if (!newSets[setIndex].reps[repIndex]) {
      newSets[setIndex].reps[repIndex] = {};
    }
    newSets[setIndex].reps[repIndex] = {
      ...newSets[setIndex].reps[repIndex],
      [field]: value,
    };
    setSets(newSets);
  };

  const handleBreakChange = (setIndex, value) => {
    const newSets = [...sets];
    if (!newSets[setIndex]) {
      newSets[setIndex] = { break: 0 };
    }
    newSets[setIndex].break = value;
    setSets(newSets);
  };

  const handleAddRep = (setIndex) => {
    const newSets = [...sets];

    if (!newSets[setIndex]) {
      newSets[setIndex] = { reps: [] };
    }

    if (!newSets[setIndex].reps) {
      newSets[setIndex].reps = [];
    }

    const lastRepIndex = newSets[setIndex].reps.length;
    newSets[setIndex].reps.push({
      score: 0,
      duration: 0,
    });

    setSets(newSets);
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
      <h1 className="text-2xl mb-4 font-bold text-center">Yoga Details</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Form fields */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="blocktext-gray-700 text-sm font-medium"
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
            htmlFor="shortDescription"
            className="block text-gray-700 text-sm font-medium"
          >
            Short Description
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Select yoga master */}
        <div className="mb-4">
          <label
            htmlFor="masterYogaId"
            className="block text-gray-700 text-sm font-medium"
          >
            Select Yoga Master
          </label>
          <select
            id="masterYogaId"
            name="masterYogaId"
            value={masterYogaId}
            onChange={(e) => setMasterYogaId(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="">Select Yoga Master</option>
            {masterYogas.map((masterYoga) => (
              <option key={masterYoga.id} value={masterYoga.id}>
                {masterYoga.name}
              </option>
            ))}
          </select>
        </div>

        {/* File uploads */}
        <div className="mb-4">
          <label
            htmlFor="yogaVideoLink"
            className="block text-gray-700 text-sm font-medium"
          >
            Yoga Video Link
          </label>
          <input
            type="text"
            id="yogaVideoLink"
            name="yogaVideoLink"
            value={yogaVideoLink}
            onChange={(e) => setYogaVideoLink(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <Divider textAlign="center">OR</Divider>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">
            Add a Yoga Video
          </label>
          <UploadComponent
            handleFileChange={(files) => handleFileChange(files, "video")}
            inputId="yogaVideoFile"
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
            Add a Thumbnail
          </label>
          <UploadComponent
            handleFileChange={(files) => handleFileChange(files, "thumbnail")}
            inputId="thumbnailFile"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="breakThumbnail"
            className="block text-gray-700 text-sm font-medium"
          >
            Break Thumbnail
          </label>
          <input
            type="text"
            id="breakThumbnail"
            name="breakThumbnail"
            value={breakThumbnail}
            onChange={(e) => setBreakThumbnail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <Divider textAlign="center">OR</Divider>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">
            Add a Break Thumbnail
          </label>
          <UploadComponent
            handleFileChange={(files) =>
              handleFileChange(files, "breakThumbnail")
            }
            inputId="breakThumbnailFile"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="setsThumbnail"
            className="block text-gray-700 text-sm font-medium"
          >
            Sets Thumbnail
          </label>
          <input
            type="text"
            id="setsThumbnail"
            name="setsThumbnail"
            value={setsThumbnail}
            onChange={(e) => setSetsThumbnail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <Divider textAlign="center">OR</Divider>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">
            Add a Sets Thumbnail
          </label>
          <UploadComponent
            handleFileChange={(files) =>
              handleFileChange(files, "setsThumbnail")
            }
            inputId="setsThumbnailFile"
          />
        </div>

        {/* Number of sets */}
        <div className="mb-4">
          <label
            htmlFor="numberOfSets"
            className="block text-gray-700 text-sm font-medium"
          >
            Number of Sets
          </label>
          <input
            type="number"
            id="numberOfSets"
            name="numberOfSets"
            value={numberOfSets}
            onChange={(e) => setNumberOfSets(parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Sets details */}
        {Array.from({ length: numberOfSets }, (_, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Set {index + 1}</h3>
            <div className="mb-2">
              <label
                htmlFor={`sets[${index}].break`}
                className="block text-gray-700 text-sm font-medium"
              >
                Break Duration (in seconds)
              </label>
              <input
                type="number"
                id={`sets[${index}].break`}
                name={`sets[${index}].break`}
                value={(sets[index] && sets[index].break) || ""}
                onChange={(e) =>
                  handleBreakChange(index, parseInt(e.target.value))
                }
                className="w-full border border-gray-300 rounded p-2 break-input"
                required
              />
            </div>
            {sets[index] && sets[index].reps
              ? sets[index].reps.map((rep, repIndex) => (
                  <div key={repIndex} className="flex items-center mb-2">
                    <div className="w-1/3 mr-2">
                      <label
                        htmlFor={`sets[${index}].reps[${repIndex}].score`}
                        className="block text-gray-700 text-sm font-medium"
                      >
                        Score
                      </label>
                      <input
                        type="number"
                        id={`sets[${index}].reps[${repIndex}].score`}
                        name={`sets[${index}].reps[${repIndex}].score`}
                        placeholder="Score"
                        value={rep.score || ""}
                        onChange={(e) =>
                          handleRepChange(
                            index,
                            repIndex,
                            "score",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                    </div>
                    <div className="w-1/3 mr-2">
                      <label
                        htmlFor={`sets[${index}].reps[${repIndex}].duration`}
                        className="block text-gray-700 text-sm font-medium"
                      >
                        Duration (in seconds)
                      </label>
                      <input
                        type="number"
                        id={`sets[${index}].reps[${repIndex}].duration`}
                        name={`sets[${index}].reps[${repIndex}].duration`}
                        placeholder="Duration"
                        value={rep.duration || ""}
                        onChange={(e) =>
                          handleRepChange(
                            index,
                            repIndex,
                            "duration",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                    </div>
                  </div>
                ))
              : null}
            <button
              type="button"
              onClick={() => handleAddRep(index)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md"
            >
              Add Rep
            </button>
          </div>
        ))}

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

export default AddYoga;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  Grid,
  TextField,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import UploadComponent from "../shared/UploadComponent";
import { uploadToS3 } from "../../utils/uploadToS3";
import rehabAPI from "../../utils/rehab";
import neurorehabAPI from "../../utils/neurorehab";

const EditExerciseModal = ({ masterYoga, onClose }) => {
  const [editedYoga, setEditedYoga] = useState({ ...masterYoga });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [masterYogas, setMasterYogas] = useState([]);

  const handleRepChange = (setIndex, repIndex, field, value) => {
    const newSets = [...editedYoga.sets];
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
    setEditedYoga({ ...editedYoga, sets: newSets });
  };

  const handleAddRep = (setIndex) => {
    const newSets = [...editedYoga.sets];
    if (!newSets[setIndex]) {
      newSets[setIndex] = { reps: [] };
    }
    newSets[setIndex].reps.push({ score: "", duration: "" });
    setEditedYoga({ ...editedYoga, sets: newSets });
  };

  const handleBreakChange = (setIndex, value) => {
    const newSets = [...editedYoga.sets];
    if (!newSets[setIndex]) {
      newSets[setIndex] = { break: 0 };
    }
    newSets[setIndex].break = value;
    setEditedYoga({ ...editedYoga, sets: newSets });
  };

  useEffect(() => {
    setEditedYoga({ ...masterYoga });
    fetchMasterYogas();
  }, [masterYoga]);

  const fetchMasterYogas = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.authToken) {
        console.warn("User not authorized");
        return;
      }

      const authToken = user.authToken;

      const response = await neurorehabAPI.get("/master-exercises", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setMasterYogas(response.data.data.masterExercises);
    } catch (error) {
      console.error("Error fetching master exercises:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleFileChange = async (files, fileType) => {
    const selectedFile = files[0];

    try {
      setUploadInProgress(true);

      const fileObject = {
        file: selectedFile,
        fileType: fileType === "video" ? "video" : "image",
        featureName: "exercises",
      };

      const url = await uploadToS3(fileObject);
      if (fileType === "video") {
        setEditedYoga({ ...editedYoga, yogaVideoLink: url });
      } else if (fileType === "thumbnail") {
        setEditedYoga({ ...editedYoga, thumbnail: url });
      } else if (fileType === "breakThumbnail") {
        setEditedYoga({ ...editedYoga, breakThumbnail: url });
      } else if (fileType === "setsThumbnail") {
        setEditedYoga({ ...editedYoga, setsThumbnail: url });
      }
    } catch (error) {
      console.error("Error uploading to S3", error);
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.authToken) {
        console.warn("User not authorized");
        return;
      }

      const authToken = user.authToken;

      const { id, createdAt, updatedAt, ...editedYogaWithoutId } = editedYoga;

      setUploadInProgress(true);

      const response = await neurorehabAPI.patch(
        `/exercises/${editedYoga.id}`,
        editedYogaWithoutId,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setSuccessMessage("Yoga successfully edited");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Error saving yoga:", error);
      setSuccessMessage("Failed to edit yoga");
      setSnackbarOpen(true);
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedYoga((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog onClose={onClose} open={true} maxWidth="md" fullWidth>
      <div className="flex justify-between items-center">
        <DialogTitle>Edit Exercise</DialogTitle>
        <AiOutlineClose onClick={onClose} className="cursor-pointer" />
      </div>
      <div className="p-4">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              name="name"
              value={editedYoga.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Short Description"
              variant="outlined"
              name="shortDescription"
              value={editedYoga.shortDescription}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Number of Sets"
              variant="outlined"
              type="number"
              name="numberOfSets"
              value={editedYoga.numberOfSets}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              fullWidth
              value={editedYoga.masterYogaId || ""}
              onChange={(e) =>
                setEditedYoga((prev) => ({
                  ...prev,
                  masterYogaId: e.target.value,
                }))
              }
              displayEmpty
            >
              {/* Option to select no master yoga */}
              <MenuItem value="">Select Master Exercise</MenuItem>
              {/* Map through masterYogas to display available options */}
              {masterYogas?.length > 0 &&
                masterYogas.map((masterYoga) => (
                  <MenuItem key={masterYoga.id} value={masterYoga.id}>
                    {masterYoga.name}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          {/* Inputs for sets details */}
          {Array.from({ length: editedYoga.numberOfSets }, (_, index) => (
            <Grid item xs={12} key={index}>
              <div>
                <h3 className="text-lg font-semibold mb-2">Set {index + 1}</h3>
                <div className="mb-2">
                  <TextField
                    fullWidth
                    label="Break Duration (in seconds)"
                    variant="outlined"
                    type="number"
                    value={
                      (editedYoga.sets[index] &&
                        editedYoga.sets[index].break) ||
                      ""
                    }
                    onChange={(e) =>
                      handleBreakChange(index, parseInt(e.target.value))
                    }
                  />
                </div>
                {editedYoga.sets[index] && editedYoga.sets[index].reps
                  ? editedYoga.sets[index].reps.map((rep, repIndex) => (
                      <Grid container spacing={2} key={repIndex}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Score"
                            variant="outlined"
                            type="number"
                            value={rep.score || ""}
                            onChange={(e) =>
                              handleRepChange(
                                index,
                                repIndex,
                                "score",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Duration (in seconds)"
                            variant="outlined"
                            type="number"
                            value={rep.duration || ""}
                            onChange={(e) =>
                              handleRepChange(
                                index,
                                repIndex,
                                "duration",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </Grid>
                      </Grid>
                    ))
                  : null}
                {/* Add Rep button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddRep(index)}
                  className="mt-2"
                >
                  Add Rep
                </Button>
              </div>
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Thumbnail"
              variant="outlined"
              name="thumbnail"
              value={editedYoga.thumbnail}
              onChange={handleInputChange}
            />
            <Divider textAlign="center">OR</Divider>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium">
                Upload Thumbnail
              </label>
              <UploadComponent
                handleFileChange={(files) =>
                  handleFileChange(files, "thumbnail")
                }
                inputId="thumbnailEditedFile"
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="exercise Video Link"
              variant="outlined"
              name="exerciseVideoLink"
              value={editedYoga.exerciseVideoLink}
              onChange={handleInputChange}
            />
            <Divider textAlign="center">OR</Divider>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium">
                Upload Video
              </label>
              <UploadComponent
                handleFileChange={(files) => handleFileChange(files, "video")}
                inputId="yogaVideoEditedFile"
              />
            </div>
          </Grid>
          {/* Additional fields */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Break Thumbnail"
              variant="outlined"
              name="breakThumbnail"
              value={editedYoga.breakThumbnail}
              onChange={handleInputChange}
            />
            <Divider textAlign="center">OR</Divider>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium">
                Upload Break Thumbnail
              </label>
              <UploadComponent
                handleFileChange={(files) =>
                  handleFileChange(files, "breakThumbnail")
                }
                inputId="breakThumbnailEditedFile"
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Sets Thumbnail"
              variant="outlined"
              name="setsThumbnail"
              value={editedYoga.setsThumbnail}
              onChange={handleInputChange}
            />
            <Divider textAlign="center">OR</Divider>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium">
                Upload Sets Thumbnail
              </label>
              <UploadComponent
                handleFileChange={(files) =>
                  handleFileChange(files, "setsThumbnail")
                }
                inputId="setsThumbnailEditedFile"
              />
            </div>
          </Grid>
        </Grid>
        {/* Save button */}
        <div className="flex justify-end mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={uploadInProgress}
          >
            {uploadInProgress ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
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
    </Dialog>
  );
};

export default EditExerciseModal;

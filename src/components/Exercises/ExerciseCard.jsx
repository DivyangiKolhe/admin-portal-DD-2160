import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsPlay } from "react-icons/bs";
import {
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import EditExerciseModal from "./EditExerciseModal";
import neurorehabAPI from "../../utils/neurorehab";

const ExerciseCard = ({ data }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSnackbarMessage("updated successfully");
    setSnackbarOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.authToken) {
        console.warn("User not authorized");
        return;
      }

      const authToken = user.authToken;
      const response = await neurorehabAPI.delete(`/exercises/${data.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.status === 200) {
        setSnackbarMessage("Yoga deleted successfully");
        setSnackbarOpen(true);
        setIsDeleteModalOpen(false);
        // Optionally, you can perform any additional cleanup or UI updates here.
      } else {
        setSnackbarMessage("Failed to delete yoga");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting yoga:", error);
      setSnackbarMessage("Failed to delete yoga");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <div className="max-w-xs w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden relative">
        <div className="relative h-48">
          <img
            src={data.thumbnail}
            alt={data.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 m-2 flex space-x-2">
            <button
              className="text-white bg-purple-500 px-2 py-2 rounded-3xl"
              onClick={handleEditClick}
            >
              <AiOutlineEdit />
            </button>
            <button
              className="text-white bg-purple-500 px-2 py-2 rounded-3xl"
              onClick={handleDeleteClick}
            >
              <AiOutlineDelete />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 p-4">
            <a
              href={data.exerciseVideoLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsPlay className="text-white text-4xl hover:text-purple-700" />
            </a>
          </div>
        </div>
        <div className="p-2">
          <h2 className="text-purple-900 font-extrabold mb-1 cursor-pointer">
            {data.name}
          </h2>
          <p className="text-gray-500 text-sm">
            {data.shortDescription.substring(0, 150) + "..."}
          </p>
        </div>
      </div>
      <Modal
        aria-labelledby="edit-yoga-master-modal"
        aria-describedby="edit-yoga-master-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
      >
        <div>
          <EditExerciseModal onClose={handleCloseEditModal} masterYoga={data} />
        </div>
      </Modal>
      <Dialog open={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar}>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
};

export default ExerciseCard;

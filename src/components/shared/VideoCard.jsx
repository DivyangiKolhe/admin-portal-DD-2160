import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import EditVideoModal from "./Editvideos";

const VideoCard = ({ id, title, artist, thumbnailUrl, onDelete,onClick }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleDeleteConfirmation = () => {
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    onDelete();
    setConfirmDelete(false);
  };

  const handleCloseConfirmation = () => {
    setConfirmDelete(false);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const encodedThumbnailUrl = encodeURI(thumbnailUrl);

  return (
    <div>
      <Card onClick={onClick}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
        className="song-card rounded-xl overflow-hidden shadow-md bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
      >
        <Box
          className="w-28 h-20 p-4 bg-gray-300 mr-4 flex-shrink-0"
          style={{
            backgroundImage: encodedThumbnailUrl ? `url(${encodedThumbnailUrl})` : "",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <CardContent className="flex-grow p-4">
          <Typography variant="h6" component="div" className="font-semibold">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {artist}
          </Typography>
        </CardContent>
        <div className="flex items-center">
          <button
            onClick={handleEditClick}
            className="text-gray-500 hover:text-gray-700 mr-2"
          >
            <AiOutlineEdit />
          </button>
          <button
            onClick={handleDeleteConfirmation}
            className="text-red-500 hover:text-red-700"
          >
            <AiOutlineDelete />
          </button>
        </div>
      </Card>
      <Dialog open={confirmDelete} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={handleCloseConfirmation}>No</Button>
        </DialogActions>
      </Dialog>
      <EditVideoModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        videoId={id}
        title={title}
        artist={artist}
        thumbnailUrl={thumbnailUrl}
      />
    </div>
  );
};

export default VideoCard;

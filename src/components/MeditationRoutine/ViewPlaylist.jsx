import React, { useState } from "react";
import SongsPlayer from "../shared/SongsPlayer";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlusCircle,
  AiOutlineSave,
} from "react-icons/ai";
import { Alert, Snackbar } from '@mui/material';
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { Card, CardContent, Typography, Box} from "@mui/material";
import EditPlaylist from "../MeditationRoutine/EditPlaylist";
import rehabAPI from "../../utils/rehab";
import AddSongModal from "../shared/Addsongs";
import SongCard from "../shared/SongCard";
import VideoCard from "../shared/VideoCard";
import AddVideoModal from "../shared/Addvideos";
import VideoPlayerModal from "./VideoModal";
 
const ViewPlaylist = ({ music, songs, videos }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedSongAudioUrl, setSelectedSongAudioUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showVideoPlayerModal, setShowVideoPlayerModal] = useState(false);
 
  const handleCloseAddSongModal = () => {
    setShowAddSongModal(false);
  };
  const handleOpenAddSongModal = () => {
    setShowAddSongModal(true);
  };
 
  const handleCloseVideoPlayerModal = () => {
    setShowVideoPlayerModal(false);
  };
 
  const handleCloseAddVideoModal = () => {
    setShowAddVideoModal(false);
  };
  const handleOpenAddVideoModal = () => {
    setShowAddVideoModal(true);
  };
 
  const handleCloseEditModal = () => {
    setIsEditing(false);
  };
 
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
 
  const handleDeletePlayList = (playlistId) => {
    setConfirmDelete(playlistId);
  };
 
  const deletePlaylist = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.authToken) {
        throw new Error("User or authToken not available");
      }
      const authTokenUser = user.authToken;
      await rehabAPI.delete(`/meditation-routine/playlist/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${authTokenUser}` },
      });
      setDeleteSuccess(true);
      setSuccessMessage("playlist deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting playlist:", error);
      setSuccessMessage('error deleting playlist',error)
    } finally {
      setConfirmDelete(null);
    }
  };
  const handleDeleteSong = async (songId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.authToken) {
        throw new Error("User or authToken not available");
      }
      const authTokenUser = user.authToken;
      await rehabAPI.delete(`/music-therapy/song/${songId}`, {
        headers: { Authorization: `Bearer ${authTokenUser}` },
      });
      setSuccessMessage("Song deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting song:", error);
      setSuccessMessage("Error deleting song");
      setSnackbarOpen(true);
    }
  };
 
  const handleDeleteVideo = async (videoId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.authToken) {
        throw new Error("User or authToken not available");
      }
      const authTokenUser = user.authToken;
      await rehabAPI.delete(`/music-therapy/video/${videoId}`, {
        headers: { Authorization: `Bearer ${authTokenUser}` },
      });
      setSuccessMessage("Video deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting video:", error);
      setSuccessMessage("Error deleting video");
      setSnackbarOpen(true);
    }
  };
 
  const handleSongAdded = (newSong) => {
   
    setSuccessMessage("song uploaded", newSong.name);
    setSnackbarOpen(true);
 
  };
 
  const handleVideoAdded = (newVideo) => {
   
    setSuccessMessage("Video uploaded", newVideo.name);
    setSnackbarOpen(true);
 
  };
 
 
  const renderDeleteConfirmation = () => {
    return (
      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={deletePlaylist}>Yes</Button>
          <Button onClick={() => setConfirmDelete(null)}>No</Button>
        </DialogActions>
      </Dialog>
    );
  };
 
  const handleSongClick = async (song) => {
    try {
      // Fetch the audio file URL here, e.g., from an API or your server
      const audioUrl = song.assetLink; // Replace this with your actual API call
      setSelectedSongAudioUrl(audioUrl);
      setSelectedSong(song);
    } catch (error) {
      console.error("Error fetching audio file:", error);
    }
  };
 
  const handleVideoClick = async (video) => {
    try {
      setVideoUrl(video.assetLink);
      setShowVideoPlayerModal(true);
    } catch (error) {
      console.error("Error fetching audio file:", error);
    }
  };
 
  return (
    <div className="flex flex-col w-[75vw] lg:w-[50vw] h-[80vh] bg-white rounded-3xl relative">
      <div
        className="w-full h-[60vh] bg-slate-300 rounded-t-3xl relative bg-cover bg-center"
        style={{ backgroundImage: `url(${music?.thumbnailLink})` }}
      >
        <div className="absolute top-0 right-0 m-4 flex gap-1 items-center">
          {isEditing ? (
            <button className="text-white bg-green-500 px-2 py-2 rounded-3xl">
              <AiOutlineSave />
            </button>
          ) : (
            <button
              className="text-white bg-blue-500 px-2 py-2 rounded-3xl"
              onClick={handleEdit}
            >
              <AiOutlineEdit />
            </button>
          )}
          <button
            className="text-white bg-red-500 px-2 py-2 rounded-3xl"
            onClick={() => handleDeletePlayList(music.id)}
          >
            <AiOutlineDelete />
          </button>
        </div>
        <div className="p-4 gap-4">
        <Button onClick={handleOpenAddSongModal}>Add song</Button>
        <Button onClick={handleOpenAddVideoModal}>Add video</Button>
      </div>
        <div className="absolute bottom-5 left-8 flex items-center justify-center">
          <h1 className="text-5xl text-white font-bold">{music?.name}</h1>
        </div>
      </div>
      <div className="gap-4 h-[200vh] p-4 overflow-auto">
        {songs && songs.length > 0 ? (
          songs.map((item, index) => (
            <SongCard
              key={index}
              title={item.name}
              artist={item.artistName}
              thumbnailUrl={item.thumbnailLink || ""}
              onClick={() => handleSongClick(item)}
              onDelete={() => handleDeleteSong(item.id)}
            />
          ))
        ) : (
          <p>No songs available.</p>
        )}
        {videos && videos.length > 0 ? (
          videos.map((item, index) => (
            <VideoCard
              key={index}
              title={item.name}
              artist={item.artistName}
              thumbnailUrl={item.thumbnailLink || ""}
              onClick={() => handleVideoClick(item)}
              onDelete={() => handleDeleteVideo(item.id)}
            />
          ))
        ) : (
          <p>No Video available.</p>
        )}
      </div>
      {renderDeleteConfirmation()}
      {selectedSongAudioUrl && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white">
          <SongsPlayer
            img={selectedSong.thumbnailLink || ""}
            title={selectedSong.name}
            artist={selectedSong.artistName}
            audioUrl={selectedSongAudioUrl}
          />
        </div>
      )}
      {showVideoPlayerModal && (
        <div>
          <VideoPlayerModal
           onClose={handleCloseVideoPlayerModal}
           assetUrl={videoUrl}/>
        </div>
      )}
      {isEditing && (
        <div className="fixed inset-0 z-10 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
          <EditPlaylist playlist={music} onClose={handleCloseEditModal} />
        </div>
      )}
             {showAddSongModal && (
        <AddSongModal
          open={showAddSongModal}
          onClose={handleCloseAddSongModal}
          playlistId={music.id}
          onSongAdded={handleSongAdded}
        />
      )}
 
      {showAddVideoModal && (
              <AddVideoModal
                open={showAddVideoModal}
                onClose={handleCloseAddVideoModal}
                playlistId={music.id}
                onSongAdded={handleVideoAdded}
              />
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
 
export default ViewPlaylist;
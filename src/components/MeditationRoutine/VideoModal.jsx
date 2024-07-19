import React, { useState, useEffect } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineClose,
} from "react-icons/ai";
import { Alert, Snackbar } from "@mui/material";
import rehabAPI from "../../utils/rehab";
 
const VideoPlayerModal = ({
onClose,
  assetUrl,
}) => {
 
  const handleGoBack = () => {
    onClose();
  };
 
  return (
    <div>
     
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-4 rounded-3xl w-[75vw] lg:w-[50vw] max-h-[95vh] overflow-auto relative">
            <div className="absolute top-0 right-0 m-4">
              <button onClick={handleGoBack}>
                <AiOutlineClose />
              </button>
            </div>
            <h1 className="text-2xl mb-2 font-bold text-center">Watch video</h1>
            <iframe
              src={assetUrl}
              title="Video Player"
              className="w-full h-[60vh] mt-4"
              allowFullScreen
            />
          </div>
        </div>
     
    </div>
  );
};
 
export default VideoPlayerModal;
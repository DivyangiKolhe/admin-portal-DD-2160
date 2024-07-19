import React, { useState } from 'react';
import EditTutorial from './EditTutorial';

const ViewTutorial = ({ tutorials, onDelete, onCloseModal }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditTutorial = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <div className="relative">
      {!showEditModal && (
        <div className="grid grid-cols-1 md:grid-cols-3 w-[95vw] lg:w-[80vw] h-[80vh] bg-white rounded-3xl overflow-hidden">
          <div className="col-span-1 md:col-span-2 flex items-center justify-center">
            {tutorials.assetType === 'video' ? (
              <video src={tutorials.assetLink} controls className="w-full h-full object-cover" />
            ) : (
              <audio src={tutorials.assetLink} controls className="w-full h-full" />
            )}
          </div>
          <div className="col-span-1 p-4 flex flex-col justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">{tutorials.name}</h2>
              <p className="text-gray-600 mb-4">{tutorials.description}</p>
              <p className="text-gray-500">Duration: {formatDuration(tutorials.duration)}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                onClick={() => onDelete(tutorials.id)}
              >
                Delete
              </button>
              <button
                className="bg-purple-500 text-white py-2 px-4 rounded-lg"
                onClick={onCloseModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                onClick={handleEditTutorial}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
          <EditTutorial tutorial={tutorials} onClose={handleCloseEditModal} />
        </div>
      )}
    </div>
  );
};

// Function to format the duration in a human-readable format
const formatDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default ViewTutorial;
import React from "react";
import { AiOutlineArrowLeft, AiOutlineClose, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

const TutorialPlayer = ({ tutorial, handleGoBack, handleEdit, handleDelete, handleClose }) => {
  const isVideo = tutorial.assetType === 'video';

  const renderPlayer = () => {
    const player = isVideo ? (
      <video controls className="w-full h-3/4 rounded-3xl">
        <source src={tutorial.assetLink} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <video controls className="w-full h-3/4 rounded-3xl">
        <source src={tutorial.assetLink} type="audio/mpeg" />
        Your browser does not support the audio element.
      </video>
    );

    return (
      <div className="relative h-[80vh] bg-purple-100 rounded-3xl">
        <div>
          {player}
        </div>
        <div className="p-4">
          {/* Tutorial title */}
          <h1 className="text-lg font-bold">{tutorial.name}</h1>
          {/* Tutorial description */}
          <p>{tutorial.description}</p>
        </div>
        <div className="absolute top-2 left-2">
          <button className="text-white bg-gray-500 p-2 rounded-3xl" onClick={handleGoBack}>
            <AiOutlineArrowLeft />
          </button>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <button className="text-white bg-blue-500 p-2 rounded-3xl" onClick={handleEdit}>
            <AiOutlineEdit />
          </button>
          <button className="text-white bg-red-500 p-2 rounded-3xl" onClick={handleDelete}>
            <AiOutlineDelete />
          </button>
          <button className="text-white bg-black p-2 rounded-3xl" onClick={handleClose}>
            <AiOutlineClose />
          </button>
        </div>
      </div>
    );
  };

  return <div>{renderPlayer()}</div>;
};

export default TutorialPlayer;

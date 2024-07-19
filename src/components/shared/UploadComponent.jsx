import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

const UploadComponent = ({ handleFileChange,inputId }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    handleFileChange(files);
  };

  return (
    <>
      <label
        htmlFor={inputId}
        className={`relative flex flex-col items-center justify-center bg-gray-100 border ${
          dragging ? 'border-blue-500' : 'border-dashed border-gray-300'
        } rounded-md p-4 cursor-pointer`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
        id={inputId}
          type="file"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
        />
        <AiOutlineCloudUpload className="w-12 h-12 mb-4 text-gray-400" />
        <span className="text-center">
          <span className="text-sm font-semibold">Choose File or Drag and Drop</span>
        </span>
      </label>
    </>
  );
};

export default UploadComponent;

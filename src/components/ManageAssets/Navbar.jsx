import React, { useEffect, useState } from 'react';
import { FaSearch, FaFileUpload, FaFolderPlus } from 'react-icons/fa';
// import Modal from '@mui/material/Modal';
// import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {

    return (
        <nav className="flex items-center justify-between p-4 bg-slate-700">
            {/* Left section */}
            <a href="/">
            <div className="flex items-center space-x-2">
                {/* Logo/Image */}
                {/* <img src="/path/to/your/logo.png" alt="Logo" className="h-8 w-auto" /> */}
                <span className="text-lg font-semibold italic text-white">Manastik S3 Management</span>
            </div>
            </a>

            {/* Center section */}
            <div className="flex items-center flex-1 justify-center">
                <div className="relative flex items-center w-full max-w-xs lg:max-w-md">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none -ml-8 lg:-ml-10">
                        <FaSearch />
                    </button>
                </div>
            </div>

            {/* Right section */}
            {/* <div className="hidden md:flex items-center space-x-4">
                <button onClick={handleOpenFile} className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none">
                    <FaFileUpload />
                    <span className="hidden md:inline">Upload a File</span>
                </button>
                <button onClick={handleOpenFolder} className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">
                    <FaFolderPlus />
                    <span className="hidden md:inline">Upload a Folder</span>
                </button>
            </div> */}
        </nav>
    );
};

export default Navbar;

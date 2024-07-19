import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdOutlineCancel } from "react-icons/md";
import { Tooltip } from '@mui/material';
import { useStateContext } from '../../contexts/ContextProvider';
import { AiFillHome } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import SubMenu from './Submenu';
import { SlSettings } from 'react-icons/sl';
import { HiOutlineLogout } from "react-icons/hi"
import { IoBriefcase, IoPieChartSharp } from "react-icons/io5";

const Menu = () => {
  const { activeMenu, setActiveMenu }=useStateContext();

  const activeLink="flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink="flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-gray-200 m-2";

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  // all the submenus come here
  const subMenusList = [
    {
      name: "dashboard",
      icon: IoPieChartSharp,
      menus: ["blogs","tutorials","teleconsultation","yoga", "medicine-reminder", "meditation-routine","music-therapy","exercises", "neurorehab", "brain-games", "cognitive-test", "stage-tracking", "caretaker-connect"],
    },
  ];

  return (
    <div className=' h-screen overflow-auto pb-10'>
      {activeMenu && (<>
        <div className="flex justify-between items-center pb-1 mb-4 bg-purple-100">
          <div className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
          <img
            src="https://s3.ap-south-1.amazonaws.com/adminportal.manastik.com/images/Manastiklogo.png"
            width={45}
            alt=""
          />
          <span className="text-2xl italic whitespace-pre">Manastik</span>
        </div>
          <Tooltip title="Menu" arrow>
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
            >
              <MdOutlineCancel />
            </button>
          </Tooltip>
        </div>
        <div className="flex flex-col">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-2 flex flex-col gap-1  font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100   md:h-[68%] h-[70%]">
            <li>
              <NavLink to={"/"} className="link">
                <AiFillHome size={23} className="min-w-max" />
                HomePage
              </NavLink>
            </li>
            <li>
              <NavLink to={"/users"} className="link">
                <FaUsers size={23} className="min-w-max" />
                Users
              </NavLink>
            </li>
            <li>
              <NavLink to={"/manage-assets"} className="link">
                <IoBriefcase size={23} className="min-w-max" />
                Manage Assets
              </NavLink>
            </li>

            {(activeMenu) && (
              <div className="border-y py-5 border-slate-300 ">
                <small className="pl-3 text-slate-500 inline-block mb-2">
                  Dashboard
                </small>
                {subMenusList?.map((menu) => (
                  <div key={menu.name} className="flex flex-col gap-1">
                    <SubMenu data={menu} />
                  </div>
                ))}
              </div>
            )}
            
            <li>
              <NavLink to={"/login"} className="link" onClick={()=>localStorage.removeItem("user")}>
                <HiOutlineLogout size={23} className="min-w-max" />
                Logout
              </NavLink>
            </li>
            <li>
              <NavLink to={"/settings"} className="link">
                <SlSettings size={23} className="min-w-max" />
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </>)}
    </div>
  )
}

export default Menu;
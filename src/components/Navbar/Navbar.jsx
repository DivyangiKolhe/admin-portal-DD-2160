import React from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import NavButton from './NavButton';
import { AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai';
import { RiNotification3Line } from 'react-icons/ri';
import { Tooltip } from '@mui/material';

const Navbar = () => {

  const { activeMenu, setActiveMenu }=useStateContext();

  return (
    <div className='flex justify-between p-2 md:px-4 relative bg-purple-100'>
      <NavButton title="Menu" customFunc={()=>setActiveMenu(!activeMenu)} color="purple" icon={<AiOutlineMenu className='block md:hidden' />} />
      {/* <div className="flex items-center bg-white border rounded-3xl px-3 py-2 text-sm text-slate-700 font-bold">
                        <input
                            type="text"
                            className="w-full focus:outline-none ml-2"
                            placeholder="Search"
                        />
                        <button className="text-gray-500">
                            <AiOutlineSearch />
                        </button>
                    </div> */}
      <div className='flex'>
      <NavButton title="Notification" dotColor="purple" customFunc={() => handleClick('notification')} color="purple" icon={<RiNotification3Line />} />
      <Tooltip title="Profile" arrow>
        <div className='flex items-center gap-2 cursor-pointer p-1 hover:bg-purple-300 rounded-lg' onClick={()=>handleClick('userProfile')}>
        <img src="https://www.manastik.com/wp-content/uploads/2023/09/Manastik-logo.svg" alt="user-profile"  className="rounded-full w-8 h-8"/>
        </div>
      </Tooltip>
      </div>
    </div>
  )
}

export default Navbar;
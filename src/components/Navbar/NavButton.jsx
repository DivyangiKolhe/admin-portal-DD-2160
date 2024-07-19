import { Tooltip } from '@mui/material';
import React from 'react'

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
     <Tooltip title={title} arrow>
      <button
        type="button"
        onClick={() => customFunc()}
        style={{ color }}
        className="relative text-xl rounded-full p-3 hover:bg-light-gray"
      >
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
        {icon}
      </button>
   </Tooltip>
  );

export default NavButton;
import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState={
    notification: false,
    userProfile: false
};

export const ContextProvider=({children})=>
{
    const [activeMenu,setActiveMenu]=useState(true);
    // console.log(activeMenu);

    return <StateContext.Provider value={{ activeMenu, setActiveMenu }}>
        {children}
    </StateContext.Provider>;
}

export const useStateContext=()=>useContext(StateContext);
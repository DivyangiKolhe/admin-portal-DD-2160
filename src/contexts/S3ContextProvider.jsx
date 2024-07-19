import React, { createContext, useContext, useState } from "react";

const S3Context=createContext();

export const S3ContextProvider=({children})=>
{
    const [objects,setObjects]=useState([]);
    const [prefix,setPrefix]=useState('');
    const [loading, setLoading] = useState(false);

    const values={
        objects,
        setObjects,
        prefix,
        setPrefix,
        loading,
    };

    return <S3Context.Provider value={values}>
        {children}
    </S3Context.Provider>;
};

export const useS3Context=()=>useContext(S3Context);
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import S3Management from '../../components/ManageAssets/S3Management';

const ManageAssets = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let fullPath = location.state?.fullPath;

    return (
        <>
            <S3Management />
        </>
    );
};

export default ManageAssets;

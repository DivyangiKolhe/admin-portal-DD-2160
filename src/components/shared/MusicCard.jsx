import React from 'react';
import { Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';

const MusicCard = ({ title, img, desc, onDeleteClick }) => {

    const handleDeleteClick = () => {
        onDeleteClick();
    };

    return (
        <Card className='w-[250px] min-h-[220px] rounded-xl'>
            <CardMedia
                component="img"
                src={img}
                alt=""
                className='h-24 object-cover rounded-t-lg'
            />
            <CardContent>
                <div className='text-lg font-extrabold'>{title}</div>
                <div className='flex flex-col text-sm'>
                    {desc}
                </div>
                <div className='flex w-full justify-end'>
                <IconButton onClick={handleDeleteClick}>
                    <AiFillDelete />
                </IconButton>
                </div>
            </CardContent>
        </Card>
    )
}

export default MusicCard;
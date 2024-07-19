import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MusicCard from '../shared/MusicCard';
import { Card } from '@mui/material';
import { AiFillPlusCircle } from 'react-icons/ai';
import api from '../../utils/api';

const Exercises = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [exercisesLoading, setExercisesLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user || !user.authToken) {
                    // If authToken is not available, handle it accordingly (e.g., redirect or set an error state)
                    // console.log('User or authToken not available');
                    return;
                }

                const authTokenUser = user.authToken;

                const response = await api.get(`/meditation-routines/exercises`, {
                    headers: { Authorization: `Bearer ${authTokenUser}` }
                });

                setExercises(response.data.data.exercisePlaylists);
                setExercisesLoading(false);
            } catch (error) {
                console.error("Error fetching exercises:", error);
            }
            finally
            {
                setExercisesLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <div className='flex flex-col gap-4 px-8 py-4 border rounded-lg'>
            <div className='title text-lg text-purple-900 font-extrabold'>Exercises</div>
            <div className='flex flex-wrap gap-4 max-h-[50vh] overflow-auto py-4'>
                {exercises.length > 0 ?
                    exercises.map((item) => (
                        <MusicCard key={item.id} title={item.assetsType} img={item.exerciseThumbnail} desc={item.exerciseType} />
                    )) :
                    (exercisesLoading ? <p>loading...</p> : <p></p>)}
            <Card className='w-[250px] min-h-[220px] rounded-2xl text-6xl flex justify-center items-center'>
                <span className='text-slate-400'><AiFillPlusCircle /></span>
            </Card>
            </div>
        </div>
    )
}

export default Exercises;
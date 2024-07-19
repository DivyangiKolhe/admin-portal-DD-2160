import React, { useEffect, useRef } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { moods } from "../shared/data";
import { Chart } from 'chart.js';

const MoodFrequency = () => {

    const pieChartRef = useRef(null);

    return (
        <div className='allMoods flex flex-col gap-4 px-4 md:px-8 py-4 border rounded-lg'>
            <div className='title text-lg text-purple-900 font-extrabold'>Mood Frequency</div>
            <div className='flex flex-row gap-2'>
                <div className="chart grid grid-cols-1 md:grid-cols-2">
                <canvas ref={pieChartRef} className='w-24 hidden md:block'></canvas>
                
                </div>
                <div className='cards grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
                    {moods.map(item => (
                        <div key={item.id} className="card w-[75px] h-[75px] flex flex-col justify-center items-center text-xl border border-lg rounded-lg" style={{ backgroundColor: item.color }}>
                            {item.title}
                            <span className='text-xs'>{item.content}</span>
                        </div>))}
                </div>
            </div>

        </div>
    )
}

export default MoodFrequency;
import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { moods } from "../shared/data";

const AllMoods = () => {

  return (
    <div className='allMoods flex flex-col gap-4 px-4 md:px-8 py-4 border rounded-lg'>
      <div className='title text-lg text-purple-900 font-extrabold'>All Moods</div>
      <div className='cards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4'>
        {moods.map(item => (
          <div key={item.id} className="card w-[75px] h-[75px] flex flex-col justify-center items-center text-xl border border-lg rounded-lg">
            {item.title}
            <span className='text-xs'>{item.content}</span>
          </div>))}
          <div  className="card w-[75px] h-[75px] flex flex-col justify-center items-center text-2xl border border-lg rounded-lg">
            {<AiFillPlusCircle />}
            <span className='text-xs'>{}</span>
          </div>
      </div>
    </div>
  )
}

export default AllMoods;
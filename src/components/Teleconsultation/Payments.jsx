import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Payments = ({doctor}) => {
  const [selectedTab, setSelectedTab] = useState('doctor');
//   const [doneChecked, setDoneChecked] = useState(false);
//   const [pendingChecked, setPendingChecked] = useState(false);
//   const [requestedChecked, setRequestedChecked] = useState(false);

const navigate=useNavigate();
const [payouts,setPayouts]=useState([]);

useEffect(()=>
{
  const fetchPayouts=async ()=>
  {
    try
    {
      const { authToken }=JSON.parse(localStorage.getItem("user"));

      if(!authToken)
      {
        navigate('/login');
        return ;
      }

      if(!doctor)
      {
        console.log("No doctor selected");
        return ;
      }

      const response=await api.get(`/appointments/requested-payouts`,{
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data.data.requestedPayouts);

      setPayouts(response.data.data.requestedPayouts);
    }
    catch(error)
    {
      console.error("Error fetching payouts for doctor",error);
    }
  }

  fetchPayouts();
},[doctor]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  let tabContent = '';

  switch (selectedTab) {
    case 'doctor':
      tabContent = 'Doctor Information';
      break;
    case 'nurse':
      tabContent = 'Nurse Information';
      break;
    case 'surgeon':
      tabContent = 'Surgeon Information';
      break;
    default:
      tabContent = '';
  }

//   const handleDoneChange = (event) => {
//     setDoneChecked(event.target.checked);
//   };

//   const handlePendingChange = (event) => {
//     setPendingChecked(event.target.checked);
//   };

//   const handleRequestedChange = (event) => {
//     setRequestedChecked(event.target.checked);
//   };

  return (
    <div className="-mt-6">
      <div className="w-full">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="payments tabs example"
        >
          <Tab label="Type1" value="doctor" />
          <Tab label="Type2" value="nurse" />
          <Tab label="Type3" value="surgeon" />
        </Tabs>
      </div>
      {/* <div className="my-2 flex gap-4 items-center justify-center w-full">
        <div className='flex items-center justify-center'>
        <Checkbox
          checked={doneChecked}
          onChange={handleDoneChange}
          inputProps={{ 'aria-label': 'Done' }}
        />
        <label htmlFor="done" className='text-sm text-purple-900'>Done</label>
        </div>
        <br />
        <div className='flex items-center justify-center'>
        <Checkbox
          checked={pendingChecked}
          onChange={handlePendingChange}
          inputProps={{ 'aria-label': 'Pending' }}
        />
        <label htmlFor="pending" className='text-sm text-purple-900'>Pending</label>
        </div>
        <br />
        <div className='flex items-center justify-center'>
        <Checkbox
          checked={requestedChecked}
          onChange={handleRequestedChange}
          inputProps={{ 'aria-label': 'Requested' }}
        />
        <label htmlFor="requested" className='text-sm text-purple-900'>Requested</label>
        </div>
      </div> */}
      <div className="mt-4">
        <h2>{tabContent}</h2>
      </div>
    </div>
  );
};

export default Payments;

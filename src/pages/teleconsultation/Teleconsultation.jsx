import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Appointments from '../../components/Teleconsultation/Appointments';
import Payments from '../../components/Teleconsultation/Payments';
import CognitiveTestReports from '../../components/Teleconsultation/CognitiveTestReports';
import Prescriptions from '../../components/Teleconsultation/Prescriptions';
import { Avatar, Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FaAngleDown, FaUser } from 'react-icons/fa';

const Teleconsultation = () => {

  const navigate=useNavigate();

  const [doctors,setDoctors]=useState([]);
  const [selectedDoctor,setSelectedDoctor]=useState(null);
  const [selectedTab, setSelectedTab] = useState('Appointments');

  useEffect(()=>
  {
    const fetchDoctors=async ()=>
    {
      try
      {
        const { authToken }=JSON.parse(localStorage.getItem("user"));

        if(!authToken)
        {
          navigate('/login');
          return ;
        }

        const response=await api.get("/all-doctors",{
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // console.log(response.data.data.data);

        setDoctors(response.data.data.data);
      }
      catch(error)
      {
        console.error("Error fetching doctors data:",error);
      }
    }

    fetchDoctors();
  },[]);

  const renderComponent = () => {
    switch (selectedTab) {
      case 'Appointments':
        return <Appointments doctor={selectedDoctor}/>;
      case 'Payments':
        return <Payments doctor={selectedDoctor}/>;
      case 'Cognitive Test Reports':
        return <CognitiveTestReports doctor={selectedDoctor}/>;
      case 'Prescriptions':
        return <Prescriptions doctor={selectedDoctor}/>;
      default:
        return null;
    }
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSelectDoctor=(event)=>
  {
    // console.log(event.target.value);
    setSelectedDoctor(event.target.value);
  }

  return (
    <div className="flex flex-col items-start p-4">
      {/* dropdown for doctors */}
    <Box sx={{ minWidth: '20%', }}>
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">Select a Doctor</InputLabel>
    <Select
      value={selectedDoctor || ''}
      onChange={handleSelectDoctor}
      label="Select a Doctor"
      sx={{ height: '55px' }}
      renderValue={() => (
        <Box display="flex" alignItems="center">
          {selectedDoctor.avatar && (
            <Avatar src={selectedDoctor?.avatar} alt={`Avatar of ${selectedDoctor.name}`} />
          )}
          <span style={{ marginLeft: '10px' }}>{selectedDoctor.name}</span>
        </Box>
      )}
    >
      {doctors.length>0 && doctors.map((doctor) => (
        <MenuItem key={doctor.userId} value={doctor}>
        <Avatar src={doctor.avatar} alt={`Avatar of ${doctor.name}`} />
        <span style={{ marginLeft: '10px' }}>{doctor.name}</span>
      </MenuItem>
      ))}
    </Select>
    </FormControl>
    </Box>
    <div className='flex flex-col items-center w-full'>
      <Box sx={{ width: '80%' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="navbar tabs example"
          variant="fullWidth"
        >
          <Tab label="Appointments" value="Appointments" />
          <Tab label="Payments" value="Payments" />
          <Tab label="Cognitive Test Reports" value="Cognitive Test Reports" />
          <Tab label="Prescriptions" value="Prescriptions" />
        </Tabs>
      </Box>
      <div className="mt-8">{renderComponent()}</div>
      </div>
    </div>
  )
}

export default Teleconsultation
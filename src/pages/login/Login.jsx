import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PiEyeDuotone, PiEyeSlashDuotone } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import api from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage(''); // Clear any previous success message

    try {
      const response = await api.post('/admins/login', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        setSuccessMessage('Login successful');
        navigate('/', { replace: true });
      } else {
        const data = response.data;
        setError(data.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <div className='w-full h-screen flex items-start'>
      <div className='w-full lg:w-1/2  h-full bg-[#ffffff] flex flex-col p-14 justify-between'>
        <a href="/" className='flex flex-col justify-center items-center'>
          <div className='w-full flex items-center justify-center mb-4'>
            <img src="https://s3.ap-south-1.amazonaws.com/adminportal.manastik.com/images/Manastiklogo.png" alt="Company Logo" className="w-10 h-10 mr-2" />
            <h1 className='text-4xl text-[#060606] font-semibold'>Manastik</h1>
          </div>
          <div className='text-2xl'>v1.2</div>
        </a>
        <div className='w-full flex flex-col max-w-[550px] mx-auto'>
          <div className='w-full flex flex-col mb-2'>
            <h3 className='text-2xl font-semibold mb-1'>Login</h3>
            <p className='text-sm mb-2'>Welcome Back! Please enter your details.</p>
          </div>
          <div className='w-full flex flex-col gap-2'>
            <TextField id="email" label="Email" variant="standard" type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField
              name="password"
              label="Password"
              variant="standard"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} >
                      {showPassword ? <PiEyeDuotone /> : <PiEyeSlashDuotone />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className='w-full flex justify-between items-center my-2'>
            <FormControlLabel control={<Checkbox />} label="Remember Me" />
            <p className='text-sm cursor-pointer font-bold underline underline-offset-2'>Forgot Password?</p>
          </div>
          <div className='w-full flex flex-col my-4'>
            <button
              className='w-full text-white font-bold bg-[#885fa0] rounded-md p-4 text-center flex items-center justify-center hover:bg-[#6a4a7d] transition duration-300 ease-in-out'
              onClick={handleClick}
            >
              {loading ? <CircularProgress color='inherit' /> : "Login"}
            </button>
          </div>
        </div>
        <div className='w-full flex items-center justify-center'>
          <p className='text-[#060606]'>Visit the Website! <span className='font-semibold underline underline-offset-2'><a href="https://www.manastik.com/">Here</a></span></p>
        </div>
      </div>
      <div className='w-full lg:w-1/2 lg:flex hidden h-full '>
        <img src="https://s3.ap-south-1.amazonaws.com/adminportal.manastik.com/images/Rectangle+6065.png" alt="logo" className='w-full h-full object-cover' />
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert
          severity={error ? 'error' : 'success'}
          onClose={() => setSnackbarOpen(false)}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Login;
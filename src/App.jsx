import './App.css';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/login/Login';
import DashboardLayout from './components/Layouts/DashboardLayout'; // contains the layout of main dash like sidebar, navbar, footer
import MeditationRoutine from './pages/dashboard/meditation-routine/MeditationRoutine';
import Home from './pages/home/Home';
import { useEffect } from 'react';
import ViewBlog from './components/MeditationRoutine/ViewBlog';
import BlogsMaster from './pages/dashboard/blogsMaster/BlogsMaster';
import TutorialsMaster from './pages/dashboard/tutorialsMaster/TutorialsMaster';
import MusicMaster from './pages/dashboard/music-therapy/music-therapy';
import ViewPlaylist from './components/MusicTherapy/ViewPlaylist';
import ManageAssets from './pages/manage-assets/ManageAssets';
import CreateFolder from './components/ManageAssets/CreateFolder';
import UploadFile from './components/ManageAssets/UploadFile';
import Teleconsultation from './pages/teleconsultation/Teleconsultation';
import YogaMaster from './pages/dashboard/yogaMaster/YogaMaster';
import MusicTherapy from './pages/dashboard/music-therapy/music-therapy';
import Exercises from './pages/dashboard/exercisesMaster/Excercises';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('user');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path='/login' exact element={<Login />} />
        <Route path='/' element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path='dashboard/'>
            <Route path='meditation-routine/' element={<MeditationRoutine />} />
            <Route path='blogs/' element={<BlogsMaster />} />
            <Route path='tutorials/' element={<TutorialsMaster />} />
            <Route path='music-therapy/' element={<MusicTherapy/>} />
            <Route path='music/playlist/:playlistId/' element={<ViewPlaylist />} />
            <Route path='teleconsultation/' element={<Teleconsultation />} />
            <Route path='yoga/' element={<YogaMaster />} />
            <Route path='exercises' element={<Exercises />} />
          </Route>
          <Route path='manage-assets/' element={<ManageAssets />} />
          <Route path='manage-assets/upload' element={<UploadFile />} />
          <Route path='manage-assets/create-folder' element={<CreateFolder />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;

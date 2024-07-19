import React from 'react';
import Navbar from '../Navbar/Navbar';
import Menu from '../Menu/Menu';
import { Outlet } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import Footer from '../Footer/Footer';

const DashboardLayout = () => {
    const { activeMenu } = useStateContext();

    return (
        <div className='flex'>
            {activeMenu ? (
                <div className="w-80 fixed sidebar bg-white ">
                    <Menu />
                </div>
            ) : (
                <div className="w-0">
                    <Menu />
                </div>
            )}
                <div className={ activeMenu?'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-80 w-full': 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '}>
                    <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                        <Navbar />
                    </div>
                    <div className='pt-16 md:pt-0'>
                        {/* theme */}
                        {<Outlet />}
                    </div>
                    {/* <Footer /> */}
                </div>
            
        </div>
    );
}

export default DashboardLayout;
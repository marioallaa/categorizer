import React from 'react';
import { AppBar, Toolbar, Button, Box,  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../fire/init';
// import { useAuth } from '../hooks/useAuth'; // Custom hook to manage authentication state

function Header() {
  const navigate = useNavigate();
  // const { user, logout } = useAuth(); // Assume this hook provides auth state and logout function

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="fixed" sx={{ top: 12, left: 45, right: 45, borderRadius: '100px', width: 'auto',
      backdropFilter: 'blur(5px)',
      background: 'linear-gradient(to right, rgba(0, 19, 200, 0.75), rgba(96, 136, 245, 0.75))'
    }}>
      <Toolbar>
        <Box  sx={{ flexGrow: 20, display: 'flex', justifyContent: 'start' }}>
          <Button>
            <img style={{height: '50px'}} alt='logo'  onClick={() => handleNavigation('/')} src='/logo-w.png' />
          </Button>
        </Box>
        {/* <Button variant='text' sx={{ flexGrow: 1, color: '#f4ebd0', fontWeight: 600, letterSpacing: 1.5 }}  onClick={() => handleNavigation('/')}>Dashboard</Button>  */}
        {/* <Button variant='text' sx={{ flexGrow: 1, color: '#f4ebd0', fontWeight: 600, letterSpacing: 1.5 }} onClick={() => handleNavigation('/new')}>New</Button> */}
        {/* <Button variant='text' sx={{ flexGrow: 1, color: '#f4ebd0', fontWeight: 600, letterSpacing: 1.5 }} onClick={() => handleNavigation('/settings')}>Settings</Button> */}
        {/* <Button variant='text' sx={{ flexGrow: 1, color: '#f4ebd0', fontWeight: 600, letterSpacing: 1.5 }} onClick={() => handleNavigation('/settings')}>Buy Credits</Button> */}
        <Button variant='text' sx={{ flexGrow: 1, color: '#f4ebd0', fontWeight: 600, letterSpacing: 1.5 }} onClick={() => {auth.signOut(); handleNavigation('/')}}>Sign Out</Button>
        
      </Toolbar>
    </AppBar>
  );
}

export default Header;

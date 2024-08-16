import React from 'react';
import { Box, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      position="fixed"
      sx={{
        bottom: 0,
        left: 0,
        right: 0,
        backdropFilter: 'blur(5px)',
        backgroundColor: '#rgb(171, 164, 144, 0.75)',
        color: '#000a0e',
        height: '60px',
        boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.2)', // Shadow on top
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="md" sx={{display: 'flex', flexDirection: 'column'}}>
        <Typography variant="body1" sx={{fontWeight: '600'}} align="center">
          © 2024 categorizer. All rights reserved.
        </Typography>
        <Typography variant="" sx={{fontWeight: '100'}} align="center">
           Roseworth Limited Reg. No. 1432832
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;

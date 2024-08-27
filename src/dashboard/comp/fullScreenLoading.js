import React from 'react';
import { Grid, Typography, Box } from '@mui/material';

const FullScreenLoader= ({ loading }) => {
  if (!loading) return null;
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(244, 235, 208, 0.4)', 
        backdropFilter: 'blur(5px)', // Background blur effect
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300, // Ensure it appears above other content
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <img src="/loading.gif" alt="Loading Gif" style={{ width: '' }} />
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              fontWeight: '100',
              fontStyle: 'italic',
              marginTop: 2,
            }}
          >
            Please wait while your data is being processed
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FullScreenLoader;

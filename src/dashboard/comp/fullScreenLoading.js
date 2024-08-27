import React, { useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';

const FullScreenLoader= ({ loading }) => {


  const [quote, setQuote] = React.useState();


  const fetchQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/quotes/random');
      const data = await response.json();
      setQuote(data[0]);
      console.log(data[0])
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  useEffect(() => {
    if (loading) {
      fetchQuote();

      // Set up an interval to fetch a new quote every minute
      const intervalId = setInterval(fetchQuote, 60000);

      // Clean up the interval on component unmount
      return () => {
        clearInterval(intervalId);
      };
      
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

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
      <Grid container justifyContent="center" sx={{display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}} alignItems="center">
        <Grid item>
          <Typography
            variant="body1"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center', 
              alignItems: 'center',
              textAlign: 'center',
              fontWeight: '100',
              fontStyle: 'italic',
            }}
          >
            Please wait while your data is being processed
            
          <img src="/loading.gif" alt="Loading Gif" style={{maxWidth: '350px'}} />
          </Typography>
          
          <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                fontWeight: '800',
                marginTop: 2,
              }}
            >
             {quote && quote.content ? `"${quote.content}"` : null}
          </Typography>
          <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                fontWeight: '100',
                fontStyle: 'italic',
                letterSpacing: '2px',
                marginBottom: 2,
              }}
            >
             {quote && quote.author ? `~ ${quote.author}` : null}
          </Typography>
          
        </Grid>
      </Grid>
    </Box>
  );
};

export default FullScreenLoader;

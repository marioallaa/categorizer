import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, LinearProgress } from '@mui/material';

const FullScreenLoader = ({ loading, setLoading, rows }) => {
  const [quote, setQuote] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/quotes/random');
      const data = await response.json();
      setQuote(data[0]);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  useEffect(() => {
    if (loading) {
      fetchQuote();

      // Set up an interval to fetch a new quote every minute
      const intervalId = setInterval(fetchQuote, 6000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading]);



  useEffect(() => {
    console.log('rows:', rows);

    if (loading) {
      // Reset the batch and progress when loading starts
      setCurrentBatch(0);
      setProgress(0);
     
      if ( rows > 0) {
        const totalBatches = Math.ceil(rows / 10);
        setTotalBatches(totalBatches);

        const batchInterval = setInterval(() => {
          setCurrentBatch((prevBatch) => {
            const newBatch = prevBatch + 1;
            setProgress((newBatch / totalBatches) * 100);

            if (newBatch >= totalBatches) {
              clearInterval(batchInterval);
              setLoading(false);
            }

            return newBatch;
          });
        }, 10000);

      }
    }
      
  }, [loading, rows, setLoading]);

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(244, 235, 208, 0.4)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Typography
            variant="body1"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontWeight: '100',
              fontStyle: 'italic',
            }}
          >
            Please wait while your transactions are being categorized
            <img src="/loading.gif" alt="Loading Gif" style={{ maxWidth: '350px' }} />
          </Typography>

          <Typography
            variant="h5"
            sx={{
              maxWidth: '600px',
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

          {rows && rows > 0 && (
            <Box sx={{ width: '100%', marginTop: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography
                variant="body2"
                sx={{ textAlign: 'center', marginTop: 1 }}
              >
                Categorizing partition {currentBatch} of {totalBatches}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FullScreenLoader;

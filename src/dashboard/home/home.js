import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, Container } from '@mui/material';
import { auth } from '../../fire/init';
import getUserName from '../../fire/getName';
import CsvUploader from './csvUploader';

function Home() {

  const [name, setName] = useState('')

  useEffect(() => {
    const getName =  async function  ()   {
      const uid =  auth.currentUser.uid
      if (uid) {
        const name = await getUserName(uid)
        if (name) {
          setName(name)
        }
      }
    }
    getName()
  }, [])



  return (
    <Container
      maxWidth="lg"
      sx={{
        maxWidth: 'lg',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 150px)', 
        py: '100px' 
      }}
    >
      <Grid container direction={'column'} m={1} spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <Typography variant="h5" gutterBottom sx={{textAlign: 'center', fontWeight: '400'}}>
              {name ? `${name}'s` : ""} Dashboard
            </Typography>
            <Grid container item md={12}>

              <Grid item md={4} direction={'column'} sx={{display: 'flex', justifyContent: 'center'}}>
                <Typography variant="h2"  sx={{textAlign: 'center', fontWeight: '800', color: 'rgba(0, 19, 200, 0.85)'}}>
                  43
                </Typography>
                <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                  Credits Remaining
                </Typography>
              </Grid>


              <Grid item md={4} direction={'column'}>
                <Typography variant="h2"  sx={{textAlign: 'center', fontWeight: '800', color: 'rgba(0, 19, 200, 0.85)'}}>
                  134
                </Typography>
                <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                  Files Processed
                </Typography>
              </Grid>



              <Grid item md={4} direction={'column'}>
                <Typography variant="h2"  sx={{textAlign: 'center', fontWeight: '800', color: 'rgba(0, 19, 200, 0.85)'}}>
                  43,233
                </Typography>
                <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                  Transactions Processed
                </Typography>
              </Grid>



            </Grid>

          </Box>
        </Grid>

       <CsvUploader />
        
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: 3, 
              color: '#636363'
            }}
          >
            
            <Typography variant="body1">
              This is a simple bank transaction categorization tool for accounting purposes, it facilitates the accounts and VAT computations by giving you a starting point from which you adjust and make the necessary changes deppending on the clinet. 
            </Typography>
            <Typography variant="body1">
              In order to use this service, all you need to do is drop the CSV bank statement as downloaded from any of the major banks in the uk, match the columns, and see the magic happen. 
            </Typography>
          </Box>
        </Grid>

      </Grid>
    </Container>
  );
}

export default Home;

import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, Container, IconButton, } from '@mui/material';
import { auth } from '../../fire/init';
import getUserNameAndHistory from '../../fire/getName';
import CsvUploader from './csvUploader';
import { Visibility } from '@mui/icons-material';


import { useNavigate } from "react-router-dom"; 
import { formatDate } from '../csv/util';
function Home() {

  const [name, setName] = useState('')
  const [clients, setClients] = useState([])
  const [wpfCount, setWpfCount] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    const getName =  async function  ()   {
      const uid =  auth.currentUser.uid
      if (uid) {
        const u = await getUserNameAndHistory(uid)
        console.log(u)
        if (u) {
          setName(u.name)
          if (u.clients && u.clients.length > 0) {
            setClients(u.clients)
            let wpf = Number(0);
            u.clients.forEach(client => {
              if (client.wpf && client.wpf.length > 0) {
                const c = Number(client.wpf.length); // Ensure c is treated as a number
                wpf += c;
                setWpfCount(wpf);
              }
            });
          }
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
                  {clients.length}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                  Clients
                </Typography>
              </Grid>


              <Grid item md={4} direction={'column'}>
                <Typography variant="h2"  sx={{textAlign: 'center', fontWeight: '800', color: 'rgba(0, 19, 200, 0.85)'}}>
                  {wpfCount}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                  WPFs
                </Typography>
              </Grid>



              <Grid item md={4} direction={'column'}>
                <Typography variant="h2"  sx={{textAlign: 'center', fontWeight: '800', color: 'rgba(0, 19, 200, 0.85)'}}>
                  -
                </Typography>
                <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                  Free Tier
                </Typography>
              </Grid>



            </Grid>

          </Box>
        </Grid>

       <CsvUploader />




       <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h6" gutterBottom sx={{textAlign: 'start', fontWeight: '200'}}>
              Clients 
            </Typography>
            <Grid container item md={12}>
              {clients.length > 0 ? (
                clients.map((client, index) => (
                <Box key={index} sx={{ marginBottom: 2, boxShadow: 3, 
                  borderRadius: 2, backgroundColor: '#ffffff', padding: 2, width: '100%'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={11}>
                          <Typography variant="h6" fontWeight="bold">
                              {client.name || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: '100'}}>
                              {client.name || 'N/A'}  · {client.industry || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={11}>
                          <Typography variant="body2" fontWeight="thin" sx={{fontStyle: 'italic', letterSpacing: 1}}>
                              Working Paper Files
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Grid container spacing={2}>
                            {client.wpf && client.wpf.length > 0 ? 
                            client.wpf.map((wpf, i) => (
                            <Grid container item xs={6}>
                              <Grid xs={12} container direction={'row'} 
                                onClick={() => { localStorage.setItem('currentTrId', wpf.transformationId); navigate('/categorize')}}
                                sx={{border: '1px dashed lightgrey', borderRadius: '16px', p: '8px',  boxShadow: '0px 0px 2px rgba(0, 0, 256, 0.4)', backgroundColor: 'rgba(0, 0, 150, 0.02)' }}>
                                <Grid item xs={2} sm={1} key={i} direction={'column'} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                  <img src='/folder.png' alt='folder' style={{width: '50px', height: '50px'}}
                                    onClick={() => { localStorage.setItem('currentTrId', wpf.transformationId); navigate('/categorize')}} />
                                </Grid>
                                <Grid item xs={9} sm={10} key={i} direction={'column'}  sx={{display: 'flex', justifyContent: 'center', paddingLeft: '8px'}}>
                                  <Typography variant="body2" sx={{ fontWeight: '800', textAlign: 'start'}}>
                                      {wpf.title}  · {wpf.purpose}
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: '200', color: '#002EBA'}}>
                                      Created At {formatDate(wpf.createdAt)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={1} sm={1} sx={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                                  <IconButton
                                    color="primary"
                                    onClick={() => { localStorage.setItem('currentTrId', wpf.transformationId); navigate('/categorize')}}>
                                    <Visibility />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Grid>
                            )) : (
                              <Grid item xs={12} sm={11}>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: '100'}}>
                                    No working paper files yet
                                </Typography>
                              </Grid>
                            )}
                       
                          </Grid>
                        </Grid>
                    </Grid>
                  </Box>
                ))
                ) : (
                  <Box sx={{ boxShadow: 3, 
                    borderRadius: 2, backgroundColor: '#ffffff', padding: 2  , width: '100%'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={11}>
                          <Typography variant="body2" fontWeight="bold">
                              You Currently Do not have any clients
                          </Typography>
                        </Grid>
                    </Grid>
                  </Box>
                )}
            </Grid>
        </Grid>

        
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

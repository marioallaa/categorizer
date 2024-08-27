import React from 'react';
import { Grid, Typography, Box, Container, IconButton, } from '@mui/material';


import ExcelUploader from './excel_uploader';


function ExcelMerger() {


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
              Accounts & VAT Merger
            </Typography>
            <Grid container item md={12}>


            </Grid>

          </Box>
        </Grid>



       <ExcelUploader />




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

export default ExcelMerger;

import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

const BankStatementOverview = ({ overview }) => {
  return (
    <>
    
    
    <Typography variant="body1" gutterBottom sx={{textAlign: 'start', fontWeight: '100', fontStyle: 'italic'}}>
      Statement Overview
    </Typography>
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Grid container direction={'row'} md={12}>
        <Grid item md={4} xs={6} direction={'column'} sx={{display: 'flex', justifyContent: 'center'}}>
          <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '800'}}>
            {overview.totalRows.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
            Transactions
          </Typography>
        </Grid>
        <Grid item md={4} xs={6} direction={'column'}>
          <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '800'}}>
            £ {overview.totalMoneyOut.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
            F3-2
          </Typography>
        </Grid>
        <Grid item md={4} xs={6} direction={'column'}>
          <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '800'}}>
            £ {overview.totalMoneyIn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
            F3-1
          </Typography>
        </Grid>
        {/* <Grid item md={3} xs={6} direction={'column'}>
          <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '800'}}>
            {overview.creditsRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
            Credits Required
          </Typography>
        </Grid> */}
        <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="body1" gutterBottom sx={{textAlign: 'center', fontWeight: '100', fontStyle: 'italic'}}>
            Double check the above figures before proceeding. F3-1 should be money in, F3-2 should be money out.
          </Typography>
        </Grid>
      </Grid>
    </Box>
    
    </>
  );
};

export default BankStatementOverview;

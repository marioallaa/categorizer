import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  IconButton,
  Autocomplete,
  TextField,
  Button,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import ExcelMapper from '../excel/processor';
import { customCategorizer } from './util';
import { toast } from 'react-toastify';
import FullScreenLoader from '../comp/fullScreenLoading';

const ClientSelection = ({ 
  csvFiles,
  clients, 
  selectedClient, 
  setClientTemp, 
  setOpenConfDial, 
  setCreateNewClient, 
  setTransformedData, 
  assignedClientFile, 
  setUpdate,
}) => {

    const [showExcel, setShowExcel] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const MoneyInFile = csvFiles.find(file => file.filename === 'cat_money_in.csv');
    const MoneyOutFile = csvFiles.find(file => file.filename === 'cat_money_out.csv');

    React.useEffect(() => {
        if (MoneyInFile && MoneyInFile.parsedData?.length > 0 && MoneyOutFile && MoneyOutFile.parsedData?.length) {
            setShowExcel(true);
        }
    }, [MoneyInFile, MoneyOutFile]);

    
    const hasTrainingData = csvFiles.find(file => file.filename === 'TRAINING_DATA_F31.csv') 
        && csvFiles.find(file => file.filename === 'TRAINING_DATA_F32.csv');

    
return (
    <Grid container direction={'row'} md={12} sx={{minHeight: '100px'}}>
        {assignedClientFile ? (
            <>
                <Grid item md={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <FormControl fullWidth sx={{ marginBottom: '16px', marginTop: '32px' }}>
                     
                        {hasTrainingData ? <Box sx={{border: '1px dashed lightgrey', borderRadius: '16px', p: '8px',  boxShadow: 'inset 0px 0px 5px rgba(0, 0, 0, 0.3)', backgroundColor: 'rgba(0, 0, 0, 0.01)' }}>
                            <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '200'}}>
                                    Custom AI Model Training
                            </Typography>
                            <Grid container direction={'row'} md={12}>
                                <Grid item md={3} xs={6} direction={'column'} sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Typography variant="h5" sx={{textAlign: 'center', fontWeight: '400'}}>
                                            {csvFiles.find(file => file.filename === 'TRAINING_DATA_F32.csv')?.parsedData?.length?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                                            F3-2 Training Data
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={6} direction={'column'}>
                                    <Typography variant="h6" sx={{textAlign: 'center', fontWeight: '400'}}>
                                            {csvFiles.find(file => file.filename === 'money_out.csv')?.parsedData?.length?.toLocaleString(undefined, { minimumFractionDigits:0, maximumFractionDigits: 0 })}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                                            F3-2 New Data
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={6} direction={'column'}>
                                    <Typography variant="h6" sx={{textAlign: 'center', fontWeight: '400'}}>
                                            {csvFiles.find(file => file.filename === 'TRAINING_DATA_F31.csv')?.parsedData?.length?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                                            F3-1 Training Data
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={6} direction={'column'}>
                                    <Typography variant="h6" sx={{textAlign: 'center', fontWeight: '400'}}>
                                            {csvFiles.find(file => file.filename === 'money_in.csv')?.parsedData?.length?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                                            F3-1 New Data
                                    </Typography>
                                </Grid>
                                

                                    
                            </Grid>


                        </Box>  : <>
                        <Typography variant="body1" sx={{textAlign: 'center', fontWeight: '100'}}>
                            Upload your past work for the best outcome.
                        </Typography>
                             <ExcelMapper setTransformedData={setTransformedData} /> 
                        <Typography variant="body1" sx={{textAlign: 'center', fontWeight: '100', fontSize: '12px', paddingTop: '12px'}}>
                            Or Scroll Down to use the general AI Categorizer
                        </Typography>

                        </> }
                    </FormControl>
                </Grid>
                {
                    !showExcel && hasTrainingData ? 
                        <Grid item md={12} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: '16px'}}>
                            <Typography variant="body1" sx={{textAlign: 'center', fontWeight: '100', fontStyle: 'italic'}}>
                                Click on the Button below to categorize the bank statement using historical data
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                onClick={() =>{customCategorizer((msg) => {toast.info(msg)}, setLoading, setUpdate  )}}
                                component="span"
                                sx={{ borderRadius: '16px', padding: '10px 20px' }}
                                >
                                Train & Categorize
                            </Button>
                           
                        </Grid> : null

                    }
            </>
        ) : (
            <>
                <Grid item md={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <FormControl fullWidth sx={{ marginBottom: '16px', marginTop: '32px' }}>
                        <IconButton onClick={() => setCreateNewClient(true)} variant="outlined" sx={{borderRadius: '16px'}}>
                            <PersonAdd />
                        </IconButton>
                    </FormControl>
                </Grid>
                <Grid item md={11}>
                    <FormControl fullWidth sx={{ marginBottom: '16px', marginTop: '32px' }}>
                        <Autocomplete
                            options={clients}
                            sx={{
                                '& .MuiInputBase-root': {
                                    borderRadius: '16px',
                                },
                            }}
                            getOptionLabel={(option) => option.name || ''}
                            value={clients.find((client) => client.name === selectedClient) || null}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setClientTemp(newValue.name);
                                    setOpenConfDial(true);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search a Client"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            borderRadius: '16px',
                                        },
                                        marginTop: '8px',
                                    }}
                                    InputLabelProps={{ style: { color: 'black', fontWeight: 200 } }}
                                />
                            )}
                            disabled={clients.length === 0}
                        />
                    </FormControl>
                </Grid>
            </>
        )}

       <FullScreenLoader loading={loading} />
    </Grid>
);
};

export default ClientSelection;

import React from 'react';
import {
  Grid,
  FormControl,
  IconButton,
  Autocomplete,
  TextField,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

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

return (
    <Grid container direction={'row'} md={12} sx={{minHeight: 'px'}}>
        {assignedClientFile ? (
            <>
              
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
    </Grid>
);
};

export default ClientSelection;

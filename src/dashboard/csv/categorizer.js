import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
} from '@mui/material';
import TableComponent from '../comp/CsvTable';
import CreateClientDialog from './client_dialog';
import {
  fetchCsvFiles,
  fetchData,
  handleCategorize,
  handleClientSelect,
  handleDownloadFile,
  saveClient,
  sendCsvToServer,
} from './util';
import ClientSelection from './client-selection';
import BankStatementOverview from './bank-statement-overview';
import CategorizerButtons from './categorizerButtons';
import GeneratedCsvFiles from './GeneratedCsvFiles ';
import { toast } from 'react-toastify';
import { Form } from 'react-router-dom';

const CsvFileViewer = () => {
  // State management
  const [csvFiles, setCsvFiles] = useState([]);
  const [overview, setOverview] = useState({
    totalRows: 0,
    totalMoneyIn: 0,
    totalMoneyOut: 0,
    creditsRequired: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [openConfDial, setOpenConfDial] = useState(false);
  const [clientTemp, setClientTemp] = useState(null);
  const [createNewClient, setCreateNewClient] = useState(false);
  const [assignedClientFile, setAssignedClientFile] = useState(null);
  const [update, setUpdate] = useState(0);
  const [selectedClient, setSelectedClient] = useState(1);
  const [clients, setClients] = useState([]);
  const [wpfGoal, setWpfGoal] = useState();
  const [transformedData, setTransformedData] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchData(setClients, setSelectedClient, setAssignedClientFile, createNewClient);
  }, [createNewClient]);

  useEffect(() => {
    fetchCsvFiles(
      setCsvFiles,
    );
  }, [update]);

  // Calculate totals for overview
  useEffect(() => {
    let totalRows = 0;
    let totalMoneyIn = 0;
    let totalMoneyOut = 0;
    const MoneyInFile = csvFiles.find(file => file.filename === 'money_in.csv');
    const MoneyOutFile = csvFiles.find(file => file.filename === 'money_out.csv');
    if (MoneyInFile && MoneyInFile.parsedData?.length > 0) {
      MoneyInFile.parsedData.forEach((row) => {
        totalMoneyIn += parseFloat(row.total) || 0;
      });
      totalRows += MoneyInFile.parsedData.length;
    }

    if (MoneyOutFile && MoneyOutFile.parsedData?.length > 0) {
      MoneyOutFile.parsedData.forEach((row) => {
        totalMoneyOut += parseFloat(row.total) || 0;
      });
      totalRows += MoneyOutFile.parsedData.length;
    }

    setOverview({
      totalRows,
      totalMoneyIn,
      totalMoneyOut,
      creditsRequired: totalRows / 50,
    });
  }, [csvFiles]);

  useEffect(() => {
    if (transformedData?.F31) {
      const f31 = {
        filename: 'F31',
        parsedData: transformedData.F31,
      }
      setCsvFiles((prev) => [f31, ...prev, ]);
    
    }
    if (transformedData?.F32) {
      const f32 = {
        filename: 'F32',
        parsedData: transformedData.F32
      }
      setCsvFiles((prev) => [f32, ...prev, ]);
     
    }

    if (transformedData?.F31 && transformedData?.F32) { 
      const f31 = {
        filename: 'TRAINING_DATA_F31',
        parsedData: transformedData.F31,
      }
      sendCsvToServer(f31.filename, f31.parsedData, (msg) => {toast.info(msg); setUpdate(update + 1)});
      const f32 = {
        filename: 'TRAINING_DATA_F32',
        parsedData: transformedData.F32
      }
      sendCsvToServer(f32.filename, f32.parsedData, (msg) => {toast.info(msg); setUpdate(update + 1)});
      
    }
  }, [transformedData]);

  // Dialog Handlers
  const handleOpenDialog = (file) => {
    setSelectedFile(file);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '150px', paddingBottom: 4 }}>
      <Grid container spacing={3}>


        {/* Client Section */}
        <Grid item xs={12}>
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
            {assignedClientFile ? (
              <ClientInfo assignedClientFile={assignedClientFile} />
            ) : (
              <NoClientSelected />
            )}
            <ClientSelection
              clients={clients}
              selectedClient={selectedClient}
              setClientTemp={setClientTemp}
              setOpenConfDial={setOpenConfDial}
              setCreateNewClient={setCreateNewClient}
              setTransformedData={setTransformedData}
              csvFiles={csvFiles}
              assignedClientFile={assignedClientFile}
              setUpdate={setUpdate}
            />
          </Box>
        </Grid>

        
        {/* Bank Statement Overview Section */}
        {overview && (
          <Grid item xs={12}>
            <BankStatementOverview overview={overview} />
          </Grid>
        )}



        {/* Generated CSV Files Section */}
        <Grid item xs={12} sx={{ marginTop: '24px' }}>
          <GeneratedCsvFiles
            csvFiles={csvFiles}
            handleOpenDialog={handleOpenDialog}
            assignedClientFile={assignedClientFile}
          />
        </Grid>

        {/* AI Categorizer Section */}
        {
          csvFiles.find(file => file.filename === 'cat_money_in.csv') 
           && csvFiles.find(file => file.filename === 'cat_money_out.csv') ? null :
        <Grid item xs={12}>
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
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: '200' }}>
              Use General AI Categorizer
            </Typography>
            <CategorizerButtons
              csvFiles={csvFiles}
              handleCategorize={handleCategorize}
              setUpdate={setUpdate}
              update={update}
            />
          </Box>
        </Grid> }

      </Grid>

      {/* CSV File Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedFile?.filename}</DialogTitle>
        <DialogContent dividers>
          {selectedFile?.parsedData ? <TableComponent csvData={selectedFile?.parsedData} /> : <></>}
        </DialogContent>
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={handleCloseDialog} color="secondary">
            Close
          </Button>
          <Button  variant="outlined" onClick={() => handleDownloadFile(selectedFile)} color="primary" >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Client Dialog */}
      <CreateClientDialog
        open={createNewClient}
        onClose={() => setCreateNewClient(false)}
        onSave={async (data) => await saveClient(data)}
      />

      {/* Confirm Assignment Dialog */}
      <Dialog open={openConfDial} onClose={() => setOpenConfDial(false)}>
        <DialogTitle>Confirm Assignment</DialogTitle>
        <DialogContent>
          <Grid container direction="row" spacing={1}>
            <Grid item xs={12} direction="">
              <Typography variant="body1">
                Are you sure you want to assign the selected client to the current files?
              </Typography>
            </Grid>
            <Grid item xs={12} direction="" >
              <TextField
                margin="dense"
                name="industry"
                label="What is The purpose of this computation?"
                type="text"
                fullWidth sx={{
                  mt: '12px',
                  '& .MuiInputBase-root': {
                    borderRadius: '16px',
                  },
                }}
                value={wpfGoal?.purpose || ''}
                onChange={(e) => setWpfGoal({ ...wpfGoal, purpose: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} direction="">
              <TextField
                margin="dense"
                name="industry"
                label="Enter a Title for this computation"
                type="text"
                fullWidth sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '16px',
                  },
                }}
                value={wpfGoal?.title || ''}
                onChange={(e) => setWpfGoal({ ...wpfGoal, title: e.target.value })}
              />
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfDial(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() =>
              handleClientSelect(
                clientTemp,
                clients,
                wpfGoal,
                setSelectedClient,
                setAssignedClientFile,
                setOpenConfDial
              )
            }
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Subcomponents for better readability
const ClientInfo = ({ assignedClientFile }) => (
  <>
    <Grid item container direction="row" sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
      <Grid item xs={12} direction="column">
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 800 }}>
          {assignedClientFile.name}
        </Typography>
      </Grid>
      <Grid item xs={12} direction="column">
        <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: '100', fontStyle: 'italic' }}>
          {assignedClientFile.type} · {assignedClientFile.industry}
        </Typography>
      </Grid>
    </Grid>
  </>
);

const NoClientSelected = () => (
  <> 
    <Grid item container md={12}  xs={12}  direction={'row'} sx={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
      <Grid item md={12}  xs={12}  direction={'column'}>
        <Typography variant="h4"  sx={{textAlign: 'start',  }}>
          No Client Selected
        </Typography>
      </Grid>
      <Grid item md={12}  xs={12}  direction={'column'}>
        <Typography variant="body1"  sx={{textAlign: 'start', fontWeight: '100', fontStyle: 'italic' }}>
          Please Select or Create a Client to use the custom AI Categorizer
        </Typography>
      </Grid>
    </Grid>

  </>
);

export default CsvFileViewer;
import React, { useState } from 'react';
import { Box, Typography, Dialog, Grid, DialogActions, IconButton, DialogContent, DialogTitle, Button, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import CloseIcon from '@mui/icons-material/Close';
import TableComponent from '../comp/CsvTable';
import TransformDialog from './transform';
import { auth, db } from '../../fire/init';
import { toast } from "react-toastify";
import { setDoc, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom"; 


function CsvUploader() {
  const [csvData, setCsvData] = useState(null);
  const [open, setOpen] = useState(false);
  const [other, setOther] = useState(false);

  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    // Handle file reading
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
        setOpen(true); // Open dialog with CSV data
      },
      header: true, // If the CSV file has headers
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.csv', 
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid item xs={12} sm={12} md={12}>
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
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'start', fontWeight: '400' }}>
          Categorizer
        </Typography>
        <Typography variant="body1">
          Drag & Drop a CSV File to start working
        </Typography>
        <Paper
          {...getRootProps()}
          sx={{
            p: 2,
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '350px',
            borderRadius: '8px',
            border: '2px dashed #ccc',
            textAlign: 'center',
            cursor: 'pointer'
          }}
        >
          <input {...getInputProps()} />
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: '350px',
            width: '100%'
          }}>
            <img src="drop.png" style={{height: '300px', width: '400px'}} />
          </Box>
          <Typography variant="body2">
            Drop your CSV file here or click to select.
          </Typography>


        </Paper>
      </Box>

      <Dialog
        open={open}
        onClose={(e, reason) => {
            if (reason !== 'backdropClick') {
            handleClose();
            }
        }}
        maxWidth="md"
        fullWidth
        disableBackdropClick
        >
        <DialogTitle>
            <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: 'absolute', left: 24, top: 8 }}
            >
            <CloseIcon />
            </IconButton>
                File Content
        </DialogTitle>
        <DialogContent>
            <Box>
            {csvData && csvData.length > 0 && (
                <TableComponent csvData={csvData} />
            )}
            </Box>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" sx={{borderRadius: '8px'}} onClick={() => {
                setOther(true)
                handleClose()
            }} color="primary">
            Transform
            </Button>
        </DialogActions>
        </Dialog>
        {csvData ? <>

            <TransformDialog 
            csvData={csvData}
            handleClose={() => setOther(false)}
            open={other}
            onTransform={async (e)=>  {

              let resp = await sendTransformRequest(csvData, e)

              const errors = resp.errors
              const transformationId = resp.id 

              if (transformationId) {
                  const userId = auth.currentUser.uid; // Assuming `auth` is correctly imported from your Firebase setup
                  const userDocRef = doc(db, 'users', userId);
                  try {
                      const workingPaperDocRef = doc(userDocRef, 'wpf', transformationId);
                      await setDoc(workingPaperDocRef, {
                        transformationId: transformationId,
                      }, { merge: true });
                  } catch (error) {
                    console.error('Error updating client working files:', error);
                  }
                }

                toast.success(`Transformation was successful ${errors.length > 0 ? `with ${errors.length} errors`: ''}`, {
                  position: "top-right",
                  autoClose: 6000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });


              localStorage.setItem('currentTrId', transformationId)
              navigate('/categorize')


              



            }}
        />
        
        </> : <></>}
        
    </Grid>
  );







  async function sendTransformRequest(csvData, transformRequest,) {
    const url = 'http://127.0.0.1:5000/transform';
    
    // Function to clean and ensure numeric values in "moneyIn" and "moneyOut" columns
    const cleanMoneyValues = (dataArray, transformRequest) => {
      const moneyInKey = transformRequest.moneyIn;
      const moneyOutKey = transformRequest.moneyOut;

      return dataArray.map(row => {
        // Clean "moneyIn" value
        if (row[moneyInKey]) {
          row[moneyInKey] = parseFloat(
            row[moneyInKey]
              .toString()
              .replace(/[^0-9.-]+/g, '') // Remove any character that's not a digit, decimal point, or minus sign
          );
        }

        // Clean "moneyOut" value
        if (row[moneyOutKey]) {
          row[moneyOutKey] = parseFloat(
            row[moneyOutKey]
              .toString()
              .replace(/[^0-9.-]+/g, '') // Remove any character that's not a digit, decimal point, or minus sign
          );
        }

        return row;
      });
    };

    // Assuming csvData is an array of objects and transformRequest is the transform configuration
    const cleanedCsvData = cleanMoneyValues(csvData, transformRequest);

    const generateCsvData = (dataArray) => {
      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        throw new Error('Invalid data format. Expected a non-empty array of objects.');
      }

      // Extract headers from the keys of the first object
      const headers = Object.keys(dataArray[0]);

      // Convert header and data rows to CSV string
      const csvRows = [
        headers.join(','), // Header row
        ...dataArray.map(row =>
          headers.map(header => `"${row[header] ? row[header].toString().replace(/"/g, '""') : ''}"`).join(',')
        )
      ];

      return csvRows.join('\n');
    };

    const fileBlob = new Blob([generateCsvData(cleanedCsvData)], { type: 'text/csv' });
    const file = new File([fileBlob], 'input.csv', { type: 'text/csv' });
    const authToken = await auth.currentUser.getIdToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('transform_request', JSON.stringify(transformRequest));

    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const err = await response.json()
        toast.error(`We couldn't transform your data, Please make sure you follow the guidelines.`, {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        try {
        toast.error(`${err.error}`)
        } catch (error) {
          console.log(err)
        }
        
      } else {
        return await response.json();
      }
      

    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }




}

export default CsvUploader;

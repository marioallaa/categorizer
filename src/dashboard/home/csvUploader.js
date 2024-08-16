import React, { useState } from 'react';
import { Box, Typography, Dialog, Grid, DialogActions, IconButton, DialogContent, DialogTitle, Button, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import CloseIcon from '@mui/icons-material/Close';
import TableComponent from '../comp/CsvTable';
import TransformDialog from './transform';

function CsvUploader() {
  const [csvData, setCsvData] = useState(null);
  const [open, setOpen] = useState(false);
  const [other, setOther] = useState(false);

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
            onTransform={(e)=>{console.log(`TRANSFORM: `); console.log(e)}}
        />
        
        </> : <></>}
    </Grid>
  );
}

export default CsvUploader;

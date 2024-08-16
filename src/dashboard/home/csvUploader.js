import React, { useState } from 'react';
import { Box, Typography, Dialog, Grid, DialogActions, DialogContent, DialogTitle, Button, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

function CsvUploader() {
  const [csvData, setCsvData] = useState(null);
  const [open, setOpen] = useState(false);

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
    accept: '.csv', // Only accept CSV files
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
          Drag & Drop a CSV File to start working.
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

      {/* Dialog for displaying CSV data */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>CSV File Contents</DialogTitle>
        <DialogContent>
          <Box>
            {csvData && csvData.length > 0 && (
              <table>
                <thead>
                  <tr>
                    {Object.keys(csvData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default CsvUploader;

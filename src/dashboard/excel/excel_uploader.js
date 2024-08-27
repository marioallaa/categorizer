import React, { useState } from 'react';
import { Box, Typography, Dialog, Grid, DialogActions, IconButton, DialogContent, DialogTitle, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';

function ExcelUploader() {
  const [open, setOpen] = useState(false);


  const onDrop = (acceptedFiles) => {

    console.log(acceptedFiles);

  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ['.xlsx', '.xls'], 
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
          Drag & Drop an Excel File to start working
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
            <img src="drop.png" style={{height: '300px', width: '400px'}} alt="Drop your file here"/>
          </Box>
          <Typography variant="body2">
            Drop your Excel file here or click to select.
          </Typography>
        </Paper>
      </Box>

      {/* Dialog for selecting Money In and Money Out sheets */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
            <InputLabel id="money-in-label" sx={{color: 'black'}}>Money In</InputLabel>
            
          </FormControl>
          <FormControl fullWidth >
            <InputLabel id="money-out-label"  sx={{color: 'black'}}>Money Out</InputLabel>
            
          </FormControl>
        </DialogContent>
        <DialogActions>
          {/* <Button variant="contained" sx={{ borderRadius: '8px' }} onClick={handleSheetSelection} color="primary">
            Match Sheets
          </Button> */}
        </DialogActions>
      </Dialog>

    </Grid>
  );
}

export default ExcelUploader;

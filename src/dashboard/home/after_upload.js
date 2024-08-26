import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Typography, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AfterUpload = ({ open, handleClose, logs }) => {

  const [columnMapping, setColumnMapping] = useState({
    date: '',
    description: [],
    moneyIn: '',
    moneyOut: ''
  });

  clientData = ['client1', 'client2', 'client3', 'client4', ]

  handleAsignToClient = (client) => {

    print(`Will Asign to client ${client}`)

  }

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => { if (reason !== 'backdropClick') handleClose(); }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close" sx={{ position: 'absolute', left: 16, top: 10 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ }}>
          The Transformation was successful
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: '32px', paddingTop: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth sx={{ marginBottom: '16px', marginTop: '16px' }}>
            
            <InputLabel sx={{ color: 'black', fontWeight: '200', marginBottom: '8px' }}> Asign to a Client </InputLabel>
            <Select
              value={columnMapping.date}
              onChange={(e) => handleColumnChange('date', e.target.value)}
              sx={{ borderRadius: '16px', marginTop: '8px' }}
            >
              {clientData.map((header) => (
                <MenuItem key={header} value={header}>{header}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: '16px' }}>
            <InputLabel sx={{ color: 'black', fontWeight: '200' }}>Description Columns</InputLabel>
            <Select
              multiple
              value={columnMapping.description}
              onChange={(e) => handleColumnChange('description', e.target.value)}
              renderValue={(selected) => selected.join(', ')}
              sx={{ borderRadius: '16px',  marginTop: '8px' }}
            >
              {csvHeaders.map((header) => (
                <MenuItem key={header} value={header}>{header}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Switch checked={categorizeMoneyIn} onChange={(e) => setCategorizeMoneyIn(e.target.checked)} />}
            label="Categorize Money In"
            sx={{ }}
          />
          {categorizeMoneyIn && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth sx={{ marginBottom: '16px' }}>
                <InputLabel sx={{ color: 'black', fontWeight: '200' }}>Money In Column</InputLabel>
                <Select
                  value={columnMapping.moneyIn}
                  onChange={(e) => handleColumnChange('moneyIn', e.target.value)}
                  sx={{ borderRadius: '16px',  marginTop: '8px' }}
                >
                  {csvHeaders.map((header) => (
                    <MenuItem key={header} value={header}>{header}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch checked={moneyInPositive} onChange={(e) => setMoneyInPositive(e.target.checked)} />}
                label="The transaction value is positive."
                sx={{ }}
              />
            </Box>
          )}

          <FormControlLabel
            control={<Switch checked={categorizeMoneyOut} onChange={(e) => setCategorizeMoneyOut(e.target.checked)} />}
            label="Categorize Money Out"
            sx={{ }}
          />
          {categorizeMoneyOut && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth sx={{ marginBottom: '16px' }}>
                <InputLabel sx={{ color: 'black', fontWeight: '200' }}>Money Out Column</InputLabel>
                <Select
                  value={columnMapping.moneyOut}
                  onChange={(e) => handleColumnChange('moneyOut', e.target.value)}
                  sx={{ borderRadius: '16px',  marginTop: '8px', }}
                >
                  {csvHeaders.map((header) => (
                    <MenuItem key={header} value={header}>{header}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch checked={moneyOutNegative} onChange={(e) => setMoneyOutNegative(e.target.checked)} />}
                label="The transaction value is negative."
                sx={{ }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTransform}
          sx={{ borderRadius: '16px', backgroundColor: 'black', color: 'white' }}
        >
          Transform
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AfterUpload;

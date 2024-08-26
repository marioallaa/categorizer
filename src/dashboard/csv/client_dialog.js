import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';

const CreateClientDialog = ({ open, onClose, onSave }) => {
  const [client, setClient] = useState({
    name: '',
    type: '',
    industry: '',
    purpose: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(client);
    onClose(); // Close the dialog after saving
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Client</DialogTitle>
      <DialogContent sx={{marginTop: '24px'}}>
        <TextField
          autoFocus
          margin="dense"
          name="name"

          label="Client Name"
          type="text"
          fullWidth sx={{
            '& .MuiInputBase-root': {
              borderRadius: '16px',
            },
          }}
          value={client.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="type"
          label="Type"
          select
          fullWidth sx={{
            '& .MuiInputBase-root': {
              borderRadius: '16px',
            },
          }}
          value={client.type}
          onChange={handleChange}
        >
          <MenuItem value="Limited Company">Limited Company</MenuItem>
          <MenuItem value="Sole Trader">Sole Trader</MenuItem>
          <MenuItem value="Partnership">Partnership</MenuItem>
          {/* Add more types as needed */}
        </TextField>
        <TextField
          margin="dense"
          name="industry"
          label="Industry"
          type="text"
          fullWidth sx={{
            '& .MuiInputBase-root': {
              borderRadius: '16px',
            },
          }}
          value={client.industry}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="purpose"
          label="Purpose"
          select sx={{
            '& .MuiInputBase-root': {
              borderRadius: '16px',
            },
          }}
          fullWidth
          value={client.purpose}
          onChange={handleChange}
        >
          <MenuItem value="VAT">VAT</MenuItem>
          <MenuItem value="Accounts">Accounts</MenuItem>
          <MenuItem value="Payroll">Payroll</MenuItem>
          {/* Add more purposes as needed */}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateClientDialog;
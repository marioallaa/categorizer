
import React, { useState, } from 'react';
import { Grid, } from '@mui/material';
import { handleCategorize } from './util';
import { Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Link,
} from '@mui/material';
import FullScreenLoader from '../comp/fullScreenLoading';

const CategorizerButtons = ({
  csvFiles,
  setUpdate,
  rows,
  update,
}) => {

    const MoneyIn = csvFiles.find(file => file.filename === 'money_in.csv');
    const MoneyOut = csvFiles.find(file => file.filename === 'money_out.csv');
    const CatMoneyOut = csvFiles.find(file => file.filename === 'cat_money_out.csv');
    const CatMoneyIn = csvFiles.find(file => file.filename === 'cat_money_in.csv');


    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [variant, setVariant] = useState('');
    const [extraField, setExtraField] = useState(false);
    const [formData, setFormData] = useState({
      director: '',
      companyRole: '',
      employees: '',
      categorization: '',
      extraCustomization: '',
    });


  
  
    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const setItnernimUpdate = (update) => {
      setUpdate(update);
      setLoading(false);
    }

  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSave = () => {
      handleCategorize(variant, setItnernimUpdate, update, formData)
      setLoading(true);
     
      handleClose();
    };

  return ( <>
    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
      {MoneyIn && (
        <Grid item md={MoneyOut.filename ? 6 : 12}>
          <Button
          fullWidth
            disabled={CatMoneyIn}   
            onClick={() => {handleOpen(); setVariant('money_in')}}
            variant="outlined"
          >
            Categorize F3-1
          </Button>
        </Grid>
      )}
      {MoneyOut && (
        <Grid item md={MoneyIn.filename ? 6 : 12}>
          <Button
            disabled={CatMoneyOut}
            fullWidth
            onClick={() => {handleOpen(); setVariant('money_out');}}
            variant="outlined"
          >
            Categorize f3-2
          </Button>
        </Grid>
      )}
    </Grid>

  
  


  <Dialog open={open} onClose={handleClose}>
  <DialogTitle>More Information Required</DialogTitle>
    <DialogContent>
      <TextField
        label="Who is the company director?"
        name="director"
        type="text"
        fullWidth sx={{
          '& .MuiInputBase-root': {
            borderRadius: '16px',
          },
          '& .MuiInputLabel-root': {
            marginTop: '6px',
          },
        }}
        value={formData.director}
        onChange={handleChange}
        margin="dense"
      />
      <TextField
          margin="dense"
          type="text"
          fullWidth sx={{
            '& .MuiInputBase-root': {
              borderRadius: '16px',
            },
            '& .MuiInputLabel-root': {
              marginTop: '6px',
            },
          }}
        label="What do they do?"
        name="companyRole"
        value={formData.companyRole}
        onChange={handleChange}
      />
      <TextField
        label="Are there any employees?"
        name="employees"
        type="text"
        fullWidth sx={{
          '& .MuiInputBase-root': {
            borderRadius: '16px',
          },
          '& .MuiInputLabel-root': {
            marginTop: '6px',
          },
        }}
        value={formData.employees}
        onChange={handleChange}
        margin="dense"
      />
      <TextField
        type="text"
        fullWidth sx={{
          '& .MuiInputBase-root': {
            borderRadius: '16px',
          },
          '& .MuiInputLabel-root': {
            marginTop: '6px',
          },
        }}
        label="Suggestive columns for categorization"
        name="categorization"
        value={formData.categorization}
        onChange={handleChange}
        margin="dense"
      />

      {extraField && (
        <TextField
          type="text"
          fullWidth sx={{
            '& .MuiInputBase-root': {
              borderRadius: '16px',
            },
            '& .MuiInputLabel-root': {
              marginTop: '6px',
            },
          }}
          label="Extra Customization"
          name="extraCustomization"
          value={formData.extraCustomization}
          onChange={handleChange}
          margin="dense"
        />
      )}

      <Link
        component="button"
        variant="body2"
        onClick={() => setExtraField(!extraField)}
        style={{ marginTop: 8, display: 'block', fontSize: 8 }}
      >
        More Customization
      </Link>
    </DialogContent>

    <DialogActions>
      <Button onClick={handleClose}>No</Button>
      <Button onClick={handleSave} variant='contained' color="primary">
        Submit
      </Button>
    </DialogActions>
  </Dialog>

  <FullScreenLoader loading={loading} rows={rows} variant/>
</>
  );
};

export default CategorizerButtons;

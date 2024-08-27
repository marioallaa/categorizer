import React from 'react';
import { Grid, Button } from '@mui/material';
import { handleCategorize } from './util';


const CategorizerButtons = ({
  csvFiles,
  setUpdate,
  update,
}) => {

    const MoneyIn = csvFiles.find(file => file.filename === 'money_in.csv');
    const MoneyOut = csvFiles.find(file => file.filename === 'money_out.csv');
    const CatMoneyOut = csvFiles.find(file => file.filename === 'cat_money_out.csv');
    const CatMoneyIn = csvFiles.find(file => file.filename === 'cat_money_in.csv');

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
      {MoneyIn && (
        <Grid item md={MoneyOut.filename ? 6 : 12}>
          <Button
          fullWidth
            disabled={CatMoneyIn}   
            onClick={() => handleCategorize('money_in', setUpdate, update)}
            variant="outlined"
          >
            Cat - Money In
          </Button>
        </Grid>
      )}
      {MoneyOut && (
        <Grid item md={MoneyIn.filename ? 6 : 12}>
          <Button
            disabled={CatMoneyOut}
            fullWidth
            onClick={() => handleCategorize('money_out', setUpdate, update)}
            variant="outlined"
          >
            Cat - Money Out
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default CategorizerButtons;

import React, { useEffect, useState } from 'react';
import { Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Checkbox, 
    ListItemText, 
    Grid 
} from '@mui/material';
import * as XLSX from 'xlsx';

const ExcelMapper =  ({setTransformedData}) => {
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [sheetMappingOpen, setSheetMappingOpen] = useState(false);
  const [columnMappingOpen, setColumnMappingOpen] = useState({ F31: false, F32: false });
  const [selectedSheets, setSelectedSheets] = useState({ F31: '', F32: '' });
  const [wSheets, setWSheets] = useState({ F31: [], F32: [] });
  const [columns, setColumns] = useState({ F31: [], F32: [] });
  const [mapping, setMapping] = useState({ F31: {}, F32: {} });
  const [transformedData, setData] = useState({ F31: [], F32: [] });


  useEffect(() => {
    if (transformedData.F31.length > 0 && transformedData.F32.length > 0) {
      setTransformedData(transformedData);
    }
  }, [transformedData, setTransformedData]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      setSheets(workbook.SheetNames);
      setFile(workbook);
      setSheetMappingOpen(true);
    };

    reader.readAsBinaryString(file);
  };

  const handleSheetMapping = () => {
    const isValidExcelDate = (value) => {
      return typeof value === 'number' && value > 0 && value < 2958465;
    };

    const extractTable = (sheet) => {
      const range = XLSX.utils.decode_range(sheet['!ref']);
      let startRow = null;
      let startCol = null;

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = sheet[XLSX.utils.encode_cell({ r: R, c: C })];
          if (cell && typeof cell.v === 'string' && cell.v.toLowerCase() === 'date') {
            startRow = R;
            startCol = C;
            break;
          }
        }
        if (startRow !== null && startCol !== null) break;
      }

      if (startRow === null || startCol === null) {
        return [];
      }

      const emptyDateRows = [];
      let endRow = startRow;
      for (let R = startRow + 1; R <= range.e.r; ++R) {
        const cell = sheet[XLSX.utils.encode_cell({ r: R, c: startCol })];
        try {
          if (cell && isValidExcelDate(cell.v)) {
            endRow = R;
          }
        } catch (error) {
          emptyDateRows.push(R);
        }
      }

      const tableRange = XLSX.utils.encode_range({
        s: { r: startRow, c: range.s.c },
        e: { r: endRow, c: range.e.c },
      });

      return XLSX.utils.sheet_to_json(sheet, {
        range: tableRange,
        header: 1,
      });
    };

    const F31Sheet = extractTable(file.Sheets[selectedSheets.F31]);
    const F32Sheet = extractTable(file.Sheets[selectedSheets.F32]);

    setColumns({
      F31: F31Sheet.length > 0 ? F31Sheet[0].map((col, index) => ({ id: index, value: col })) : [],
      F32: F32Sheet.length > 0 ? F32Sheet[0].map((col, index) => ({ id: index, value: col })) : [],
    });
    setWSheets({
      F31: F31Sheet,
      F32: F32Sheet
    });

    setSheetMappingOpen(false);
    setColumnMappingOpen({ ...columnMappingOpen, 'F31': true });
  };

  const handleColumnMappingChange = (sheet, column, value) => {
    setMapping((prev) => ({
      ...prev,
      [sheet]: {
        ...prev[sheet],
        [column]: value,
      },
    }));
  };

  const handleTransformData = (sheet) => {
    const selectedSheetData = wSheets[sheet];
    const sheetMapping = mapping[sheet];

    let transformed = selectedSheetData.map(row => {
      const r = {
        date: row[sheetMapping.date.id],
        description: row[sheetMapping.description.id],
        total: row[sheetMapping.total.id],
      };

      try {
        r.vat = row[sheetMapping.vat.id]
      } catch (error) {
        r.vat = 0
      }

      row.forEach((cell, index) => {
        try {
            if (sheetMapping.categories.includes(index)) {
              r.category = columns[sheet][index].value;
            }
        } catch (error) {
            r.category = 'SUS'
        }
      });

      return r;
    });

    const removeInvalidDateRows = (transformedData) => {
      const isValidExcelDate = (value) => {
        return typeof value === 'number' && value > 0 && value < 2958465;
      };
      return  [ ...transformedData.filter(row => isValidExcelDate(row.date))];
    }

    transformed = removeInvalidDateRows(transformed);


    setData((prev) => ({ ...prev, [sheet]: transformed }));
    console.log(sheet, transformed);
    setColumnMappingOpen({ ...columnMappingOpen, [sheet]: false });
    if (sheet === 'F31') {
      setColumnMappingOpen({ 'F32': true });
    }
  };

  return (
    <div >
      <input
        accept=".xlsx"
        id="file-upload"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <label htmlFor="file-upload">
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          component="span"
          sx={{ borderRadius: '16px', padding: '10px 20px' }}
        >
          Upload Existing Workbook
        </Button>
      </label>

      {/* Sheet Mapping Dialog */}
      <Dialog open={sheetMappingOpen} onClose={() => setSheetMappingOpen(false)}>
        <DialogTitle>Select the F3-1 and F3-2 Sheets </DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{mt: 1}}>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>F3-1 Sheet</InputLabel>
                        <Select
                        value={selectedSheets.F31}
                        onChange={(e) => setSelectedSheets({ ...selectedSheets, F31: e.target.value })}
                        >
                        {sheets.map((sheet) => (
                            <MenuItem key={sheet} value={sheet}>
                            {sheet}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>F3-2 Sheet</InputLabel>
                        <Select
                        value={selectedSheets.F32}
                        onChange={(e) => setSelectedSheets({ ...selectedSheets, F32: e.target.value })}
                        >
                        {sheets.map((sheet) => (
                            <MenuItem key={sheet} value={sheet}>
                            {sheet}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSheetMapping}>Next</Button>
        </DialogActions>
      </Dialog>

      {['F31', 'F32'].map((sheet) => (
        <Dialog key={sheet} open={columnMappingOpen[sheet]} onClose={() => setColumnMappingOpen({ ...columnMappingOpen, [sheet]: false })}>
          <DialogTitle>Map Columns for {sheet}</DialogTitle>
          <DialogContent>
            <Grid container sx={{mt: 1}} spacing={2}>
            {['date', 'description', 'total', 'vat'].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                <FormControl fullWidth sx={{
                        '& .MuiInputBase-root': {
                        borderRadius: '16px',
                        },
                    }}
                
                    >
                    <InputLabel>{field}</InputLabel>
                    <Select
                    value={mapping[sheet] ? mapping[sheet][field] ? mapping[sheet][field].id : '' : ''}
                    onChange={(e) => handleColumnMappingChange(sheet, field, columns[sheet][e.target.value])}
                    >
                    {columns[sheet].map((col) => (
                        <MenuItem key={col.id} value={col.id}>
                        {col.value}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>
            ))}
            <Grid item xs={12}>
                <FormControl fullWidth  sx={{
                    '& .MuiInputBase-root': {
                    borderRadius: '16px',
                    },
                }}>
               <FormControl fullWidth>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={mapping[sheet]?.categories || []}  // Ensuring it's always an array
                    onChange={(e) => handleColumnMappingChange(sheet, 'categories', e.target.value)}
                    renderValue={(selected) => {
                      const selectedValues = columns[sheet]
                        .filter(col => selected.includes(col.id))
                        .map(col => col.value);
                      return selectedValues.join(', ');
                    }}
                  >
                    {columns[sheet].map((col) => (
                      <MenuItem key={col.id} value={col.id}>
                        <Checkbox checked={mapping[sheet]?.categories?.includes(col.id) || false} /> {/* Ensure checked is boolean */}
                        <ListItemText primary={col.value} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </FormControl>
            </Grid>
            </Grid>
        </DialogContent>
          <DialogActions>
            <Button onClick={() => handleTransformData(sheet)}>{sheet==='F31' ? 'NEXT' : 'SUBMIT DATA'}</Button>
          </DialogActions>
        </Dialog>
      ))}
    </div>
  );
}

export default ExcelMapper;

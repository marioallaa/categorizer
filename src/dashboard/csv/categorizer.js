import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Container,
  Grid,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import TableComponent from '../comp/CsvTable';
import { auth } from '../../fire/init';
import { DownloadOutlined, Visibility } from '@mui/icons-material';

const CsvFileViewer = () => {
  const [csvFiles, setCsvFiles] = useState([]);
  const [overview, setOverview] = useState({
    totalRows: 0,
    totalMoneyIn: 0,
    totalMoneyOut: 0,
    creditsRequired: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [logContent, setLogContent] = useState(null);
  const [update, setUpdate] = useState(0)
  const [catMoneyIn, setCatMoneyIn] = useState(false)
  const [catMoneyOut, setCatMoneyOut] = useState(false)
  const [MoneyIn, setMoneyIn] = useState(false)
  const [MoneyOut, setMoneyOut] = useState(false)
  const [MoneyInFile, setMoneyInFile] = useState(false)
  const [MoneyOutFile, setMoneyOutFile] = useState(false)


  useEffect(() => {
    let totalRows = 0;
    let totalMoneyIn = 0;
    let totalMoneyOut = 0;

    MoneyIn && MoneyInFile?.length>0 && MoneyInFile.forEach((row) => {
    if (row.total) {
        totalMoneyIn += parseFloat(row.total) || 0;
    }
    });
    if (MoneyIn && MoneyInFile?.length>0 ) {
        totalRows += MoneyInFile.length;
    }

    MoneyOut && MoneyOutFile?.length>0 && MoneyOutFile.forEach((row) => {
    if (row.total) {
        totalMoneyOut += parseFloat(row.total) || 0;
    }
    });
    if (MoneyOut && MoneyOutFile?.length>0 ) {
        totalRows += MoneyOutFile.length;
    }
    
    
    setOverview({
        totalRows: totalRows,
        totalMoneyIn: totalMoneyIn,
        totalMoneyOut: totalMoneyOut,
        creditsRequired: totalRows/50
    })

  }, [MoneyIn, MoneyOut, MoneyInFile, MoneyOutFile])



  useEffect(() => {
    const uniqueId = localStorage.getItem('currentTrId');


    async function fetchCsvFiles(uniqueId) {
      const url = `http://127.0.0.1:5000/files/${uniqueId}`;
      const authToken = await auth.currentUser.getIdToken();
  
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
  
        if (!response.ok) {
          const err = await response.json();
          toast.error(`Failed to get files. ${err.error}`, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return
        } 
  
        const files = await response.json();
        const csvFiles = Object.keys(files).filter(filename => filename.endsWith('.csv'));
  
        const csvData = await Promise.all(
            
          csvFiles.map(async (filename) => {
            const fileUrl = `${url}/${filename}`;
            const fileResponse = await fetch(fileUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${authToken}`,
              },
            });
  
            if (!fileResponse.ok) {
              const err = await fileResponse.json();
              toast.error(`Failed to get file. ${err.error}`, {
                position: "top-right",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
  
            const text = await fileResponse.text();
            const parsedData = parseCsv(text);
            if (filename === 'log.csv') {
                setLogContent(parsedData)
            }
            if (filename === 'money_in.csv') {
                setMoneyIn(true)
                setMoneyInFile(parsedData)
            }
            if (filename === 'money_out.csv') {
                setMoneyOut(true)
                setMoneyOutFile(parsedData)
            }
            if (filename === 'cat_money_in.csv') {
                setCatMoneyIn(parsedData)
            }
            if (filename === 'cat_money_out.csv') {
                setCatMoneyOut(parsedData)
            }
            return { filename, parsedData };
          })
        );
        
        setCsvFiles(csvData);
      } catch (error) {
        toast.error(`Error Fetching Files.`, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        console.error('Error fetching CSV files:', error);
        throw error;
      }
    }
  
    // Function to parse CSV text into an array of objects
    function parseCsv(csvText) {
      const [headerLine, ...lines] = csvText.split('\n').filter(Boolean);
      const headers = headerLine.split(',');
  
      return lines.map(line => {
        const values = line.split(',');
        return headers.reduce((acc, header, index) => {
          acc[header.trim()] = values[index].trim();
          return acc;
        }, {});
      });
    }
  
    fetchCsvFiles(uniqueId);

  }, [update]);

  const mergeAndExportToExcel = ( fileName = 'categorized.xlsx') => {
    const workbook = XLSX.utils.book_new();
    if ( catMoneyIn && catMoneyIn.length > 0 ) {
        const worksheet = XLSX.utils.json_to_sheet(catMoneyIn);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'F3-1');
    }
    if ( catMoneyOut && catMoneyOut.length > 0 ) {
        const worksheet = XLSX.utils.json_to_sheet(catMoneyOut);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'F3-2');
    }
      
    XLSX.writeFile(workbook, fileName);
  };


  const handleCategorize = async (method) => {

    const uniqueId = localStorage.getItem('currentTrId');
    const url = `http://127.0.0.1:5000/categorize/${uniqueId}/${method}`;
      const authToken = await auth.currentUser.getIdToken();
  
      
    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
        });
        
        if (!response.ok) {
          const err = await response.json()
          toast.error(`We couldn't categorize your data, Please make sure you follow the guidelines.`, {
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
          }
          
        } else {
          
            toast.success(`Categorization Successful.`, {
                position: "top-right",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            
            setUpdate(update+1)
                

        }
        
  
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }


  const handleOpenDialog = (file) => {
    setSelectedFile(file);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const getExcel = () => {

    return  catMoneyIn?.length>0 && catMoneyOut?.length>0 && <> 
    
    <Grid item xs={12} sm={12} md={12} >
        <Box
            // onClick={() => handleOpenDialog(file)}
            sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: 3
            }}
            >
            <Grid container sx={{minHeight: '75px'}}>
            <Grid item md={3} xs={2} sx={{justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                <img src='/xlsx.png' style={{height: '80%'}} alt="Excel Icon" />
            </Grid>
            <Grid item md={6} xs={8} sx={{justifyContent: 'start', display: 'flex', alignItems: 'center'}}>
                <Typography variant="h6">Donwload Excel File</Typography>
            </Grid>
            <Grid item container direction={'column'} md={3} xs={2} sx={{justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                <Grid item md={12} sx={{justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                <IconButton
                    color="primary"
                    onClick={() => mergeAndExportToExcel()}
                    >
                    <DownloadOutlined />
                </IconButton>
                </Grid>
            </Grid>
            </Grid>
        </Box>
    </Grid>

    </> 
  }


  const handleDownloadFile = () => {
    const { filename, parsedData } = selectedFile;
  
    // Convert parsedData (Array of Objects) back to CSV format
    const csvContent = [
      Object.keys(parsedData[0]).join(','), // Add the headers
      ...parsedData.map(row => 
        Object.values(row).map(value => `"${value}"`).join(',')
      )
    ].join('\n');
  
    // Create a blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };


  return (
    <Container maxWidth="lg" sx={{ paddingTop: '150px', paddingBottom: 4 }}>
      <Grid container sx={{width: '100%'}} spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '200'}}>
              Overview
            </Typography>

            
            <Grid container direction={'row'} md={12}>
             
                <Grid item md={3}  xs={6} direction={'column'} sx={{display: 'flex', justifyContent: 'center'}}>
                    <Typography variant="h4"  sx={{textAlign: 'center', fontWeight: '400', }}>
                    {overview.totalRows.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                    Transactions
                    </Typography>
                </Grid>


                <Grid item md={3}  xs={6}  direction={'column'}>
                    <Typography variant="h4"  sx={{textAlign: 'center', fontWeight: '400', }}>
                    £ {overview.totalMoneyIn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                    F3-1
                    </Typography>
                </Grid>



                <Grid item md={3}  xs={6}  direction={'column'}>
                    <Typography variant="h4"  sx={{textAlign: 'center', fontWeight: '400', }}>
                    £ {overview.totalMoneyOut.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                    F3-2
                    </Typography>
                </Grid>


                <Grid item md={3}  xs={6}  direction={'column'}>
                    <Typography variant="h4"  sx={{textAlign: 'center', fontWeight: '400', }}>
                    {overview.creditsRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '100', color: 'rgba(0, 19, 150, 1)'}}>
                    Credits Required
                    </Typography>
                </Grid>


            </Grid>


            <Grid container item md={12} direction={'row'} sx={{justifyContent: 'center', display: 'flex', alignItems: 'center', marginTop: '16px'}}>
              {MoneyIn && <Grid container md={MoneyOut ? 6 : 12} direction={'column'} p={1}>
                <Button disabled={catMoneyIn} onClick={(e) => {handleCategorize('money_in')}} variant='outlined'>CAT - Money In</Button>
              </Grid> }
              {/* <Grid container md={4} direction={'column'}  p={1}>
                <Button onClick={(e) => {handleCategorize('money_in_out')}} variant='contained'>CAT - Both</Button>
              </Grid> */}
              {MoneyOut && <Grid container md={MoneyIn ? 6 : 12} direction={'column'}  p={1}>
                <Button disabled={catMoneyOut}  onClick={(e) => {handleCategorize('money_out')}} variant='outlined'>Cat - Money Out </Button>
              </Grid> }
            </Grid>
          </Box>
        </Grid>




        <Grid item xs={12}>
          <Typography>
            File ID: {localStorage.getItem('currentTrId')}
          </Typography>
        </Grid>

        {getExcel()}

        {csvFiles.length > 0 && csvFiles.map((file) => (
          <Grid item xs={12} sm={6} md={6} key={file.name}>
            <Box
              onClick={() => handleOpenDialog(file)}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                borderRadius: 2,
                boxShadow: 3
              }}
            >
              <Grid container sx={{minHeight: '75px'}}>
                <Grid item md={3} xs={2} sx={{justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                  <img src='csv.png' style={{height: '80%'}} alt="CSV Icon" />
                </Grid>
                <Grid item md={6} xs={8} sx={{justifyContent: 'start', display: 'flex', alignItems: 'center'}}>
                  <Typography variant="h6">{file.filename}</Typography>
                </Grid>
                <Grid item container direction={'column'} md={3} xs={2} sx={{justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                  <Grid item md={12} sx={{justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                    <IconButton
                      color="primary"
                      onClick={() => file.filename.endsWith('.csv') ? handleOpenDialog(file) : handleDownloadFile(file)}
                    >
                      <Visibility />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <Typography variant="h6" gutterBottom sx={{textAlign: 'center', fontWeight: '200'}}>
              Errors
            </Typography>
            <Grid container item md={12}>
              { logContent && logContent.length > 0 ? (
                logContent.map((log, index) => (
                <Box key={index} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 , width: '100%'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                        <Typography variant="body1" fontWeight="bold">
                            Date:
                        </Typography>
                        <Typography variant="body2">
                            {log.date || 'N/A'}
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <Typography variant="body1" fontWeight="bold">
                            Description:
                        </Typography>
                        <Typography variant="body2">
                            {log.description || 'N/A'}
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                        <Typography variant="body1" fontWeight="bold">
                            Total:
                        </Typography>
                        <Typography variant="body2">
                            {log.total || 'N/A'}
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        <Typography variant="body1" fontWeight="bold" color="error">
                            Issue:
                        </Typography>
                        <Typography variant="body2" color="error">
                            {log.Issue || 'N/A'}
                        </Typography>
                        </Grid>
                    </Grid>
                    </Box>
                ))
                ) : (
                <Typography variant="body2" color="textSecondary">
                    No logs available
                </Typography>
                )}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedFile?.filename}</DialogTitle>
        <DialogContent dividers>
            { selectedFile?.parsedData ?  <TableComponent csvData={selectedFile?.parsedData} /> : <></>  }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Close 
          </Button>
          <Button onClick={handleDownloadFile} color="secondary">
            Download 
          </Button>

        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CsvFileViewer;

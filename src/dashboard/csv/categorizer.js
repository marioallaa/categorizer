
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Container,
  Grid,
  Box,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  TextField,
  Autocomplete,
  Typography,
  IconButton,
} from '@mui/material';
import { auth, db } from '../../fire/init'; // Update the path to your Firebase config if needed
import { collection, doc, addDoc, query, getDoc,  where, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify'; // For displaying notifications
import {
  PersonAdd,
} from '@mui/icons-material';
import TableComponent from '../comp/CsvTable';
import { DownloadOutlined, Visibility } from '@mui/icons-material';
import CreateClientDialog from './client_dialog';
import { mergeAndExportToExcel } from './util';


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
  const [openConfDial, setOpenConfDial] = useState(false);
  const [clientTemp, setClientTemp] = useState(null);
  const [createNewClient, setCreateNewClient] = useState(false);
  const [logContent, setLogContent] = useState(null);
  const [assignedClientFile, setAssignedClientFile] = useState(null);
  const [update, setUpdate] = useState(0)
  const [catMoneyIn, setCatMoneyIn] = useState(false)
  const [catMoneyOut, setCatMoneyOut] = useState(false)
  const [MoneyIn, setMoneyIn] = useState(false)
  const [MoneyOut, setMoneyOut] = useState(false)
  const [MoneyInFile, setMoneyInFile] = useState(false)
  const [MoneyOutFile, setMoneyOutFile] = useState(false)
  const [selectedClient, setSelectedClient] = useState(1)
  const [clients, setClients] = useState([])
  const [purpose, setPurpose] = useState([])




useEffect(() => {
  const fetchData = async () => {
    try {
      const userId = auth.currentUser.uid;
      const currentTrId = localStorage.getItem('currentTrId');
      
      if (!currentTrId) {
        console.error('No currentTrId found in localStorage');
        return;
      }

      // Fetch the WPF document using the currentTrId
      const wpfRef = doc(db, `users/${userId}/wpf/${currentTrId}`);
      const wpfDoc = await getDoc(wpfRef);

      if (wpfDoc.exists()) {
        const wpfData = wpfDoc.data();
        const assignedClientId = wpfData?.assignedClientId;

        if (assignedClientId) {
          // Fetch the client associated with this WPF
          const clientRef = doc(db, `users/${userId}/clients/${assignedClientId}`);
          const clientDoc = await getDoc(clientRef);

          if (clientDoc.exists()) {
            const clientData = clientDoc.data();
            setClients([clientData]); // Set the single client to the state
            setSelectedClient(clientData.name); // Assuming you need to set the selected client name
            setAssignedClientFile(clientData); // Assuming this is the client data you need
          } else {
            console.error('Associated client does not exist');
          }
        } else {
          // If no assignedClientId, fetch all clients
          const clientsRef = collection(db, `users/${userId}/clients`);
          const q = query(clientsRef);
          const querySnapshot = await getDocs(q);
          const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setClients(clientsData);
        }
      } else {
        console.error('WPF document does not exist');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [createNewClient]);


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


  const handleClientSelect = async () => {
    const clientName = clientTemp
    const selectedClientData = clients.find(client => client.name === clientName);
    setSelectedClient(clientName);
    setAssignedClientFile(selectedClientData);
    if (selectedClientData) {
      const userId = auth.currentUser.uid; // Assuming `auth` is correctly imported from your Firebase setup
      const userDocRef = doc(db, 'users', userId);
      try {
        const currentTrId = localStorage.getItem('currentTrId');
        if (currentTrId) {
          const workingPaperDocRef = doc(userDocRef, 'wpf', currentTrId);
          await setDoc(workingPaperDocRef, {
            transformationId: currentTrId,
            assignedClientId: selectedClientData.id,
          }, { merge: true });

          setOpenConfDial(false)
        }
      } catch (error) {
        console.error('Error updating client working files:', error);
      }
    }
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



  const handleOpenDialog = (file) => {
    setSelectedFile(file);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Handle the file selection here
      const file = e.target.files[0];
      console.log(file);
    }
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
                  onClick={() => mergeAndExportToExcel(`${assignedClientFile? assignedClientFile.name : 'CATEGORIZED.xlsx'}`, MoneyInFile, MoneyOutFile)}
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
            {assignedClientFile ? <> 
              <Grid item container md={12}  xs={12}  direction={'row'} sx={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                <Grid item md={12}  xs={12}  direction={'column'}>
                  <Typography variant="h4"  sx={{textAlign: 'start',  }}>
                    {assignedClientFile.name}
                  </Typography>
                </Grid>
                <Grid item md={12}  xs={12}  direction={'column'}>
                  <Typography variant="body1"  sx={{textAlign: 'start', fontWeight: '100', fontStyle: 'italic' }}>
                    {assignedClientFile.type} · {assignedClientFile.industry}
                  </Typography>
                </Grid>
              </Grid>

            </> : <> 
              <Grid item container md={12}  xs={12}  direction={'row'} sx={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                <Grid item md={12}  xs={12}  direction={'column'}>
                  <Typography variant="h4"  sx={{textAlign: 'start',  }}>
                    No Client Selected
                  </Typography>
                </Grid>
                <Grid item md={12}  xs={12}  direction={'column'}>
                  <Typography variant="body1"  sx={{textAlign: 'start', fontWeight: '100', fontStyle: 'italic' }}>
                    Please Select or Create a Client
                  </Typography>
                </Grid>
              </Grid>

            </>}
            
            
            <Grid container direction={'row'} md={12} spacing={3} sx={{minHeight: '100px'}}>
             
              {assignedClientFile ? <> 

              <Grid item md={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <FormControl fullWidth sx={{ marginBottom: '16px',  marginTop: '32px' }}>
                <Typography variant="body1"  sx={{textAlign: 'start', fontWeight: '100', }}>
                    For what will you categorize these transactions? 
                  </Typography>
                  <TextField
                    margin="dense"
                    name="purpose"
                    label="Set a Target Document?"
                    select sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: '16px',
                      },
                    }}
                    fullWidth
                    value={purpose}
                    onChange={(e) => {setPurpose(e.target.value)}}
                  >
                    <MenuItem value="VAT">VAT-Accounts</MenuItem>
                    <MenuItem value="Payroll">Non-VAT-Accounts</MenuItem>
                  </TextField>
                  <Typography variant="body1"  sx={{textAlign: 'start', fontWeight: '100', }}>
                    Upload an existing Excel Computation and build on top of it.
                  </Typography>
                  <input
                      accept=".xlsx"
                      id="file-upload"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        sx={{ borderRadius: '16px', padding: '10px 20px' }}
                      >
                        Upload File
                      </Button>
                    </label>

                  <Typography variant="body1"  sx={{textAlign: 'start', fontWeight: '100', fontSize: '12px', paddingTop: '12px' }}>
                    Or Scroll Down and Create a New File
                  </Typography>


                </FormControl>
                
              </Grid>

              </> : <> 


              <Grid item md={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <FormControl fullWidth sx={{ marginBottom: '16px',  marginTop: '32px' }}>
                  <IconButton onClick={() => {setCreateNewClient(true)}} variant="outlined" sx={{borderRadius: '16px'}}>
                    <PersonAdd/>
                  </IconButton>

                </FormControl>
                
              </Grid>
                  
              
              
              <Grid item md={11}>
                <FormControl fullWidth sx={{ marginBottom: '16px', marginTop: '32px' }}>
                  <Autocomplete
                    options={clients}
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: '16px',
                      },
                    }}
                    getOptionLabel={(option) => option.name || ''}
                    value={clients.find((client) => client.name === selectedClient) || null}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setClientTemp(newValue.name)
                        setOpenConfDial(true)
                        // handleClientSelect({ target: { value: newValue.name } });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search a Client"
                        variant="outlined"
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: '16px',
                          },  marginTop: '8px' 
                        }}
                        InputLabelProps={{ style: { color: 'black', fontWeight: 200 } }}
                      />
                    )}
                    disabled={clients.length === 0}
                  />
                </FormControl>
              </Grid>
            
              
               </>}


            </Grid>


          </Box>
        </Grid>

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
              Bank Statement Overview
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

          </Box>
        </Grid>





        <Grid item xs={12} sx={{marginBottom: '-18px', }}>
          <Typography sx={{fontStyle: 'italic', fontWeight: '100'}}>
            Generated CSV Files
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



        <Grid item xs={12} sx={{marginTop: '-12px', }}>
          <Typography sx={{fontStyle: 'italic'}}>
            <strong> Folder # </strong> {localStorage.getItem('currentTrId')}
          </Typography>
        </Grid>


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
              Use AI Categorizer
            </Typography>

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
      <CreateClientDialog open={createNewClient} onClose={() => setCreateNewClient(false)} 
      onSave={ async (data) => {
        const userId = await auth.currentUser.uid;
        const userDocRef = doc(db, 'users', userId);
        const clientsCollectionRef = collection(userDocRef, 'clients');
        try {
          const clientQuery = query(clientsCollectionRef, where('name', '==', data.name));
          const clientSnapshot = await getDocs(clientQuery);
      
          if (!clientSnapshot.empty) {
            console.log('Client with the same name already exists.');
            toast.error('A client with this name already exists.');
            return;
          }
      
          // Add the new client to the subcollection
          await addDoc(clientsCollectionRef, {
            name: data.name,
            type: data.type,
            industry: data.industry,
            purpose: data.purpose,
            createdAt: serverTimestamp(), // Optionally add a timestamp
          });
      
          toast.success('Client saved successfully!');
          console.log('Client saved successfully:', data);
      
        } catch (error) {
          console.error('Error saving client:', error);
          toast.error('Error saving client. Please try again.');
        }
      }}  />

      <Dialog open={openConfDial} onClose={() => setOpenConfDial(false)}>
        <DialogTitle>Confirm Assignment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to assign the bank statement to {clientTemp}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfDial(false)} color="primary">No</Button>
          <Button onClick={handleClientSelect} color="primary">Yes</Button>
        </DialogActions>
      </Dialog> 
    </Container>
  );

};

export default CsvFileViewer;

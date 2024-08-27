import React from 'react';
import { Grid, Box, Typography, IconButton } from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';
import { handleDownloadFile, mergeAndExportToExcel } from './util';

const GeneratedCsvFiles = ({ csvFiles, handleOpenDialog, assignedClientFile }) => {
    const [showExcel, setShowExcel] = React.useState(false);

    const MoneyInFile = csvFiles.find(file => file.filename === 'cat_money_in.csv');
    const MoneyOutFile = csvFiles.find(file => file.filename === 'cat_money_out.csv');

    React.useEffect(() => {
        if (MoneyInFile && MoneyInFile.parsedData?.length > 0 && MoneyOutFile && MoneyOutFile.parsedData?.length) {
            setShowExcel(true);
        }
    }, [MoneyInFile, MoneyOutFile]);

    return (
        <Grid container direction={'row'} spacing={3}>
            <Grid item xs={12} sx={{ marginBottom: '-18px' }}>
                <Typography sx={{ fontStyle: 'italic', fontWeight: '100' }}>Working Paper Files </Typography>
            </Grid>

            {showExcel && (
                <Grid item xs={12} sm={12} md={12}>
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
                        <Grid container sx={{ minHeight: '75px' }}>
                            <Grid item xs={1} sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                                <img src='/xlsx.png' style={{ height: '80%' }} alt="Excel Icon" />
                            </Grid>
                            <Grid item xs={10} sx={{ justifyContent: 'start', display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6">{`${assignedClientFile ? assignedClientFile.name : 'CATEGORIZED'}.xlsx`}</Typography>
                            </Grid>
                            <Grid item container direction={'column'} xs={1} sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                                <Grid item md={12} sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => mergeAndExportToExcel(
                                            `${assignedClientFile ? assignedClientFile.name : 'CATEGORIZED'}.xlsx`,
                                            MoneyInFile.parsedData,
                                            MoneyOutFile.parsedData
                                        )}
                                    >
                                        <DownloadOutlined />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            )}

            {csvFiles.length > 0 && csvFiles.map((file) => 
            {   
                if (file.filename === 'TRAINING_DATA_F32.csv' || file.filename === 'TRAINING_DATA_F31.csv') {
                    return null;
                }
                return (
                <Grid item xs={12} sm={6} md={6} key={file.filename?.replace('.csv', '')}>
                    <Box
                        onClick={() => handleOpenDialog(file)}
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <Grid container sx={{ minHeight: '75px' }}>
                            <Grid item xs={2} sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                                <img src='csv.png' style={{ height: '80%' }} alt="CSV Icon" />
                            </Grid>
                            <Grid item xs={9} sx={{ justifyContent: 'start', display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6">{file.filename?.replace('.csv', '')}</Typography>
                            </Grid>
                            <Grid item container direction={'column'} xs={1} sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                                <IconButton onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadFile(file);
                                }}>
                                    <DownloadOutlined color='primary'/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            )})}
        </Grid>
    );
};

export default GeneratedCsvFiles;

import * as XLSX from 'xlsx';
import { doc, getDoc, collection, query, getDocs, setDoc, where, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from '../../fire/init'; // Update the path to your Firebase config if needed
import { toast } from 'react-toastify';
import { baseUrl } from '../../static';



export const mergeAndExportToExcel = (
  fileName = 'categorized.xlsx',
  catMoneyIn = [],
  catMoneyOut = []
) => {
  const workbook = XLSX.utils.book_new();

  const formatCellsAsNumbers = (dataArray) => {
    return dataArray.map(row => {
      const formattedRow = {};
      Object.keys(row).forEach(key => {
        const value = row[key];
        // Check if the value is a number
        if (!isNaN(value) && value !== null && value !== '') {
          formattedRow[key] = parseFloat(value); // Convert to a number
        } else {
          formattedRow[key] = value; // Keep as is (text)
        }
      });
      return formattedRow;
    });
  };

  if (catMoneyIn && catMoneyIn.length > 0) {
    const formattedCatMoneyIn = formatCellsAsNumbers(catMoneyIn);
    const worksheet = XLSX.utils.json_to_sheet(formattedCatMoneyIn);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'F3-1');
  }

  if (catMoneyOut && catMoneyOut.length > 0) {
    const formattedCatMoneyOut = formatCellsAsNumbers(catMoneyOut);
    const worksheet = XLSX.utils.json_to_sheet(formattedCatMoneyOut);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'F3-2');
  }

  XLSX.writeFile(workbook, fileName);
};


export const fetchData = async (setClients, setSelectedClient, setAssignedClientFile, createNewClient) => {
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
          setClients([clientData]);
          setSelectedClient(clientData.name);
          setAssignedClientFile(clientData);
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

export const fetchCsvFiles = async (setCsvFiles,) => {

  
  const currentTrId = localStorage.getItem('currentTrId');
    
  if (!currentTrId) {
    console.error('No currentTrId found in localStorage');
    return;
  }
  const url = `${baseUrl}/files/${currentTrId}`;
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
      throw new Error(`Failed to get files: ${err.error}`);
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
          throw new Error(`Failed to get file: ${err.error}`);
        }

        const text = await fileResponse.text();
        const parsedData = parseCsv(text);
        return { filename, parsedData };
      })
    );

    setCsvFiles(csvData);
  } catch (error) {
    console.error('Error fetching CSV files:', error);
    throw error;
  }
};

export const parseCsv = (csvText) => {
  const [headerLine, ...lines] = csvText.split('\n').filter(Boolean);
  const headers = headerLine.split(',');

  return lines.map(line => {
    const values = line.split(',');
    return headers.reduce((acc, header, index) => {
      acc[header.trim()] = values[index] ? values[index].trim() : '';
      return acc;
    }, {});
  });
};

export const handleClientSelect = async (clientTemp, clients,purpose, setSelectedClient, setAssignedClientFile, setOpenConfDial) => {
  const clientName = clientTemp;
  const selectedClientData = clients.find(client => client.name === clientName);
  setSelectedClient(clientName);
  setAssignedClientFile(selectedClientData);
  if (selectedClientData) {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, 'users', userId);
    try {
      const currentTrId = localStorage.getItem('currentTrId');
      if (currentTrId) {
        const workingPaperDocRef = doc(userDocRef, 'wpf', currentTrId);
        await setDoc(workingPaperDocRef, {
          transformationId: currentTrId,
          title: purpose.title,
          purpose: purpose.purpose,
          assignedClientId: selectedClientData.id,
          createdAt: serverTimestamp(),
        }, { merge: true });

        setOpenConfDial(false);
      }
    } catch (error) {
      console.error('Error updating client working files:', error);
    }
  }
};

export const handleCategorize = async (method, setUpdate, update) => {
  const uniqueId = localStorage.getItem('currentTrId');
  const url = `${baseUrl}/categorize/${uniqueId}/${method}`;
  const authToken = await auth.currentUser.getIdToken();



  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Failed to categorize data: ${err.error}`);
    }

    setUpdate(update + 1);
  } catch (error) {
    console.error('Error categorizing data:', error);
    throw error;
  }
};

export const handleDownloadFile = (selectedFile) => {
  const { filename, parsedData } = selectedFile;
  const data = convertToCSV(parsedData)
  // Create a blob from the CSV content
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });

  // Create a download link and trigger it
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const saveClient = async (data) => {
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
}

export const saveWorkbook = async (file, name, type, setWorkBook) => {
  const url = `${baseUrl}/upload/excel`;
  
  try {
    const authToken = await auth.currentUser.getIdToken();
    const formData = new FormData();
    formData.append('file', file); // Append the file
    formData.append('clientName', name); // Append client name
    formData.append('type', type); // Append file type

    // Send the file to the server
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Failed to upload file: ${err.error}`);
    }

    // Parse and return the response
    const data = await response.json();
    console.log('File uploaded successfully:', data);
    setWorkBook(data);
    return data;

  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Re-throw the error for further handling if needed
  }
};


export function convertToCSV(data) {
  if (!data?.length) return '';

  const headers = Object.keys(data[0]).join(','); // Get the headers from the first object
  const rows = data.map(row =>
    Object.values(row)
      .map(value => {
        // If the value is undefined or null, convert it to an empty string
        if (value === undefined || value === null) return '';
        // If the value contains a comma, double quote, or newline, wrap it in double quotes
        const stringValue = String(value);
        if (/["\n,]/.test(stringValue)) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',')
  );

  return [headers, ...rows].join('\n');
}



// Function to send the CSV file to the server
export const sendCsvToServer = async (filename, data, onMessage) => {
  // Convert the data to CSV
  const authToken = await auth.currentUser.getIdToken();
  const uniqueId = localStorage.getItem('currentTrId');
  const csvString = convertToCSV(data);

  // Create a Blob from the CSV string
  const blob = new Blob([csvString], { type: 'text/csv' });

  // Create a FormData object
  const formData = new FormData();
  formData.append('file', blob, `${filename}.csv`);

  try {
    // Send the POST request to the server
    const response = await fetch(`${baseUrl}/files/${uniqueId}/${filename}.csv`, {
      method: 'POST',
      body: formData,
       headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const message = await response.json();
      onMessage(message)
    }
    onMessage('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};



export function formatDate(firebaseTimestamp) {
  if (firebaseTimestamp instanceof Timestamp) {
    const date = firebaseTimestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  } else {
    return ""; // Handle invalid timestamp case
  }
}



// Function to send the CSV file to the server
export const customCategorizer = async (onMessage, setLoading, setUpdate) => {
  // Convert the data to CSV
  const authToken = await auth.currentUser.getIdToken();
  const uniqueId = localStorage.getItem('currentTrId');

  setLoading(true);

  try {
    // Send the POST request to the server
    const response = await fetch(`${baseUrl}/custom/${uniqueId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const message = await response.json();
      setLoading(false);
      onMessage(message.error)

    } else {
      const message = await response.json();
      setLoading(false);
      setUpdate(9958445)
      onMessage(message.message)
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

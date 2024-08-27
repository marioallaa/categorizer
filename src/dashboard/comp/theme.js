import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  shape: {
    borderRadius: 8, // Apply 16px rounded border to all components
  },
  palette: {
    primary: {
      main: '#002EBA', // Primary blue color
    },
    secondary: {
      main: '#6a92ff', // Secondary lighter blue
    },
    background: {
      default: '#f6f5f7', // Background color
    },
    text: {
      primary: '#000a0e', // Dark text color
      secondary: '#636363', // Light text color
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    h1: {
      fontWeight: 800,
      color: '#000a0e',
    },
    body1: {
      fontSize: '14px',
      fontWeight: 100,
      lineHeight: '20px',
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px', // Rounded corners for Dialog paper
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // Rounded corners for TextField input
          overflow: 'hidden', // Ensures border radius is applied
        },
      },
    },
  },
});

export default theme;

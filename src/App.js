import React from "react";
// import ReactDOM from "react-dom";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./dashboard/comp/theme";
import { HashRouter as Router, Route, Routes,  } from "react-router-dom";
import Auth from "./auth/auth";
import PrivateRoute from "./fire/PrivateRoute";
import Header from "./dashboard/comp/header";
import Footer from "./dashboard/comp/footer";
import Home from "./dashboard/home/home";
import { ToastContainer } from "react-toastify";
import CsvFileViewer from "./dashboard/csv/categorizer";

function App() {

  return (
    <ThemeProvider theme={theme}>
    <Router>
        <Routes>
          <Route path="/" element={
              <PrivateRoute>
                <Header />
                  <Home/>
              </PrivateRoute>
            }
          />

        <Route path="/categorize" element={
              <PrivateRoute>
                <Header />
                  <CsvFileViewer/>
              </PrivateRoute>
            }
          />

          <Route path="/authenticate" element={<Auth />} />
        </Routes>
    </Router>
    
    <ToastContainer />

    <Footer />
    </ThemeProvider>
  );
}

export default App;

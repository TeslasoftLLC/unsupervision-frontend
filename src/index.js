import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LicenseInfo } from '@mui/x-license-pro';
import {createTheme, ThemeProvider} from "@mui/material";

LicenseInfo.setLicenseKey('7f0b887ec46303ae0cc86d57bd7c19c0Tz03ODQ1OSxFPTE3MzEyNDA5NzYwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#b7ff87',
        },
        secondary: {
            main: '#b7ff87',
        },
        purple: {
            main: '#ab71ec',
        },
        error: {
            main: '#db4437',
        },
        warning: {
            main: '#f4b400',
        },
        success: {
            main: '#0f9d58',
        }
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={darkTheme}>
        <App />
    </ThemeProvider>
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';  // ✅ Import Redux Provider
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';   // ✅ Import du store Redux
import { theme } from './styles/theme';
import { RentalPeriodProvider } from './contexts/RentalperiodContext';
import App from './App';
import './styles/main.scss';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>  {/* ✅ Fournit Redux à toute l'application */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RentalPeriodProvider>
        <App />
        </RentalPeriodProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b00', // Orange
      contrastText: '#fff',
    },
    secondary: {
      main: '#000000', // Black
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#ff6b00',
          '&:hover': {
            backgroundColor: '#e65c00',
          },
        },
      },
    },
  },
});
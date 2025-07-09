import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

// Create a context for the color mode
export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function Main() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#3b82f6', // Blue from style.tsx gradient
          },
          secondary: {
            main: '#22c55e', // Green from style.tsx
          },
          error: {
            main: '#ef4444', // Red from style.tsx
          },
          background: {
            default: mode === 'light' ? '#f9fafb' : '#374151', // Light gray / Dark gray
            paper: mode === 'light' ? '#ffffff' : '#4b5563', // White / Darker gray
          },
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
        },
      }),
    [mode],
  );

  return (
    <React.StrictMode>
      <BrowserRouter>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
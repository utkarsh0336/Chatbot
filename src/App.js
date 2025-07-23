import React, { useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material';
import darkTheme from './theme/darkTheme';
import DarkMode from '../DarkMode/DarkMode';
import "./DarkMode.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Dynamically create the theme
  const theme = useMemo(
    () =>
      darkMode
        ? darkTheme
        : createTheme({
            palette: {
              mode: 'light',
            },
          }),
    [darkMode]
  );

  // Handler for the custom DarkMode toggle
  const handleToggle = (e) => {
    setDarkMode(e.target.checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Custom DarkMode toggle, floating at bottom right */}
        <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }}>
          <DarkMode checked={darkMode} onChange={handleToggle} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <h1>Hello World!</h1>
          <p>This is a {darkMode ? 'dark' : 'light'} mode example.</p>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import './index.css'; // Import your styles
import Navbar from './shared/Navbar';
import { darkTheme, lightTheme } from './services/theme/theme';
import { ThemeProvider, useTheme } from './services/theme/ThemeContext';
import SearchComponent from './shared/search';

const AppContent = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/search" element={<SearchComponent />} />
        {/* <Route path="/watchlist" element={<Watchlist />} /> */}
        {/* <Route path="/portfolio" element={<Portfolio />} /> */}
        {/* <Route path="/details/:tickerSymbol" element={<Details />} /> */}

      </Routes>
    </MuiThemeProvider>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <Router>
      <AppContent />
    </Router>
  </ThemeProvider>
);

export default App;

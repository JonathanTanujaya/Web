import { Box, Toolbar, Typography, IconButton, useTheme, Fab } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode
import AddIcon from '@mui/icons-material/Add'; // Add icon for FAB
import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { ColorModeContext } from './main'; // Import the context

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';

const drawerWidth = 240;

function App() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAddTransactionClick = () => {
    navigate('/transactions'); // Navigate to transactions page to add a new one
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" className="gradient-bg" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Personal Finance Planner
          </Typography>
          <IconButton
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
            aria-label={theme.palette.mode === 'dark' ? 'toggle light mode' : 'toggle dark mode'}
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding component={Link} to="/">
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/transactions">
              <ListItemButton>
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText primary="Transactions" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/categories">
              <ListItemButton>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Categories" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%', // Ensure it takes full width available
          maxWidth: 'md', // Limit max width to Material-UI 'md' breakpoint
          mx: 'auto', // Center the content
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: theme.spacing(4),
          right: theme.spacing(4),
          className: 'floating-element', // Apply floating animation
        }}
        onClick={handleAddTransactionClick}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default App;

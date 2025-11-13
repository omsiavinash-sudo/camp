import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Layout() {
  const { user, logout } = useAuth();
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to={user?.role === 'admin' ? '/admin' : '/camps'}
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              '&:hover': { opacity: 0.8 } 
            }}
          >
            Camp Management
          </Typography>
          
          {user && (
            <>
              <Button color="inherit" component={Link} to="/camps">
                Camps
              </Button>
              <Button color="inherit" component={Link} to="/registration">
                Register
              </Button>
              {user.role === 'admin' && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/admin"
                  sx={{ fontWeight: 'bold' }}
                >
                  Dashboard
                </Button>
              )}
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ mr: 2 }}>
                  {user.username}
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={logout}
                  variant="outlined"
                  size="small"
                >
                  Logout
                </Button>
              </Box>
            </>
          )}
          
          {!user && (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              variant="outlined"
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;

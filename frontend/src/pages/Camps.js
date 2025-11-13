import React, { useState } from 'react';
import Registration from './Registration';
import CampCreation from './CampCreation';
import CampList from './CampList';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Camps() {
  // Display the registration form/list when navigating to /camps
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreated = () => {
    // Close dialog after a camp is created; parent can refresh lists here if needed
    setOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      {user?.role === 'admin' && (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Camp
          </Button>
        </Box>
      )}

      {/* Show camp list only */}
      <CampList />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Create New Camp</DialogTitle>
        <DialogContent dividers>
          <CampCreation onCreated={handleCreated} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Camps;

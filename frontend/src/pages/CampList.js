import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Button, Typography, CircularProgress, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function CampList() {
  const { user } = useAuth();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const [regsError, setRegsError] = useState('');
  // view dialog removed — show details inline at the bottom
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedDetailsCamp, setSelectedDetailsCamp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/camps')
      .then(res => setCamps(res.data))
      .catch(() => setError('Failed to load camps'))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenDialog = camp => {
    setSelectedCamp(camp);
    // fetch registrations for this camp and open dialog
    setRegsLoading(true);
    setRegsError('');
    setRegistrations([]);
    setOpenDialog(true);
    axios.get(`/api/registrations/camp/${camp.camp_id}`)
      .then(res => setRegistrations(res.data || []))
      .catch(() => setRegsError('Failed to load registrations for this camp'))
      .finally(() => setRegsLoading(false));
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCamp(null);
    setRegistrations([]);
    setRegsError('');
  };

  // handleOpenView removed; use handleOpenDetails to show details panel at bottom

  const handleOpenDetails = (camp) => {
    setSelectedDetailsCamp(camp);
    setDetailsDialogOpen(true);
  };
  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedDetailsCamp(null);
  };

  if (loading) return <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;
  if (!camps.length) return <Typography align="center">No camps found.</Typography>;

  return (
    <Paper sx={{ mb: 3 }}>
      <List>
        {camps.map(camp => (
          <ListItem key={camp.camp_id} divider>
            <ListItemText
              primary={camp.camp_name}
              secondary={`Date: ${new Date(camp.camp_date).toLocaleDateString()} | Location: ${camp.area}`}
            />
            <ListItemSecondaryAction>
              {user && user.role === 'admin' && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={() => handleOpenDetails(camp)}
                >
                  View
                </Button>
              )}
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/camps/${camp.camp_id}/registrations`)}
              >
                Open
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {/* Dialog for Open button */}
      {selectedCamp && (
        <Box>
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>Patients for {selectedCamp.camp_name}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { handleCloseDialog(); navigate(`/camps/${selectedCamp.camp_id}/register`); }}
                >
                  New Registration
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => { /* show details in panel */ handleCloseDialog(); handleOpenDetails(selectedCamp); }}
                >
                  Show Details
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => {
                    // export registrations to CSV
                    if (!registrations || !registrations.length) return;
                    const headers = ['Registration ID','OPD Number','First Name','Guardian Name','Age','Mobile','Aadhar','Camp ID'];
                    const rows = registrations.map(r => [r.registration_id, r.opd_number, r.first_name, r.guardian_name, r.age, r.mobile, r.aadhar, r.camp_id]);
                    const csvContent = [headers, ...rows].map(e => e.map(v => '"' + String(v ?? '') + '"').join(',')).join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedCamp.camp_name.replace(/\s+/g,'_')}_registrations.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export to CSV
                </Button>
              </Box>

              {regsLoading && <Box sx={{ textAlign: 'center', py: 2 }}><CircularProgress /></Box>}
              {regsError && <Typography color="error">{regsError}</Typography>}
              {!regsLoading && !regsError && (!registrations || registrations.length === 0) && (
                <Typography>No registrations found for this camp.</Typography>
              )}
              {!regsLoading && registrations && registrations.length > 0 && (
                <List>
                  {registrations.map(reg => (
                    <ListItem key={reg.registration_id} divider>
                      <ListItemText
                        primary={`${reg.opd_number} — ${reg.first_name}`}
                        secondary={`Guardian: ${reg.guardian_name || '-'} | Age: ${reg.age || '-'} | Mobile: ${reg.mobile || '-'} | Aadhar: ${reg.aadhar || '-'}`}
                      />
                      <ListItemSecondaryAction>
                        <Button size="small" onClick={() => navigate(`/registrations/${reg.registration_id}/exam`)}>View</Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}

            </DialogContent>
          </Dialog>
        </Box>
      )}

      {/* Inline details panel at the bottom */}
      {selectedDetailsCamp && (
        <Paper sx={{ mt: 3, p: 2 }} variant="outlined">
          <Typography variant="h6">{selectedDetailsCamp.camp_name}</Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{new Date(selectedDetailsCamp.camp_date).toLocaleDateString()}</Typography>
          <Typography variant="body2"><strong>Area:</strong> {selectedDetailsCamp.area}</Typography>
          {selectedDetailsCamp.district && <Typography variant="body2"><strong>District:</strong> {selectedDetailsCamp.district}</Typography>}
          {selectedDetailsCamp.mandal && <Typography variant="body2"><strong>Mandal:</strong> {selectedDetailsCamp.mandal}</Typography>}
          {selectedDetailsCamp.coordinator && <Typography variant="body2"><strong>Coordinator:</strong> {selectedDetailsCamp.coordinator}</Typography>}
          {selectedDetailsCamp.sponsor && <Typography variant="body2"><strong>Sponsor:</strong> {selectedDetailsCamp.sponsor}</Typography>}
          {selectedDetailsCamp.agenda && <Typography variant="body2" sx={{ mt: 1 }}>{selectedDetailsCamp.agenda}</Typography>}
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            {user && user.role === 'admin' && (
              <Button variant="contained" color="primary" onClick={() => navigate(`/camps/${selectedDetailsCamp.camp_id}/edit`)}>Edit</Button>
            )}
            <Button variant="outlined" onClick={() => setSelectedDetailsCamp(null)}>Close</Button>
          </Box>
        </Paper>
      )}

      {/* Details dialog showing camp info with Edit button */}
      {selectedDetailsCamp && (
        <Dialog open={detailsDialogOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
          <DialogTitle>Camp Details - {selectedDetailsCamp.camp_name}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle1"><strong>Date:</strong> {new Date(selectedDetailsCamp.camp_date).toLocaleDateString()}</Typography>
            <Typography variant="subtitle1"><strong>Area:</strong> {selectedDetailsCamp.area}</Typography>
            {selectedDetailsCamp.district && <Typography variant="subtitle1"><strong>District:</strong> {selectedDetailsCamp.district}</Typography>}
            {selectedDetailsCamp.mandal && <Typography variant="subtitle1"><strong>Mandal:</strong> {selectedDetailsCamp.mandal}</Typography>}
            {selectedDetailsCamp.coordinator && <Typography variant="subtitle1"><strong>Coordinator:</strong> {selectedDetailsCamp.coordinator}</Typography>}
            {selectedDetailsCamp.sponsor && <Typography variant="subtitle1"><strong>Sponsor:</strong> {selectedDetailsCamp.sponsor}</Typography>}
            {selectedDetailsCamp.agenda && <Typography variant="body2" sx={{ mt: 2 }}><strong>Agenda:</strong><br />{selectedDetailsCamp.agenda}</Typography>}
            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              {user && user.role === 'admin' && (
                <Button variant="contained" color="primary" onClick={() => { handleCloseDetails(); navigate(`/camps/${selectedDetailsCamp.camp_id}/edit`); }}>
                  Edit Camp
                </Button>
              )}
              <Button variant="outlined" onClick={handleCloseDetails}>Close</Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  );
}

export default CampList;

import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';

function CampCreation({ onCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    camp_name: '',
    camp_date: null,
    area: '',
    district: '',
    mandal: '',
    coordinator: '',
    sponsor: '',
    agenda: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure camp_date is sent as YYYY-MM-DD string
      const payload = {
        ...formData,
        camp_date: formData.camp_date ? new Date(formData.camp_date).toISOString().slice(0, 10) : null,
      };
      
      console.log('Submitting camp with payload:', payload);
      console.log('Auth token:', localStorage.getItem('token'));

      const response = await axios.post('/api/camps', payload);
      setSuccess(response.data?.message || 'Camp created successfully');
      // Optionally show created camp ID if returned by backend
      if (response.data?.campId) {
        setSuccess(`${response.data.message || 'Camp created successfully'} (ID: ${response.data.campId})`);
      }
      // Notify parent (e.g. to close dialog or refresh)
      if (typeof onCreated === 'function') onCreated(response.data);
      setFormData({
        camp_name: '',
        camp_date: null,
        area: '',
        district: '',
        mandal: '',
        coordinator: '',
        sponsor: '',
        agenda: '',
      });
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create camp');
      setSuccess('');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Only administrators can create camps.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Camp
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Camp Name"
                name="camp_name"
                value={formData.camp_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Camp Date"
                  value={formData.camp_date}
                  onChange={(date) => setFormData(prev => ({
                    ...prev,
                    camp_date: date
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} required fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Area"
                name="area"
                value={formData.area}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Mandal"
                name="mandal"
                value={formData.mandal}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Coordinator"
                name="coordinator"
                value={formData.coordinator}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Sponsor"
                name="sponsor"
                value={formData.sponsor}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Agenda"
                name="agenda"
                value={formData.agenda}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Create Camp
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default CampCreation;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Paper } from '@mui/material';
import axios from '../utils/axios';

function CampEdit() {
  const params = useParams();
  const id = params.camp_id || params.id;
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/camps/${id}`)
      .then(res => {
        const data = res.data || {};
        // normalize camp_date to YYYY-MM-DD (strip time) so we always send a DATE to backend
        if (data.camp_date && typeof data.camp_date === 'string' && data.camp_date.includes('T')) {
          data.camp_date = data.camp_date.slice(0, 10);
        }
        setCamp(data);
      })
      .catch(() => setError('Failed to load camp details'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    setCamp({ ...camp, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError(''); 
    setSuccess('');
    try {
      // send only the editable fields to backend
      const payload = {
        camp_name: camp.camp_name,
        // ensure camp_date is a YYYY-MM-DD string (MySQL DATE)
        camp_date: camp.camp_date ? (typeof camp.camp_date === 'string' ? camp.camp_date.slice(0, 10) : camp.camp_date) : null,
        area: camp.area,
        district: camp.district,
        mandal: camp.mandal,
        coordinator: camp.coordinator,
        sponsor: camp.sponsor,
        agenda: camp.agenda,
      };
      await axios.put(`/api/camps/${id}`, payload);
      setSuccess('Camp details updated successfully!');
      // Show success message briefly before navigating
      setTimeout(() => {
        // Navigate to the camps list page
        navigate('/camps');
      }, 1000);
    } catch (err) {
      console.error('Update error:', err);
      const msg = err?.response?.data?.message || err.message || 'Failed to update camp';
      setError(msg);
    }
  };

  if (loading) return <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!camp) return null;

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Edit Camp Details</Typography>
      <Box sx={{ mb: 2, bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Name:</strong> {camp.camp_name}<br/>
          <strong>Date:</strong> {camp.camp_date ? new Date(camp.camp_date).toLocaleDateString() : ''}<br/>
          <strong>Location:</strong> {camp.area}
        </Typography>
      </Box>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField
        label="Camp Name"
        name="camp_name"
        value={camp.camp_name || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Date"
        name="camp_date"
        type="date"
        value={camp.camp_date ? camp.camp_date.slice(0,10) : ''}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Location"
        name="area"
        value={camp.area || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="District"
        name="district"
        value={camp.district || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Mandal"
        name="mandal"
        value={camp.mandal || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Coordinator"
        name="coordinator"
        value={camp.coordinator || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Sponsor"
        name="sponsor"
        value={camp.sponsor || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Agenda"
        name="agenda"
        value={camp.agenda || ''}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>Save Changes</Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
      </Box>
    </Paper>
  );
}

export default CampEdit;

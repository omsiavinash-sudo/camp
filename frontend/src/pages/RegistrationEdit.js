import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Divider,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from '../utils/axios';

const FIELD_SIZES = {
  height: '50px',
  fontSize: '1.1rem',
  labelSize: '1rem',
  width: '100%',
};

const GUARDIAN_TYPES = [
  { id: 1, name: 'Father' },
  { id: 2, name: 'Husband' },
  { id: 3, name: 'Other' },
];

const MARITAL_STATUS = [
  { id: 1, name: 'Single' },
  { id: 2, name: 'Married' },
  { id: 3, name: 'Widowed' },
  { id: 4, name: 'Divorced' },
];

const CONSULTATION_REASONS = [
  { id: 1, name: 'Vaginal Discharge' },
  { id: 2, name: 'Bleeding While Periods' },
  { id: 3, name: 'Vagina Thrush' },
  { id: 4, name: 'Ulcer on Vagina' },
  { id: 5, name: 'Abdominal Pain' },
  { id: 6, name: 'Bleeding After Sex' },
  { id: 7, name: 'Pain During Intercourse' },
];

function RegistrationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`/api/registrations/${id}`);
        if (response.data) {
          setFormData({
            ...response.data,
            last_period_date: response.data.last_period_date ? new Date(response.data.last_period_date) : null,
            marriage_date: response.data.marriage_date ? new Date(response.data.marriage_date) : null,
          });
        }
      } catch (error) {
        console.error('Failed to fetch patient details:', error);
        setError('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientDetails();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const digits = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, mobile: digits }));
      return;
    }
    if (name === 'aadhar') {
      const digits = value.replace(/[^0-9]/g, '').slice(0, 12);
      setFormData(prev => ({ ...prev, aadhar: digits }));
      return;
    }
    if (name.endsWith('_id')) {
      const parsed = value === '' ? '' : parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: parsed }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Format dates properly
      const payload = {
        ...formData,
        last_period_date: formData.last_period_date ? formData.last_period_date.toISOString() : null,
        marriage_date: formData.marriage_date ? formData.marriage_date.toISOString() : null,
      };

      console.log('Submitting update with payload:', payload);

      const response = await axios.put(`/api/registrations/${id}`, payload);
      console.log('Update response:', response.data);
      
      setSuccess('Patient details updated successfully');
      // Navigate back to details view after short delay
      setTimeout(() => {
        navigate(`/registration/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Failed to update patient:', error);
      setError(error.response?.data?.message || 'Failed to update patient details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/registration/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!formData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">Patient not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Edit Patient Details</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>Personal Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="First Name"
                      name="first_name"
                      value={formData.first_name || ''}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Middle Name"
                      name="middle_name"
                      value={formData.middle_name || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name || ''}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age || ''}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Mobile"
                      name="mobile"
                      value={formData.mobile || ''}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">+91</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>Guardian Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Guardian Type</InputLabel>
                      <Select
                        name="guardian_type_id"
                        value={formData.guardian_type_id || ''}
                        onChange={handleChange}
                        label="Guardian Type"
                      >
                        {GUARDIAN_TYPES.map(type => (
                          <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Guardian Name"
                      name="guardian_name"
                      value={formData.guardian_name || ''}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>Medical Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Last Period Date"
                        value={formData.last_period_date}
                        onChange={(date) => setFormData(prev => ({ ...prev, last_period_date: date }))}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Marital Status</InputLabel>
                      <Select
                        name="marital_status_id"
                        value={formData.marital_status_id || ''}
                        onChange={handleChange}
                        label="Marital Status"
                      >
                        {MARITAL_STATUS.map(status => (
                          <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Marriage Date"
                        value={formData.marriage_date}
                        onChange={(date) => setFormData(prev => ({ ...prev, marriage_date: date }))}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Number of Children"
                      name="children_count"
                      type="number"
                      value={formData.children_count || 0}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Number of Abortions"
                      name="abortion_count"
                      type="number"
                      value={formData.abortion_count || 0}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>Additional Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Remarks"
                      name="remarks"
                      value={formData.remarks || ''}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default RegistrationEdit;
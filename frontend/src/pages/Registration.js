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
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from '../utils/axios';

// Field size constants for manual adjustment
const FIELD_SIZES = {
  height: '50px',      // Adjust this value to change field height
  fontSize: '1.1rem',  // Adjust this value to change text size
  labelSize: '1rem',   // Adjust this value to change label size
  width: '100%',       // This can be overridden in individual fields
};

// --- Constants ---
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

function Registration({ campId = '' }) {
  const [formData, setFormData] = useState({
  opd_number: '',
  registration_number: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    guardian_type_id: '',
    guardian_name: '',
    age: '',
    mobile: '',
    aadhar: '',
    email: '',
    last_period_date: null,
    marital_status_id: '',
    marriage_date: null,
    children_count: '',
    abortion_count: '',
    highest_education: '',
    employment: '',
    address: '',
    remarks: '',
    vaccination_awareness: false,
    previously_screened: false,
    consultation_reasons: [],
    camp_id: campId || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [camps, setCamps] = useState([]);

  useEffect(() => {
    // Generate OPD on mount
    const genOpd = () => {
      const date = new Date();
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const seq = Math.floor(100 + Math.random() * 900); // placeholder sequence
      const suffix = Math.floor(1000 + Math.random() * 9000);
      return `OPD-${y}${m}${d}-${String(seq).padStart(3,'0')}-${String(suffix).padStart(4,'0')}`;
    };
    setFormData(f => ({ ...f, opd_number: genOpd(), camp_id: campId || f.camp_id }));
  }, [campId]);

  useEffect(() => {
    // fetch available camps for dropdown
    let mounted = true;
    axios.get('/api/camps')
      .then(res => {
        if (!mounted) return;
        setCamps(res.data || []);
      })
      .catch(() => {
        if (!mounted) return;
        setCamps([]);
      });
    return () => { mounted = false; };
  }, []);

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
    // coerce id fields
    if (name.endsWith('_id')) {
      const parsed = value === '' ? '' : parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: parsed }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleGuardian = (id) => {
    setFormData(prev => ({ ...prev, guardian_type_id: prev.guardian_type_id === id ? '' : id }));
  };

  const handleToggleReason = (id) => {
    setFormData(prev => {
      const exists = prev.consultation_reasons.includes(id);
      return { ...prev, consultation_reasons: exists ? prev.consultation_reasons.filter(r => r !== id) : [...prev.consultation_reasons, id] };
    });
  };

  const validate = () => {
  if (!formData.first_name) return 'First name is required';
  if (!formData.last_name) return 'Last name is required';
  if (!formData.guardian_name) return 'Guardian name is required';
  if (!formData.guardian_type_id) return 'Please select guardian type (Father/Husband/Other)';
  if (!formData.age) return 'Age is required';
  if (!formData.mobile || String(formData.mobile).length !== 10) return 'Enter a valid 10-digit mobile number';
  if (!formData.aadhar || String(formData.aadhar).length !== 12) return 'Enter a valid 12-digit Aadhar number';
  // middle_name is optional, so no validation needed
  return null;
  };

  const toPayload = (data) => {
    // Convert date objects to YYYY-MM-DD
    const toSqlDate = (d) => {
      if (!d) return null;
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return null;
      return dt.toISOString().slice(0,10);
    };

    // Format mobile and aadhar to ensure they're strings
    const formatMobile = (m) => String(m).replace(/\D/g, '').slice(0, 10);
    const formatAadhar = (a) => String(a).replace(/\D/g, '').slice(0, 12);

    return {
      opd_number: data.opd_number,
      registration_number: data.registration_number || null,
      camp_id: data.camp_id,
      first_name: data.first_name.trim(),
      middle_name: data.middle_name ? data.middle_name.trim() : null,
      last_name: data.last_name.trim(),
      guardian_name: data.guardian_name.trim(),
      guardian_type_id: data.guardian_type_id || null,
      age: data.age ? parseInt(data.age,10) : null,
      mobile: formatMobile(data.mobile),
      aadhar: formatAadhar(data.aadhar),
      email: data.email,
      address: data.address,
      remarks: data.remarks,
      last_period_date: toSqlDate(data.last_period_date),
      marital_status_id: data.marital_status_id || null,
      marriage_date: toSqlDate(data.marriage_date),
      children_count: data.children_count ? parseInt(data.children_count,10) : 0,
      abortion_count: data.abortion_count ? parseInt(data.abortion_count,10) : 0,
      highest_education: data.highest_education,
      employment: data.employment,
      vaccination_awareness: !!data.vaccination_awareness,
      previously_screened: !!data.previously_screened,
      consultation_reasons: data.consultation_reasons || [],
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const v = validate();
    if (v) { setError(v); return; }
    try {
      const payload = toPayload(formData);
      const res = await axios.post('/api/registrations', payload);
      setSuccess(res.data?.message || 'Registration successful');
      // reset some fields but keep OPD regenerated
  setFormData(f => ({ ...f, opd_number: '', registration_number: '', first_name: '', last_name: '', middle_name: '', guardian_type_id: '', guardian_name: '', age: '', mobile: '', aadhar: '', email: '', address: '', remarks: '', last_period_date: null, marital_status_id: '', marriage_date: null, children_count: '', abortion_count: '', highest_education: '', employment: '', vaccination_awareness: false, previously_screened: false, consultation_reasons: [] }));
      // regenerate OPD
      const date = new Date();
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const seq = Math.floor(100 + Math.random() * 900);
      const suffix = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({ ...prev, opd_number: `OPD-${y}${m}${d}-${String(seq).padStart(3,'0')}-${String(suffix).padStart(4,'0')}` }));
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      setError(serverMsg || 'Registration failed. Please check your details.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, background: '#f6f9fc' }}>
      <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', px: 2 }}>
  <Paper elevation={4} sx={{ width: '100%', p: { xs: 2, md: 5 }, borderRadius: 4, boxShadow: 6, fontSize: '0.9rem' }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 3, letterSpacing: 1 }}>Patient Registration</Typography>
          {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.9rem' }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, fontSize: '0.9rem' }}>{success}</Alert>}
          <form onSubmit={handleSubmit} style={{ fontSize: '0.9rem' }}>
            {/* Personal Details Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Personal Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="OPD Number" name="opd_number" value={formData.opd_number} fullWidth disabled variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Registration Number" name="registration_number" value={formData.registration_number} onChange={handleChange} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    label="First Name" 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                    variant="outlined"
                    sx={{
                      '& .MuiInputBase-root': { height: FIELD_SIZES.height },
                      '& .MuiInputBase-input': { fontSize: FIELD_SIZES.fontSize },
                      '& .MuiInputLabel-root': { fontSize: FIELD_SIZES.labelSize }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth required variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Age" name="age" value={formData.age} onChange={handleChange} type="number" fullWidth required variant="outlined" inputProps={{ min: 0, max: 150, step: 1 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} fullWidth required variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start">+91</InputAdornment> }} helperText="10 digits" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Aadhar No" name="aadhar" value={formData.aadhar} onChange={handleChange} fullWidth required variant="outlined" inputProps={{ maxLength: 12 }} helperText="12 digits" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth variant="outlined" />
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 3 }} />
            {/* Guardian Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Guardian Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fbfd' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Guardian (select one)</Typography>
                    <FormGroup row>
                      {GUARDIAN_TYPES.map(type => (
                        <FormControlLabel key={type.id} control={<Checkbox checked={formData.guardian_type_id === type.id} onChange={() => handleToggleGuardian(type.id)} />} label={type.name} />
                      ))}
                    </FormGroup>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Guardian Name" name="guardian_name" value={formData.guardian_name} onChange={handleChange} fullWidth required variant="outlined" />
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 3 }} />
            {/* Medical Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Medical & Social Details</Typography>
              <Grid container spacing={2} wrap="wrap" alignItems="center">
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker label="Last Period Date" value={formData.last_period_date} onChange={(date) => setFormData(prev => ({ ...prev, last_period_date: date }))} renderInput={(params) => <TextField {...params} sx={{ width: 220, height: FIELD_SIZES.height }} variant="outlined" />} />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <FormControl sx={{ width: 220 }}>
                    <InputLabel sx={{ fontSize: FIELD_SIZES.labelSize }}>Marital Status</InputLabel>
                    <Select 
                      name="marital_status_id" 
                      value={formData.marital_status_id} 
                      onChange={handleChange} 
                      label="Marital Status"
                      sx={{ height: FIELD_SIZES.height, fontSize: FIELD_SIZES.fontSize }}
                    >
                      {MARITAL_STATUS.map(s => (
                        <MenuItem key={s.id} value={s.id} sx={{ fontSize: FIELD_SIZES.fontSize }}>{s.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker label="Marriage Date" value={formData.marriage_date} onChange={(date) => setFormData(prev => ({ ...prev, marriage_date: date }))} renderInput={(params) => <TextField {...params} sx={{ width: 220, height: FIELD_SIZES.height }} variant="outlined" />} />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <TextField label="No. of Children" name="children_count" type="number" value={formData.children_count} onChange={handleChange} sx={{ width: 220, height: FIELD_SIZES.height }} variant="outlined" inputProps={{ min: 0 }} />
                </Grid>
                <Grid item>
                  <TextField label="Abortions (if any)" name="abortion_count" type="number" value={formData.abortion_count} onChange={handleChange} sx={{ width: 220, height: FIELD_SIZES.height }} variant="outlined" inputProps={{ min: 0 }} />
                </Grid>
                <Grid item>
                  <FormControl sx={{ width: 220 }}>
                    <InputLabel sx={{ fontSize: FIELD_SIZES.labelSize }}>Highest Education</InputLabel>
                    <Select name="highest_education" value={formData.highest_education} onChange={handleChange} label="Highest Education" sx={{ height: FIELD_SIZES.height, fontSize: FIELD_SIZES.fontSize }}>
                      <MenuItem value="Graduate" sx={{ fontSize: FIELD_SIZES.fontSize }}>Graduate</MenuItem>
                      <MenuItem value="Intermediate" sx={{ fontSize: FIELD_SIZES.fontSize }}>Intermediate</MenuItem>
                      <MenuItem value="SSC" sx={{ fontSize: FIELD_SIZES.fontSize }}>SSC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <TextField label="Employment" name="employment" value={formData.employment} onChange={handleChange} sx={{ width: 220, height: FIELD_SIZES.height }} variant="outlined" />
                </Grid>
                <Grid item>
                  <FormControl sx={{ width: 220 }}>
                    <InputLabel sx={{ fontSize: FIELD_SIZES.labelSize }}>Camp Selection</InputLabel>
                    <Select
                      name="camp_id"
                      value={formData.camp_id}
                      onChange={handleChange}
                      label="Camp Selection"
                      sx={{ height: FIELD_SIZES.height, fontSize: FIELD_SIZES.fontSize }}
                    >
                      <MenuItem value="" sx={{ fontSize: FIELD_SIZES.fontSize }}>Select Camp</MenuItem>
                      {camps.map(c => (
                        <MenuItem key={c.camp_id} value={c.camp_id} sx={{ fontSize: FIELD_SIZES.fontSize }}>{`${c.camp_name} - ${new Date(c.camp_date).toLocaleDateString()}`}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <TextField label="Address" name="address" value={formData.address} onChange={handleChange} sx={{ width: 400 }} multiline minRows={2} maxRows={4} variant="outlined" />
                </Grid>
                <Grid item>
                  <TextField label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} sx={{ width: 400 }} multiline minRows={2} maxRows={4} variant="outlined" />
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 3 }} />
            {/* Screening & Awareness Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Screening & Awareness</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox checked={formData.vaccination_awareness} onChange={(e) => setFormData(prev => ({ ...prev, vaccination_awareness: e.target.checked }))} />} label="Awareness regarding Vaccination" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox checked={formData.previously_screened} onChange={(e) => setFormData(prev => ({ ...prev, previously_screened: e.target.checked }))} />} label="Has ever been screened" />
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 3 }} />
            {/* Reason for Consultation Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Reason for Consultation</Typography>
              <Paper sx={{ p: 2, background: '#f8fbfd' }} variant="outlined">
                <Grid container spacing={2}>
                  {CONSULTATION_REASONS.map(r => (
                    <Grid item xs={12} sm={6} md={4} key={r.id}>
                      <FormControlLabel
                        control={<Checkbox checked={formData.consultation_reasons.includes(r.id)} onChange={() => handleToggleReason(r.id)} />}
                        label={r.name}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontSize: 18, fontWeight: 600, letterSpacing: 1 }}>Register Patient</Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default Registration;

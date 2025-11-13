import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';

export default function CampRegistrations() {
  const { camp_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!camp_id) return;
    setLoading(true);
    setError('');
    axios.get(`/api/registrations/camp/${camp_id}`)
      .then(res => setRegistrations(res.data || []))
      .catch(() => setError('Failed to load registrations'))
      .finally(() => setLoading(false));
  }, [camp_id]);

  const handleExport = () => {
    if (!registrations || !registrations.length) return;
    const headers = [
      'Registration ID', 'OPD Number', 'First Name', 'Middle Name', 'Last Name', 'Age', 'Mobile', 'Aadhar', 'Email',
      'Guardian Type', 'Guardian Name', 'Last Period', 'Marital Status', 'Marriage Date', 'No of Children', 'Abortions',
      'Highest Education', 'Employment', 'Address', 'Remarks', 'Screening & Awareness', 'Previously Screened', 'Reason for Consultation', 'Camp ID'
    ];
    const rows = registrations.map(r => [
      r.registration_id,
      r.opd_number,
  r.first_name,
  r.middle_name,
  r.last_name,
      r.age,
      r.mobile,
      r.aadhar,
      r.email,
      r.guardian_type || r.guardian_type_name || '',
      r.guardian_name,
      r.last_period_date,
      r.marital_status || r.marital_status_name || '',
      r.marriage_date,
      r.children_count,
      r.abortion_count,
      r.highest_education,
      r.employment,
      r.address,
      r.remarks,
      r.vaccination_awareness ? 'Yes' : 'No',
      r.previously_screened ? 'Yes' : 'No',
      Array.isArray(r.consultation_reasons) ? r.consultation_reasons.join('; ') : (r.consultation_reasons || ''),
      r.camp_id
    ]);
    const csvContent = [headers, ...rows].map(e => e.map(v => '"' + String(v ?? '') + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `camp_${camp_id}_registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Registrations for Camp #{camp_id}</Typography>
          <Box>
            <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => navigate(`/camps/${camp_id}/register`)}>New Registration</Button>
            <Button variant="outlined" color="success" onClick={handleExport}>Export to CSV</Button>
          </Box>
        </Box>

        {loading && <Box sx={{ textAlign: 'center', py: 3 }}><CircularProgress /></Box>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && (!registrations || registrations.length === 0) && (
          <Typography>No registrations found for this camp.</Typography>
        )}

        {!loading && registrations && registrations.length > 0 && (
          <List>
            {registrations.map(reg => (
              <ListItem key={reg.registration_id} divider>
                <ListItemText
                  primary={`${reg.opd_number} — ${reg.first_name}`}
                  secondary={`Guardian: ${reg.guardian_name || '-'} | Age: ${reg.age || '-'} | Mobile: ${reg.mobile || '-'} | Aadhar: ${reg.aadhar || '-'}`}
                />
                <ListItemSecondaryAction>
                  <Button size="small" onClick={() => navigate(`/registration/${reg.registration_id}`)}>View Details</Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

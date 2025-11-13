import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import Registration from './Registration';
import axios from '../utils/axios';

function CampRegister() {
  const { camp_id } = useParams();
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/camps/${camp_id}`)
      .then(res => setCamp(res.data))
      .catch(() => setError('Failed to load camp details'))
      .finally(() => setLoading(false));
  }, [camp_id]);

  if (loading) return <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!camp) return null;

  return (
  <Paper sx={{ p: 3, width: '100%', maxWidth: '100%', mx: 'auto', mt: 4, fontSize: '0.9rem' }}>
      <Typography variant="h5" gutterBottom sx={{ fontSize: '0.9rem' }}>Register Patients for Camp</Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '0.9rem' }}>
        {camp.camp_name} | {new Date(camp.camp_date).toLocaleDateString()} | {camp.area}
      </Typography>
      <Registration campId={camp.camp_id} />
    </Paper>
  );
}

export default CampRegister;

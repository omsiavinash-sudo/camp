import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Button,
  CircularProgress,
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        console.log('Fetching patient details for ID:', id);
        const response = await axios.get(`/api/registrations/${id}`);
        if (response.data) {
          console.log('Received patient data:', response.data);
          setPatient(response.data);
        } else {
          console.error('No patient data received');
        }
      } catch (error) {
        console.error('Failed to fetch patient details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientDetails();
    }
  }, [id]);

  const handleExamination = () => {
    navigate(`/registrations/${id}/exam`);
  };

  const handleModify = () => {
    navigate(`/registration/${id}/edit`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
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
          <Typography variant="h5">Patient Details</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user?.role === 'admin' && (
              <Button 
                variant="contained" 
                color="secondary"
                onClick={handleModify}
              >
                Modify Details
              </Button>
            )}
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleExamination}
            >
              Start Doctor Examination
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/registrations/${id}/exam`, { state: { showPrevious: true } })}
            >
              View Previous Examinations
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>Personal Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">OPD Number</Typography>
                  <Typography variant="body1">{patient.opd_number}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                  <Typography variant="body1">
                    {`${patient.first_name} ${patient.middle_name || ''} ${patient.last_name}`.trim()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Age</Typography>
                  <Typography variant="body1">{patient.age}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Mobile</Typography>
                  <Typography variant="body1">{patient.mobile}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Aadhar</Typography>
                  <Typography variant="body1">{patient.aadhar}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{patient.email || 'Not provided'}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>Guardian Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Guardian Type</Typography>
                  <Typography variant="body1">{patient.guardian_type_id === 1 ? 'Father' : patient.guardian_type_id === 2 ? 'Husband' : 'Other'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Guardian Name</Typography>
                  <Typography variant="body1">{patient.guardian_name}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>Medical Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Last Period Date</Typography>
                  <Typography variant="body1">
                    {patient.last_period_date ? new Date(patient.last_period_date).toLocaleDateString() : 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Marital Status</Typography>
                  <Typography variant="body1">
                    {patient.marital_status_id === 1 ? 'Single' : 
                     patient.marital_status_id === 2 ? 'Married' : 
                     patient.marital_status_id === 3 ? 'Widowed' : 
                     patient.marital_status_id === 4 ? 'Divorced' : 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Marriage Date</Typography>
                  <Typography variant="body1">
                    {patient.marriage_date ? new Date(patient.marriage_date).toLocaleDateString() : 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Number of Children</Typography>
                  <Typography variant="body1">{patient.children_count || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Number of Abortions</Typography>
                  <Typography variant="body1">{patient.abortion_count || 0}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>Additional Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Highest Education</Typography>
                  <Typography variant="body1">{patient.highest_education || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Employment</Typography>
                  <Typography variant="body1">{patient.employment || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                  <Typography variant="body1">{patient.address || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Remarks</Typography>
                  <Typography variant="body1">{patient.remarks || 'None'}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default PatientDetails;
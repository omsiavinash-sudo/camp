import React, { useState, useEffect } from 'react';
import { 
  Typography,
  Button,
  Box,
  CircularProgress,
  ButtonGroup,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';

function RegistrationList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState(null);

    useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/registrations/camp/${id}`);
        const data = response.data || [];
        console.log('Fetched registrations:', data);
        
        // Ensure each registration has the required properties
        const processedData = data.map(reg => ({
          ...reg,
          registration_id: reg.registration_id || reg.id, // Fallback to id if registration_id is not present
          opd_number: reg.opd_number || `OPD-${reg.registration_id || reg.id}`
        }));
        
        setRegistrations(processedData);
      } catch (error) {
        console.error('Failed to fetch registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [id]);

  const handleViewDetails = (registrationId) => {
    if (!registrationId) {
      console.error('No registration ID provided');
      return;
    }
    // Navigate to patient details view
    console.log('Navigating to patient details:', registrationId);
    navigate(`/registration/${registrationId}`, { state: { fromList: true } });
  };

  const handleOpenExam = (registrationId) => {
    if (!registrationId) {
      console.error('No registration ID provided');
      return;
    }
    // Navigate to doctor examination view
    navigate(`/registrations/${registrationId}/exam`);
  };

  const handleDelete = async (registrationId) => {
    if (!registrationId) {
      console.error('No registration ID provided for deletion');
      return;
    }

    if (window.confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/registrations/${registrationId}`);
        // Refresh the list after deletion
        const response = await axios.get(`/api/registrations/camp/${id}`);
        const data = response.data || [];
        const processedData = data.map(reg => ({
          ...reg,
          registration_id: reg.registration_id || reg.id,
          opd_number: reg.opd_number || `OPD-${reg.registration_id || reg.id}`
        }));
        setRegistrations(processedData);
        alert('Registration deleted successfully');
      } catch (error) {
        console.error('Failed to delete registration:', error);
        alert('Failed to delete registration. Please try again.');
      }
    }
  };

  const handleNewRegistration = () => {
    navigate(`/camps/${id}/register`);
  };

  const handleExportCsv = () => {
    // TODO: Implement CSV export
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Registrations for Camp #{id}</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleNewRegistration}
        >
          NEW REGISTRATION
        </Button>
        <Button 
          variant="outlined"
          onClick={handleExportCsv}
        >
          EXPORT TO CSV
        </Button>
      </Box>

      {registrations.map((registration) => (
        <Box
          key={registration.registration_id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            p: 2,
            borderBottom: '1px solid #eee',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body1">
                {registration.opd_number || `OPD-${registration.registration_id}`} — {registration.first_name} {registration.last_name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => handleDelete(registration.registration_id)}
                  sx={{ minWidth: '80px' }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => handleViewDetails(registration.registration_id)}
                  sx={{ minWidth: '80px' }}
                >
                  View
                </Button>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Guardian: {registration.guardian_name} | Age: {registration.age} | Mobile: {registration.mobile} | Aadhar: {registration.aadhar}
            </Typography>
          </Box>
        </Box>
      ))}
      {registrations.length === 0 && (
        <Typography variant="body1" align="center" sx={{ py: 3 }}>
          No registrations found
        </Typography>
      )}
    </Box>
  );
}

export default RegistrationList;

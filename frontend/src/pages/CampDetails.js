
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Divider,
  TablePagination,
  Tooltip
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useParams, useNavigate } from 'react-router-dom';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from '../utils/axios';

function CampDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    campName: '',
    campDate: null,
    area: '',
    zilla: '',
    mandal: '',
    coordinator: '',
    sponsor: '',
    agenda: '',
  });

  const fetchCampDetails = async () => {
    try {
      const [campResponse, registrationsResponse] = await Promise.all([
        axios.get(`/api/camps/${id}`),
        axios.get(`/api/camps/${id}/registrations`)
      ]);

      setFormData({
        campName: campResponse.data.name,
        campDate: new Date(campResponse.data.dateOfCamp),
        area: campResponse.data.area || '',
        zilla: campResponse.data.zilla || '',
        mandal: campResponse.data.mandal || '',
        coordinator: campResponse.data.coordinator || '',
        sponsor: campResponse.data.sponsor || '',
        agenda: campResponse.data.agenda || '',
      });
      setRegistrations(registrationsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching camp details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampDetails();
  }, [id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenExam = (registrationId) => {
    navigate(`/doctor-exam/${registrationId}`);
  };

  const handleViewDetails = (registrationId) => {
    navigate(`/registration/${registrationId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, campDate: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to create camp
    alert('Camp created!');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#fafcfc' }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>Camp Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField 
              label="Camp Name" 
              name="campName" 
              value={formData.campName} 
              onChange={handleChange} 
              fullWidth 
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formData.campDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth disabled />}
                disabled
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Area" name="area" value={formData.area} onChange={handleChange} fullWidth disabled />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Zilla" name="zilla" value={formData.zilla} onChange={handleChange} fullWidth disabled />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Mandal" name="mandal" value={formData.mandal} onChange={handleChange} fullWidth disabled />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Coordinator" name="coordinator" value={formData.coordinator} onChange={handleChange} fullWidth disabled />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Sponsor" name="sponsor" value={formData.sponsor} onChange={handleChange} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Agenda" name="agenda" value={formData.agenda} onChange={handleChange} fullWidth multiline rows={3} disabled />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Registered Patients
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Registration No.</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Village</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>{registration.registrationNumber}</TableCell>
                    <TableCell>{registration.patientName}</TableCell>
                    <TableCell>{registration.age}</TableCell>
                    <TableCell>{registration.gender}</TableCell>
                    <TableCell>{registration.village}</TableCell>
                    <TableCell>
                      <Tooltip title="Start Examination">
                        <IconButton 
                          onClick={() => handleOpenExam(registration.id)}
                          color="primary"
                        >
                          <MedicalServicesIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          onClick={() => handleViewDetails(registration.id)}
                          color="info"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={registrations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default CampDetails;


import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  Alert, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  CircularProgress, 
  IconButton, 
  Grid,
  Paper,
  Stack,
  Card,
  CardContent,
  InputAdornment,
  Container 
} from '@mui/material';
// icons removed that were only used by the removed User Management section
import CampIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListIcon from '@mui/icons-material/List';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// ManageAccountsIcon removed (used in removed section)
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  
  const dashboardItems = [
    {
      title: 'Statistics',
      description: 'View overall statistics and recent activity',
      icon: <BarChartIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      onClick: () => navigate('/admin/statistics'),
      color: 'primary.light'
    },
    {
      title: 'Manage Camps',
      description: 'View and manage medical camps',
      icon: <CampIcon sx={{ fontSize: 60, color: 'success.main' }} />,
      onClick: () => navigate('/camps'),
      color: 'success.light'
    },
    {
      title: 'Create Camp',
      description: 'Create a new medical camp',
      icon: <AddIcon sx={{ fontSize: 60, color: 'info.main' }} />,
      onClick: () => navigate('/camps/create'),
      color: 'info.light'
    },
    {
      title: 'Registrations',
      description: 'View all camp registrations',
      icon: <PeopleIcon sx={{ fontSize: 60, color: 'warning.main' }} />,
      onClick: () => navigate('/registration'),
      color: 'warning.light'
    },
    {
      title: 'User Management',
      description: 'Manage system users and roles',
      icon: <ManageAccountsIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
      onClick: () => navigate('/admin/users'),
      color: 'secondary.light'
    }
  ];
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ 
    username: '', 
    mobile: '', 
    password: '', 
    role_id: '', 
    email: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword((show) => !show);
  // user management state removed
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalCamps: 0,
    upcomingCamps: 0,
    totalRegistrations: 0,
    totalUsers: 0,
    todayRegistrations: 0,
    recentCamps: [],
    recentRegistrations: []
  });
  const [loading, setLoading] = useState(true);

    // user deletion handler removed with the User Management UI

  const fetchStats = async () => {
    try {
      const [campsRes, registrationsRes, usersRes] = await Promise.all([
        axios.get('/api/camps'),
        axios.get('/api/registrations'),
        axios.get('/api/users')
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const camps = campsRes.data || [];
      const registrations = registrationsRes.data || [];
      const users = usersRes.data || [];

      const upcomingCamps = camps.filter(camp => new Date(camp.camp_date) >= today);
      const todayRegs = registrations.filter(reg => {
        const regDate = new Date(reg.created_at);
        regDate.setHours(0, 0, 0, 0);
        return regDate.getTime() === today.getTime();
      });

      setStats({
        totalCamps: camps.length,
        upcomingCamps: upcomingCamps.length,
        totalRegistrations: registrations.length,
        totalUsers: users.length,
        todayRegistrations: todayRegs.length,
        recentCamps: camps.slice(0, 5),
        recentRegistrations: registrations.slice(0, 5)
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRolesLoading(true);
    Promise.all([
      axios.get('/api/users/roles'),
      fetchStats()
    ]).then(([rolesRes]) => {
      setRoles(rolesRes.data);
    }).catch(() => {
      setRoles([]);
    }).finally(() => {
      setRolesLoading(false);
    });
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  };

  const handleDeleteUser = async (user_id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setError(''); setSuccess('');
    try {
      await axios.delete(`/api/users/${user_id}`);
      setSuccess('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.name === 'role_id' ? String(e.target.value) : e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/users', form);
      setSuccess('User created successfully!');
      // Reset form after successful submission
      setForm({ 
        username: '', 
        mobile: '', 
        password: '', 
        role_id: '', 
        email: '' 
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user');
    }
  };

  // User management form handlers removed

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">Total Camps</Typography>
              </Box>
              <Typography variant="h3" component="div">
                {loading ? <CircularProgress size={30} /> : stats.totalCamps}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                {stats.upcomingCamps} upcoming
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{
              bgcolor: 'success.light',
              color: 'success.contrastText',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalHospitalIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">Registrations</Typography>
              </Box>
              <Typography variant="h3" component="div">
                {loading ? <CircularProgress size={30} /> : stats.totalRegistrations}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                {stats.todayRegistrations} today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{
              bgcolor: 'info.light',
              color: 'info.contrastText',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">System Users</Typography>
              </Box>
              <Typography variant="h3" component="div">
                {loading ? <CircularProgress size={30} /> : stats.totalUsers}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Active accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3}
            sx={{
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarMonthIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">Recent Activity</Typography>
              </Box>
              <Typography variant="h3" component="div">
                {loading ? <CircularProgress size={30} /> : (stats.recentCamps.length + stats.recentRegistrations.length)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                New updates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minHeight: 200,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
            onClick={() => navigate('/camps')}
          >
            <CampIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom align="center">
              Manage Camps
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              View and manage existing camps
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minHeight: 200,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
            onClick={() => navigate('/camps/create')}
          >
            <AddIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom align="center">
              Create Camp
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Add a new medical camp
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minHeight: 200,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
            onClick={() => navigate('/registration')}
          >
            <PeopleIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom align="center">
              Registrations
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              View camp registrations
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minHeight: 200,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
            onClick={() => navigate('/admin/users')}
          >
            <ManageAccountsIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom align="center">
              User Management
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Manage system users and roles
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ mr: 1 }} />
              Recent Camps
            </Typography>
            <List>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : stats.recentCamps.length > 0 ? (
                stats.recentCamps.map((camp) => (
                  <ListItem 
                    key={camp.camp_id}
                    sx={{ 
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemText
                      primary={camp.camp_name}
                      secondary={`Date: ${new Date(camp.camp_date).toLocaleDateString()} | Location: ${camp.area}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary" align="center">No recent camps</Typography>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupsIcon sx={{ mr: 1 }} />
              Recent Registrations
            </Typography>
            <List>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : stats.recentRegistrations.length > 0 ? (
                stats.recentRegistrations.map((reg) => (
                  <ListItem 
                    key={reg.registration_id}
                    sx={{ 
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemText
                      primary={`${reg.first_name} (${reg.opd_number})`}
                      secondary={`Age: ${reg.age} | Mobile: ${reg.mobile}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary" align="center">No recent registrations</Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      
    </Box>
  );
}

export default AdminDashboard;

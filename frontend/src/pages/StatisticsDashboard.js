import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import axios from '../utils/axios';

function StatisticsDashboard() {
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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Statistics Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3}>
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

        <Grid item xs={12} sm={6} lg={3}>
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

        <Grid item xs={12} sm={6} lg={3}>
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

        <Grid item xs={12} sm={6} lg={3}>
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

      {/* Recent Activity Section */}
      <Grid container spacing={3}>
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

export default StatisticsDashboard;
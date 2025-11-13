import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
  MenuItem,
  IconButton,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import axios from '../utils/axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [form, setForm] = useState({ username: '', mobile: '', password: '', role_id: '', email: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // clear form on mount
    setForm({ username: '', mobile: '', password: '', role_id: '', email: '' });
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data || []);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    }
  };

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const res = await axios.get('/api/users/roles');
      setRoles(res.data || []);
    } catch (err) {
      setError('Failed to fetch roles');
      console.error(err);
    } finally {
      setRolesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'role_id' ? String(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/users', form);
      setSuccess('User created successfully!');
      setForm({ username: '', mobile: '', password: '', role_id: '', email: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      setSuccess('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, px: { xs: 2, md: 4 } }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4, letterSpacing: 1 }}>
        User Management
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonAddIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Create New User</Typography>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit} autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mobile"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    autoComplete="new-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" tabIndex={-1}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    type="email"
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Role"
                    name="role_id"
                    value={form.role_id}
                    onChange={handleChange}
                    fullWidth
                    required
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (!selected) return '';
                        return roles.find(r => String(r.role_id) === String(selected))?.role_name || '';
                      }
                    }}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="" disabled>
                      {rolesLoading ? <CircularProgress size={18} /> : null}
                    </MenuItem>
                    {roles.map(role => (
                      <MenuItem key={role.role_id} value={String(role.role_id)}>
                        {role.role_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ py: 1.2, fontWeight: 600 }}>
                    Create User
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GroupsIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>User List</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {users.map(user => (
                <ListItem key={user.user_id} secondaryAction={<IconButton edge="end" color="error" onClick={() => handleDeleteUser(user.user_id)}><DeleteIcon /></IconButton>} sx={{ bgcolor: 'background.paper', mb: 2, borderRadius: 2, boxShadow: 1 }}>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{user.username}</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">Mobile: {user.mobile} | Email: {user.email || '-'} | Role: {roles.find(r => r.role_id === Number(user.role_id))?.role_name || user.role_id}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserManagement;
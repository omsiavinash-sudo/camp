import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Camps from './pages/Camps';
import CampDetails from './pages/CampDetails';
import CampCreation from './pages/CampCreation';
import Registration from './pages/Registration';
import RegistrationList from './pages/RegistrationList';
import AdminDashboard from './pages/AdminDashboard';
import StatisticsDashboard from './pages/StatisticsDashboard';
import UserManagement from './pages/UserManagement';
import CampEdit from './pages/CampEdit';
import CampRegister from './pages/CampRegister';
import CampRegistrations from './pages/CampRegistrations';
import DoctorExam from './pages/DoctorExamFixed';
import PatientDetails from './pages/PatientDetails';
import RegistrationEdit from './pages/RegistrationEdit';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={
                <PrivateRoute>
                  {({ user }) => (
                    <Navigate to={user?.role === 'admin' ? '/admin' : '/camps'} replace />
                  )}
                </PrivateRoute>
              } />
              <Route path="camps" element={<PrivateRoute><Camps /></PrivateRoute>} />
              <Route path="camps/create" element={<PrivateRoute><CampCreation /></PrivateRoute>} />
              <Route path="camps/:id" element={<PrivateRoute><CampDetails /></PrivateRoute>} />
              <Route path="camps/:camp_id/edit" element={<PrivateRoute><CampEdit /></PrivateRoute>} />
              <Route path="camps/:camp_id/register" element={<PrivateRoute><CampRegister /></PrivateRoute>} />
              <Route path="camps/:camp_id/registrations" element={<PrivateRoute><CampRegistrations /></PrivateRoute>} />
              <Route path="registration/:id" element={<PrivateRoute><PatientDetails /></PrivateRoute>} />
              <Route path="registration/:id/edit" element={<PrivateRoute><RegistrationEdit /></PrivateRoute>} />
              <Route path="registration" element={<PrivateRoute><Registration /></PrivateRoute>} />
              <Route path="registrations/:id/exam" element={<PrivateRoute><DoctorExam /></PrivateRoute>} />
              <Route path="registrations" element={<PrivateRoute><RegistrationList /></PrivateRoute>} />
              <Route path="admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="admin/statistics" element={<PrivateRoute><StatisticsDashboard /></PrivateRoute>} />
              <Route path="admin/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
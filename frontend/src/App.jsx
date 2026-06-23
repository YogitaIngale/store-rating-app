import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import OwnerDashboard from './components/OwnerDashboard';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('session_user') || 'null'));

  const handleLoginSuccess = (session) => {
    localStorage.setItem('session_token', session.accessToken);
    localStorage.setItem('session_user', JSON.stringify(session.user));
    setUser(session.user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                user.role === 'Admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> :
                user.role === 'Owner' ? <OwnerDashboard user={user} onLogout={handleLogout} /> :
                <UserDashboard user={user} onLogout={handleLogout} />
              ) : <Navigate to="/login" />
            } 
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
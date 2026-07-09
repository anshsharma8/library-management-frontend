import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import Libraries from './pages/Libraries';
import Users from './pages/Users';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/books" element={
        <ProtectedRoute><Books /></ProtectedRoute>
      } />

      <Route path="/libraries" element={
        <ProtectedRoute><Libraries /></ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute adminOnly={true}><Users /></ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App
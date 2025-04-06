// src/Layout/RutaAdmin.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
import RutaProtegida from './RutaProtegida';

const RutaAdmin = ({ children }) => {
  const { auth } = useAuth();

  if (auth.rol !== 'admin') {
    return <Navigate to="/homeHs" replace />;
  }

  return <RutaProtegida>{children}</RutaProtegida>;
};

export default RutaAdmin;
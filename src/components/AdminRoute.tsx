import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser?.isAdmin ? children : <Navigate to="/" />;
}
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken, clearAuth, setLoading, setError } from '../features/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';

  const fetchUserDetails = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user details');
      const userData = await response.json();
      dispatch(setUser(userData));
    } catch {
      dispatch(setError('Failed to fetch user details'));
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  }, [API_URL, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(setLoading(true));
      fetchUserDetails(token);
    }
  }, [dispatch, fetchUserDetails]);

  const signup = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Failed to sign up');
      await response.json(); // La réponse est attendue mais pas utilisée
      dispatch(setUser({ email, isAdmin: false }));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Failed to login');
      const data = await response.json();
      dispatch(setToken(data.token));
      dispatch(setUser(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    dispatch(clearAuth());
  };

  return {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
  };
}

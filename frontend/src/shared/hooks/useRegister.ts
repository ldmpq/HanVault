import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../lib/axiosClient';
import { useAuthStore } from '../store/authStore';

export const useRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const response = await axiosClient.post('/auth/register', {
        displayName: name,
        name: name,
        email,
        password
      }, config);
      
      const accessToken = response.data.data?.tokens?.accessToken || response.data.accessToken;
      
      if (accessToken) {
        setToken(accessToken);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    agreeTerms, setAgreeTerms,
    loading, error, handleRegister
  };
};
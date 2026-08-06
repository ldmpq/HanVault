import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../lib/axiosClient';
import { useAuthStore } from '../store/authStore';

export const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const response = await axiosClient.post('/auth/login', { email, password }, config);
      const accessToken = 
        response.data.data?.tokens?.accessToken ||
        response.data.data?.accessToken ||
        response.data.accessToken ||
        response.data.token;
      
      if (accessToken) {
        setToken(accessToken);
        navigate('/dashboard');
      } else {
        setError('Đăng nhập thành công nhưng không tìm thấy Token.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    loading, error, handleSignIn
  };
};
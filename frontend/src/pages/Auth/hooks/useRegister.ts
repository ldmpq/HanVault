import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../shared/lib/axiosClient';
import { useAuthStore } from '../../../shared/store/authStore';

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
  const setUser = useAuthStore((state) => state.setUser);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }
    if (!agreeTerms) {
      setError('Bạn cần đồng ý với các Điều khoản và Điều kiện.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/auth/register', {
        email,
        password,
        displayName: name,
      });

      const accessToken = response.data.data?.tokens?.accessToken;
      const userData = response.data.data?.user;
      
      if (accessToken) {
        setToken(accessToken);
        if (userData && setUser) {
          setUser(userData);
        }
        navigate('/onboarding');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại sau.');
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
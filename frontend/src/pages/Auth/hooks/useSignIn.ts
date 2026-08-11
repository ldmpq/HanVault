import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../shared/lib/axiosClient';
import { useAuthStore } from '../../../shared/store/authStore';

export const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/auth/login', { email, password });

      const accessToken = response.data.data?.tokens?.accessToken;
      const userData = response.data.data?.user;
      
      if (accessToken) {
        setToken(accessToken);
        if (userData && setUser) {
          setUser(userData); 
        }
        navigate('/dashboard');
      } else {
        setError('Đăng nhập thành công nhưng không tìm thấy phiên bản bảo mật (Token).');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại sau.');
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
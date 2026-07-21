import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../shared/api/axiosClient';
import { useAuthStore } from '../store/authStore';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const accessToken = response.data.data?.tokens?.accessToken || response.data.accessToken;
      
      if (accessToken) {
        setToken(accessToken);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col items-center">

        <div className="w-12 h-12 bg-red-50 text-[#A82B2B] flex items-center justify-center rounded-xl mb-6">
          <span className="text-xl font-bold">中</span>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Unlock your potential</h1>
        <p className="text-sm text-gray-500 mb-8">Enter your vault to continue your mastery.</p>

        {error && (
          <div className="w-full mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Social Buttons */}
        <div className="w-full space-y-3 mb-8">
          <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors font-semibold text-sm text-gray-700">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="w-full relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative bg-white px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Or
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="w-full space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A82B2B] focus:ring-1 focus:ring-[#A82B2B] transition-all placeholder:text-gray-400 text-gray-800"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-[#A82B2B] hover:text-[#8b2323] uppercase tracking-widest">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A82B2B] focus:ring-1 focus:ring-[#A82B2B] transition-all placeholder:text-gray-400 text-gray-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A82B2B] hover:bg-[#8b2323] text-white font-semibold py-4 rounded-full transition-all mt-4 disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-600">
          New to HanVault?{' '}
          <Link to="/register" className="text-[#A82B2B] hover:text-[#8b2323] font-bold">
            Create an account
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest">
        © 2026 HANVAULT. CALMLY MASTER THE TONGUE.
      </div>
    </div>
  );
}
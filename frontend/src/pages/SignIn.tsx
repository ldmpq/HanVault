import React, { useState } from 'react';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../shared/api/axiosClient';
import { useAuthStore } from '../store/authStore';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
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

  return (
    <div className="h-screen w-full flex font-sans bg-white overflow-hidden">
      
      {/* ================= TRÁI: FORM ĐĂNG NHẬP ================= */}
      <div className="w-full lg:w-[45%] h-full overflow-y-auto flex flex-col custom-scrollbar">
        <div className="max-w-[400px] w-full mx-auto my-auto py-10 px-6">
          
          <div className="flex items-center gap-2 text-xl font-bold text-[#A82B2B] mb-8">
            <BookOpen className="w-6 h-6" /> HanVault
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Chào mừng trở lại</h1>
          <p className="text-gray-500 mb-6 text-sm font-medium">Tiếp tục hành trình chinh phục HSK của bạn.</p>

          <div className="flex bg-gray-100 p-1 rounded-xl w-full mb-6">
            <button className="w-1/2 py-2 bg-white rounded-lg shadow-sm text-[#A82B2B] font-bold text-sm">
              Login
            </button>
            <button 
              type="button"
              onClick={() => navigate('/register')} 
              className="w-1/2 py-2 text-gray-500 font-bold text-sm hover:text-gray-700 transition-colors"
            >
              Register
            </button>
          </div>

          {error && (
            <div className="w-full mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-100/80 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-100/80 border-none rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 tracking-widest text-sm font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 mb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-[#A82B2B] checked:border-[#A82B2B] cursor-pointer"
                  />
                  <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-[#A82B2B] hover:text-[#8b2323]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A82B2B] hover:bg-[#8b2323] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70 mt-2"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Or continue with</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xs font-bold text-gray-700">Google</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= PHẢI: VISUAL ARTWORK ================= */}
      <div className="hidden lg:flex w-[55%] h-full bg-[#F9F7F4] relative flex-col justify-center items-center p-12 border-l border-gray-100">
        
        {/* Decorative Zen Cards Simulation */}
        <div className="relative w-full max-w-md mb-12 scale-90 xl:scale-100 transition-transform">
          <div className="absolute top-[-25px] left-6 right-6 bg-white/40 backdrop-blur-sm p-4 rounded-3xl shadow-lg border border-white/50 flex gap-4 opacity-50 transform scale-95 z-0">
             <div className="w-24 h-16 bg-gray-200 rounded-xl"></div>
             <div className="flex-1 space-y-2 py-1">
                <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
             </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white flex gap-5 z-10 relative">
            {/* Nếu ảnh lỗi, nó sẽ fallback về div xám */}
            <div className="w-32 h-28 bg-gray-200 rounded-2xl shrink-0 overflow-hidden shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1599598425947-3300262914bf?w=400&q=80" 
                alt="Zen Bonsai" 
                className="w-full h-full object-cover"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
            <div className="flex-1 space-y-2.5 py-1 flex flex-col justify-center">
              <p className="text-sm font-bold text-gray-800">Welcome to Amity</p>
              <div className="h-5 w-full bg-gray-100 rounded-md"></div>
              <div className="h-5 w-full bg-gray-100 rounded-md"></div>
              <div className="h-6 w-1/2 bg-gray-200/60 rounded-full mt-1"></div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="absolute bottom-10 left-12 right-12 xl:bottom-16 xl:left-16 xl:right-16">
          <h2 className="text-3xl xl:text-4xl font-bold text-[#A82B2B] leading-snug mb-3 max-w-lg tracking-tight">
            "Hành trình ngàn dặm bắt đầu từ một bước chân" (千里之行始于足下)
          </h2>
          <p className="text-gray-700 font-bold text-sm xl:text-base flex items-center gap-2">
            <span className="w-6 h-0.5 bg-gray-400"></span> Lão Tử
          </p>
        </div>
      </div>

    </div>
  );
}
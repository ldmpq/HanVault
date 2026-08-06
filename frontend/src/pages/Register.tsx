import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useRegister } from '../shared/hooks/useRegister';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    agreeTerms, setAgreeTerms,
    loading, error, handleRegister
  } = useRegister();

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Bắt đầu hành trình chinh phục HSK của bạn ngay hôm nay."
      activeTab="register"
      quoteMain="Hành trình ngàn dặm bắt đầu từ một bước chân"
      quoteSub="(千里之行始于足下)"
    >
      {error && (
        <div className="w-full mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lao Tzu"
              className="w-full bg-gray-100/80 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="laotzu@example.com"
              className="w-full bg-gray-100/80 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 text-sm font-medium"
              required
            />
          </div>
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

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-100/80 border-none rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 tracking-widest text-sm font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center pt-1 mb-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-4 h-4">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-[#A82B2B] checked:border-[#A82B2B] cursor-pointer"
              />
              <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">
              I agree to the <a href="#" className="text-[#A82B2B] hover:underline font-bold">Terms and Conditions</a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#A82B2B] hover:bg-[#8b2323] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70 mt-2"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import { useSignIn } from './hooks/useSignIn';
import PasswordField from '../../shared/components/PasswordField';

export default function SignIn() {
  const [rememberMe, setRememberMe] = useState(false);

  const { 
    email, setEmail, 
    password, setPassword, 
    loading, error, handleSignIn 
  } = useSignIn();

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Tiếp tục hành trình chinh phục HSK của bạn."
      activeTab="login"
      quoteMain="Tri nhân giả trí, tự tri giả minh"
      quoteSub="(知人者智，自知者明)"
    >
      {error && (
        <div className="w-full mb-5 p-3 bg-brand/10 text-brand text-sm rounded-lg font-medium border border-brand/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-main mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-sub text-main text-sm font-medium"
            required
          />
        </div>

        <PasswordField 
          label="Password" 
          value={password} 
          onChange={setPassword} 
          required 
        />

        <div className="flex items-center justify-between pt-1 mb-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-4 h-4">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer appearance-none w-4 h-4 border border-line rounded bg-surface checked:bg-brand checked:border-brand cursor-pointer"
              />
              <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-xs font-medium text-sub group-hover:text-main transition-colors">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-xs font-bold text-brand hover:text-brand-hover">
            Bạn quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70 mt-2 shadow-sm"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </AuthLayout>
  );
}
import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import AuthLayout from './components/AuthLayout';
import { useRegister } from './hooks/useRegister';
import PasswordField from '../../shared/components/PasswordField';

const RequirementItem = ({ met, text, isTyping }: { met: boolean; text: string; isTyping: boolean }) => {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-300 ${
      met ? 'text-green-500' : (isTyping ? 'text-red-500' : 'text-sub')
    }`}>
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        isTyping ? <XCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />
      )}
      <span>{text}</span>
    </div>
  );
};

export default function Register() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    agreeTerms, setAgreeTerms,
    loading, error, handleRegister
  } = useRegister();

  const reqMinLength = password.length >= 8;
  const reqUppercase = /[A-Z]/.test(password);
  const reqNumber = /[0-9]/.test(password);
  const reqSpecial = /[^a-zA-Z0-9]/.test(password);

  const isTyping = password.length > 0;

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Bắt đầu hành trình chinh phục HSK của bạn ngay hôm nay."
      activeTab="register"
      quoteMain="Hành trình ngàn dặm bắt đầu từ một bước chân"
      quoteSub="(千里之行始于足下)"
    >
      {error && (
        <div className="w-full mb-5 p-3 bg-brand/10 text-brand text-sm rounded-lg font-medium border border-brand/20 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-main mb-1.5">Họ và tên</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Lao Tzu"
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-sub text-main text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-main mb-1.5">Địa chỉ email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="laotzu@example.com"
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-sub text-main text-sm font-medium"
              required
            />
          </div>
        </div>

        <div>
          <PasswordField 
            label="Mật khẩu" 
            value={password} 
            onChange={setPassword} 
            required 
          />
          
          {/* Checklist */}
          <div className="mt-2 flex flex-col gap-2.5 bg-line/20 p-3.5 rounded-xl border border-line/50">
            {/* 3. TRUYỀN THÊM PROP isTyping XUỐNG COMPONENT CON */}
            <RequirementItem met={reqMinLength} text="Ít nhất 8 ký tự" isTyping={isTyping} />
            <RequirementItem met={reqUppercase} text="Ít nhất 1 chữ cái in hoa" isTyping={isTyping} />
            <RequirementItem met={reqNumber} text="Ít nhất 1 chữ số" isTyping={isTyping} />
            <RequirementItem met={reqSpecial} text="Ít nhất 1 ký tự đặc biệt" isTyping={isTyping} />
          </div>
        </div>

        <PasswordField 
          label="Xác nhận mật khẩu" 
          value={confirmPassword} 
          onChange={setConfirmPassword} 
          required 
        />

        <div className="flex items-center pt-1 mb-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-4 h-4">
              <input
                type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                className="peer appearance-none w-4 h-4 border border-line rounded bg-surface checked:bg-brand checked:border-brand cursor-pointer"
              />
              <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-xs font-medium text-sub">
              Tôi đồng ý với <a href="#" className="text-brand hover:underline font-bold">Điều khoản và Điều kiện</a>
            </span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70 mt-2 shadow-sm flex justify-center items-center">
          {loading ? 'Creating account...' : 'Tạo tài khoản'}
        </button>
      </form>
    </AuthLayout>
  );
}
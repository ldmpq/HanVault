import { useState } from 'react';
import { Mail, Lock, Shield, Loader2, CheckCircle2, Circle, XCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axiosClient from '../../../shared/lib/axiosClient';
import { useAuthStore } from '../../../shared/store/authStore';

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

export default function AccountSecuritySection() {
  const user = useAuthStore((state) => state.user);

  const [editingEmail, setEditingEmail] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const getMaskedEmail = (email?: string) => {
    if (!email) return 'Chưa cập nhật email';
    const [namePart, domainPart] = email.split('@');
    if (!domainPart || namePart.length <= 2) return email;
    
    const firstChar = namePart.charAt(0);
    const lastChar = namePart.charAt(namePart.length - 1);
    const maskedName = `${firstChar}***${lastChar}`;
    
    return `${maskedName}@${domainPart}`;
  };

  const displayEmail = showEmail ? user?.email : getMaskedEmail(user?.email);

  const reqMinLength = newPassword.length >= 8;
  const reqUppercase = /[A-Z]/.test(newPassword);
  const reqNumber = /[0-9]/.test(newPassword);
  const reqSpecial = /[^a-zA-Z0-9]/.test(newPassword);

  const isTyping = newPassword.length > 0;

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin.' });
      return;
    }
    
    const isValidPassword = reqMinLength && reqUppercase && reqNumber && reqSpecial;

    if (!isValidPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới chưa đáp ứng đủ các yêu cầu bảo mật.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp. Vui lòng thử lại.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axiosClient.put('/auth/update-password', { 
        currentPassword, 
        newPassword 
      });
      
      if (response.data.success || response.status === 200) {
        setMessage({ type: 'success', text: response.data.message || 'Cập nhật mật khẩu thành công!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        
        setTimeout(() => {
          setEditingPassword(false);
          setMessage({ type: '', text: '' });
        }, 2000);
      }
    } catch (error: any) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Lỗi hệ thống hoặc mật khẩu hiện tại không đúng.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line space-y-6">
      <h2 className="text-lg font-bold text-main mb-2">Cài đặt bảo mật</h2>

      {/* ================= EMAIL ADDRESS ================= */}
      <div className="py-3 border-b border-line">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-app flex items-center justify-center text-sub">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-main">Địa chỉ Email</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs font-medium text-sub">{displayEmail}</p>
                {user?.email && (
                  <button 
                    onClick={() => setShowEmail(!showEmail)} 
                    className="text-sub hover:text-main transition-colors"
                    title={showEmail ? "Ẩn Email" : "Hiển thị Email"}
                  >
                    {showEmail ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setEditingEmail(!editingEmail)}
            className="text-xs font-bold text-brand bg-brand/10 hover:bg-brand/20 px-4 py-2 rounded-xl transition-colors"
          >
            {editingEmail ? 'Cancel' : 'Update'}
          </button>
        </div>
        
        {editingEmail && (
          <div className="mt-4 flex gap-2 animate-fade-in">
            <input 
              type="email" 
              placeholder="Nhập địa chỉ email mới" 
              className="flex-1 bg-app border border-line rounded-xl px-4 py-2 text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" 
            />
            <button className="bg-brand hover:bg-brand-hover text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
              Gửi mã xác nhận
            </button>
          </div>
        )}
      </div>

      {/* ================= PASSWORD UPDATE ================= */}
      <div className="py-3 border-b border-line">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-app flex items-center justify-center text-sub">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-main">Password</h3>
              <p className="text-xs text-sub tracking-widest mt-0.5">••••••••••••</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditingPassword(!editingPassword);
              setMessage({ type: '', text: '' }); 
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setShowCurrentPassword(false);
              setShowNewPassword(false);
              setShowConfirmPassword(false);
            }}
            className="text-xs font-bold text-brand bg-brand/10 hover:bg-brand/20 px-4 py-2 rounded-xl transition-colors"
          >
            {editingPassword ? 'Cancel' : 'Change'}
          </button>
        </div>

        {editingPassword && (
          <div className="mt-5 p-5 bg-app border border-line rounded-2xl flex flex-col gap-3 animate-fade-in relative">
            
            {message.text && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                {message.text}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-sub uppercase tracking-wider">Mật khẩu hiện tại</label>
              <div className="relative">
                <input 
                  type={showCurrentPassword ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại" 
                  className="w-full bg-surface border border-line text-main rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" 
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sub hover:text-main transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-sub uppercase tracking-wider">Mật khẩu mới</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới" 
                  className="w-full bg-surface border border-line text-main rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" 
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sub hover:text-main transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Checklist */}
              <div className="mt-2 flex flex-col gap-2.5 bg-line/20 p-3.5 rounded-xl border border-line/50">
                <RequirementItem met={reqMinLength} text="Ít nhất 8 ký tự" isTyping={isTyping} />
                <RequirementItem met={reqUppercase} text="Ít nhất 1 chữ in hoa" isTyping={isTyping} />
                <RequirementItem met={reqNumber} text="Ít nhất 1 chữ số" isTyping={isTyping} />
                <RequirementItem met={reqSpecial} text="Ít nhất 1 ký tự đặc biệt" isTyping={isTyping} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-sub uppercase tracking-wider">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới" 
                  className="w-full bg-surface border border-line text-main rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" 
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sub hover:text-main transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleUpdatePassword}
              disabled={isLoading}
              className="bg-brand hover:bg-brand-hover text-white px-5 py-2.5 mt-2 rounded-xl text-sm font-bold self-end flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu mật khẩu'}
            </button>
          </div>
        )}
      </div>

      {/* ================= 2FA (COMING SOON) ================= */}
      <div className="pt-2 space-y-3 opacity-60">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-app flex items-center justify-center text-sub">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-main">Xác thực hai yếu tố (2FA)</h3>
              <p className="text-xs text-sub mt-0.5">Tăng cường bảo mật cho tài khoản của bạn</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-sub uppercase tracking-wider bg-line px-3 py-1.5 rounded-lg">Soon</span>
        </div>
      </div>
    </div>
  );
}
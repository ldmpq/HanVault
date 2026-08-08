import { useState } from 'react';
import { Mail, Lock, Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axiosClient from '../../../shared/lib/axiosClient';

export default function AccountSecuritySection() {
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin.' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
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

      {/* Email Address */}
      <div className="py-3 border-b border-line">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-app flex items-center justify-center text-sub">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-main">Địa chỉ Email</h3>
              <p className="text-xs text-sub">user@example.com</p>
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
            <input type="email" placeholder="New email address" className="flex-1 bg-app border border-line rounded-xl px-4 py-2 text-sm text-main focus:outline-none focus:border-brand" />
            <button className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">Save</button>
          </div>
        )}
      </div>

      {/* Password Item */}
      <div className="py-3 border-b border-line">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-app flex items-center justify-center text-sub">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-main">Password</h3>
              <p className="text-xs text-sub tracking-widest">••••••••••••</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditingPassword(!editingPassword);
              setMessage({ type: '', text: '' }); 
              setCurrentPassword('');
              setNewPassword('');
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
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại" 
                className="w-full bg-surface border border-line text-main rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-sub uppercase tracking-wider">Mật khẩu mới</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới" 
                className="w-full bg-surface border border-line text-main rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" 
              />
            </div>
            <button 
              onClick={handleUpdatePassword}
              disabled={isLoading}
              className="bg-brand hover:bg-brand-hover text-white px-5 py-2.5 mt-2 rounded-xl text-sm font-bold self-end flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu mật khẩu'}
            </button>
          </div>
        )}
      </div>

      {/* 2FA */}
      <div className="pt-2 space-y-3 opacity-60">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-app flex items-center justify-center text-sub">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-main">Xác thực hai yếu tố (2FA)</h3>
              <p className="text-xs text-sub">Tăng cường bảo mật cho tài khoản của bạn</p>
            </div>
          </div>
          <span className="text-xs font-bold text-sub bg-line px-3 py-1.5 rounded-lg">Soon</span>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Mail, Lock, Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axiosClient from '../../../shared/lib/axiosClient';

export default function AccountSecuritySection() {
  const [editingEmail, setEditingEmail] = useState(false);
  
  // State quản lý đổi mật khẩu
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdatePassword = async () => {
    // 1. Validate form cơ bản
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
      // 2. Gọi API thật tới Backend
      const response = await axiosClient.put('/auth/update-password', { 
        currentPassword, 
        newPassword 
      });
      
      // 3. Xử lý thành công
      if (response.data.success || response.status === 200) {
        setMessage({ type: 'success', text: response.data.message || 'Cập nhật mật khẩu thành công!' });
        setCurrentPassword('');
        setNewPassword('');
        
        // Tự động đóng form sau 2 giây để UX mượt mà
        setTimeout(() => {
          setEditingPassword(false);
          setMessage({ type: '', text: '' });
        }, 2000);
      }
    } catch (error: any) {
      // 4. Bắt lỗi từ Server (Sai mật khẩu, lỗi server...)
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
    <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3] space-y-6">
      <h2 className="text-lg font-bold text-gray-900 mb-2">Cài đặt bảo mật</h2>

      {/* Email Address */}
      <div className="py-3 border-b border-[#ECE7E3]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Địa chỉ Email</h3>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          </div>
          <button 
            onClick={() => setEditingEmail(!editingEmail)}
            className="text-xs font-bold text-[#A82B2B] bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
          >
            {editingEmail ? 'Cancel' : 'Update'}
          </button>
        </div>
        {/* Tương lai có thể áp dụng API đổi email tương tự như đổi mật khẩu tại đây */}
        {editingEmail && (
          <div className="mt-4 flex gap-2 animate-fade-in">
            <input type="email" placeholder="New email address" className="flex-1 bg-[#FCFAF8] border border-[#ECE7E3] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A82B2B]" />
            <button className="bg-[#A82B2B] text-white px-4 py-2 rounded-xl text-sm font-bold">Save</button>
          </div>
        )}
      </div>

      {/* Password Item */}
      <div className="py-3 border-b border-[#ECE7E3]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Password</h3>
              <p className="text-xs text-gray-500 tracking-widest">••••••••••••</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditingPassword(!editingPassword);
              setMessage({ type: '', text: '' }); 
              setCurrentPassword(''); // Reset dữ liệu khi hủy
              setNewPassword('');
            }}
            className="text-xs font-bold text-[#A82B2B] bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
          >
            {editingPassword ? 'Cancel' : 'Change'}
          </button>
        </div>

        {/* Khối Form nhập liệu */}
        {editingPassword && (
          <div className="mt-5 p-5 bg-[#FCFAF8] border border-[#ECE7E3] rounded-2xl flex flex-col gap-3 animate-fade-in relative">
            
            {/* Thông báo kết quả / lỗi */}
            {message.text && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                {message.text}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mật khẩu hiện tại</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mật khẩu hiện tại" 
                className="w-full bg-white border border-[#ECE7E3] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-50 focus:border-[#A82B2B] transition-all" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mật khẩu mới</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới" 
                className="w-full bg-white border border-[#ECE7E3] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-50 focus:border-[#A82B2B] transition-all" 
              />
            </div>
            <button 
              onClick={handleUpdatePassword}
              disabled={isLoading}
              className="bg-[#A82B2B] hover:bg-[#8b2323] text-white px-5 py-2.5 mt-2 rounded-xl text-sm font-bold self-end flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Xác thực hai yếu tố (2FA)</h3>
              <p className="text-xs text-gray-500">Tăng cường bảo mật cho tài khoản của bạn</p>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">Soon</span>
        </div>
      </div>
    </div>
  );
}
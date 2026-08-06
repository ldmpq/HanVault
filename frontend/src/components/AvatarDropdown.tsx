import { useState, useRef, useEffect } from 'react';
import { Settings, AlertCircle, MessageSquare, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../shared/store/authStore';

export default function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const user = useAuthStore((state) => state.user);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  const displayUserName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Học giả HanVault');

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* ================= AVATAR BUTTON ================= */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full border-2 transition-all overflow-hidden flex items-center justify-center shadow-sm bg-gray-100 ${
          isOpen ? 'border-gray-300 ring-2 ring-gray-100' : 'border-transparent hover:border-gray-200'
        }`}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={displayUserName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#A82B2B] text-white font-bold flex items-center justify-center text-sm">
            {displayUserName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {/* ================= DROPDOWN MENU  ================= */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-gray-100 p-3 z-50 animate-fade-in origin-top-right">

          <div 
            onClick={() => { setIsOpen(false); navigate('/profile'); }}
            className="bg-white hover:bg-gray-50/80 p-3 rounded-xl transition-all cursor-pointer shadow-sm border border-gray-100 mb-2 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center border border-gray-100">
                 {user?.avatar ? (
                   <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-[#A82B2B] font-bold text-lg">
                     {displayUserName.charAt(0).toUpperCase()}
                   </span>
                 )}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-base font-bold text-gray-900 truncate group-hover:text-[#A82B2B] transition-colors">{displayUserName}</p>
                <p className="text-xs font-medium text-gray-500 truncate">{user?.email || 'Đang cập nhật...'}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-2.5">
              <div
                onClick={() => { setIsOpen(false); navigate('/profile'); }}
                className="w-full bg-[#F3F4F6] group-hover:bg-red-50 group-hover:text-[#A82B2B] text-gray-700 font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                Xem trang cá nhân <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Nhóm Tính năng & Cài đặt */}
          <div className="space-y-1">
            <button
              onClick={() => { setIsOpen(false); navigate('/settings'); }}
              className="w-full flex items-center justify-between p-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-gray-600" />
                </div>
                <span>Cài đặt</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button onClick={() => setIsOpen(false)} className="w-full flex items-center justify-between p-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-gray-600" />
                </div>
                <span>Báo cáo sự cố</span>
              </div>
            </button>

            <button onClick={() => setIsOpen(false)} className="w-full flex items-center justify-between p-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                </div>
                <span>Góp ý về HanVault</span>
              </div>
            </button>
          </div>

          {/* Đăng xuất */}
          <div className="mt-2 border-t border-gray-100 pt-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2.5 text-sm font-bold text-[#A82B2B] rounded-xl hover:bg-red-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-[#A82B2B]" />
              </div>
              <span>Đăng xuất</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
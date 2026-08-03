import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../shared/store/authStore';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Trang chủ', path: '/dashboard' },
    { name: 'Từ điển', path: '/dictionary' },
    { name: 'Dịch thuật', path: '/translate' },
    { name: 'Bộ thẻ', path: '/library' },
    { name: 'Luyện tập', path: '/review' },
    { name: 'Tiến trình', path: '/progress' },
    { name: 'Khóa học', path: '/courses' },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF8] font-sans flex flex-col">
      
      {/* Header / Top Navigation */}
      <header className="w-full flex items-center justify-between py-6 px-8 md:px-16 max-w-[1400px] mx-auto">
        <Link to="/dashboard" className="text-2xl font-bold text-[#A82B2B] tracking-tight">
          HanVault
        </Link>
        
        {/* Nav Links (Hidden on small mobile) */}
        <nav className="hidden md:flex gap-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`text-sm font-medium pb-2 transition-colors ${
                  isActive 
                    ? 'text-[#A82B2B] border-b-2 border-[#A82B2B]' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="text-xs font-semibold text-gray-600 hover:text-[#A82B2B] uppercase tracking-wide transition-colors"
          >
            Đăng xuất
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 md:px-16 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 mt-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xs">
            <div className="text-xl font-bold text-[#A82B2B] mb-4">HanVault</div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Calmly Master the Tongue. A premium learning environment for sophisticated Mandarin students.
            </p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
              © 2026 HanVault. All rights reserved.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-3 text-sm">
              <span className="font-bold text-gray-900">Platform</span>
              <Link to="#" className="text-gray-600 hover:text-[#A82B2B]">Philosophy</Link>
              <Link to="#" className="text-gray-600 hover:text-[#A82B2B]">Pricing</Link>
              <Link to="#" className="text-gray-600 hover:text-[#A82B2B]">Help Center</Link>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <span className="font-bold text-gray-900">Legal</span>
              <Link to="#" className="text-gray-600 hover:text-[#A82B2B]">Privacy</Link>
              <Link to="#" className="text-gray-600 hover:text-[#A82B2B]">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
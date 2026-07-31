import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, RefreshCw, TrendingUp, GraduationCap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#FCFAF8] font-sans selection:bg-red-100 selection:text-[#A82B2B] flex flex-col">
      
      {/* ================= HEADER / NAVIGATION ================= */}
      <header className="w-full flex items-center justify-between py-6 px-8 md:px-16 max-w-[1400px] mx-auto bg-transparent z-10">
        <Link to="/dashboard" className="text-2xl font-bold text-[#A82B2B] tracking-tight">
          HanVault
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="text-sm font-medium text-gray-600 hover:text-[#A82B2B] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Icons / Auth */}
        <div className="flex items-center gap-6 text-gray-600">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-[#A82B2B] text-white px-5 py-2.5 rounded-full hover:bg-[#8b2323] transition-colors"
          >
            Đăng ký
          </Link>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 md:px-16 pt-12 pb-24">
        
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          {/* Left: Text Content */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Master Chinese Vocabulary with <span className="text-[#A82B2B]">HanVault</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              The premium spaced-repetition platform for HSK 1-9 learners. Achieve fluency with effortless progress and cultural appreciation.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#A82B2B] hover:bg-[#8b2323] text-white px-8 py-3.5 rounded-xl font-semibold transition-transform hover:-translate-y-1 shadow-lg shadow-red-900/20"
              >
                Start Learning
              </button>
              <button 
                onClick={() => navigate('/courses')}
                className="bg-white border border-[#A82B2B] text-[#A82B2B] hover:bg-red-50 px-8 py-3.5 rounded-xl font-semibold transition-colors"
              >
                View Courses
              </button>
            </div>
          </div>
          
          {/* Right: Hero Illustration */}
          <div className="flex-1 w-full relative">
            <div className="aspect-square md:aspect-[4/3] w-full rounded-[2.5rem] bg-gradient-to-tr from-red-50 to-orange-50/50 shadow-sm border border-red-100 overflow-hidden relative flex items-center justify-center">
              {/* Bạn có thể thay thế hình ảnh 3D thật vào src bên dưới */}
              <img 
                src="https://images.unsplash.com/photo-1541959833400-049d37f98ccd?auto=format&fit=crop&w=800&q=80" 
                alt="HanVault Illustration" 
                className="w-full h-full object-cover opacity-90 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="flex flex-col items-center">
          <div className="text-center max-w-2xl mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Everything you need to succeed</h2>
            <p className="text-gray-600">
              Our tools are designed to reduce cognitive load and enhance retention during intensive study sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
            
            {/* Card 1: Tactile Flashcards (Large, span 7) */}
            <div className="md:col-span-7 bg-white rounded-[2rem] p-10 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-8 group hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="w-12 h-12 bg-red-100 text-[#A82B2B] rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Tactile Flashcards</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience high-quality physical cards in a digital format. Large, centered Hanzi with intuitive checking mechanisms.
                </p>
              </div>
              <div className="flex-1 w-full bg-red-50/50 rounded-2xl p-6 flex items-center justify-center border border-red-50 group-hover:scale-105 transition-transform">
                <div className="bg-white w-32 h-40 rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-100 relative">
                  <span className="text-5xl font-medium text-gray-900">学</span>
                  <span className="absolute bottom-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">HSK 1</span>
                </div>
              </div>
            </div>

            {/* Card 2: Smart SRS (Small, span 5) */}
            <div className="md:col-span-5 bg-white rounded-[2rem] p-10 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart SRS</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Optimized spaced repetition ensures you review at exactly the right time.
              </p>
              <div className="w-full h-24 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100/50 relative overflow-hidden flex items-end">
                 {/* Decorative Chart placeholder */}
                 <svg className="w-full h-16 text-orange-400 opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,100 L0,50 Q25,20 50,60 T100,10 L100,100 Z" fill="currentColor" />
                 </svg>
                 <svg className="absolute w-full h-16 text-orange-500" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M0,50 Q25,20 50,60 T100,10" />
                 </svg>
              </div>
            </div>

            {/* Card 3: Momentum Tracking (Small, span 5) */}
            <div className="md:col-span-5 bg-white rounded-[2rem] p-10 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#F4F1E1] text-[#9A8C46] rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Momentum Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Visualize your progress with satisfying gradient rings and daily streaks.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-gray-100 border-t-[#A82B2B] border-r-[#A82B2B] flex items-center justify-center transform -rotate-45">
                  <span className="text-lg font-bold text-gray-900 transform rotate-45">85%</span>
                </div>
              </div>
            </div>

            {/* Card 4: Curated Courses (Large, span 7) */}
            <div className="md:col-span-7 bg-white rounded-[2rem] p-10 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col-reverse md:flex-row items-center gap-8 hover:shadow-md transition-shadow">
              <div className="flex-1 w-full bg-gradient-to-br from-pink-50 to-red-50/20 rounded-2xl p-6 flex flex-col gap-2 border border-pink-50">
                {/* Decorative Course List */}
                <div className="bg-white/80 p-3 rounded-lg text-xs font-bold text-gray-400 border border-white">HSK 1 - Beginner</div>
                <div className="bg-white/80 p-3 rounded-lg text-xs font-bold text-gray-400 border border-white">HSK 2 - Elementary</div>
                <div className="bg-white/80 p-3 rounded-lg text-xs font-bold text-gray-400 border border-white">HSK 3 - Intermediate</div>
                <div className="bg-[#A82B2B] p-3 rounded-lg text-xs font-bold text-white shadow-sm">HSK 4 - Upper-Int</div>
              </div>
              <div className="flex-1">
                <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Curated Courses</h3>
                <p className="text-gray-600 leading-relaxed">
                  Follow a structured path from absolute beginner to advanced proficiency with our comprehensive HSK decks.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
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
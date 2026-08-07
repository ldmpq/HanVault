import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, RefreshCw, TrendingUp, GraduationCap } from 'lucide-react';

function LandingHeader() {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Features', path: '#features' },
    { name: 'HSK Levels', path: '#hsk' },
    { name: 'About', path: '#about' },
    { name: 'FAQ', path: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-border-line/50 transition-colors duration-300">
      <div className="flex items-center justify-between py-6 px-8 md:px-16 max-w-[1400px] mx-auto">
        <Link to="/" className="text-2xl font-bold text-[#A82B2B] tracking-tight">
          HanVault
        </Link>

        <nav className="hidden lg:flex gap-10 items-center">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.path}
              className="text-sm font-medium text-text-sub hover:text-text-main transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')} 
            className="text-sm font-medium text-text-sub hover:text-text-main transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="text-sm font-semibold bg-[#A82B2B] text-white px-6 py-2.5 rounded-full hover:bg-[#8b2323] transition-colors shadow-sm"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col lg:flex-row items-center gap-16 mb-32 pt-8">
      <div className="flex-1 max-w-xl">
        <h1 className="text-5xl md:text-6xl font-bold text-text-main mb-6 leading-[1.1] tracking-tight transition-colors duration-300">
          Master Chinese Vocabulary with <span className="text-[#A82B2B]">HanVault</span>
        </h1>
        <p className="text-lg text-text-sub mb-10 leading-relaxed transition-colors duration-300">
          The premium spaced-repetition platform for HSK learners. Achieve fluency with effortless progress, smart tracking, and cultural appreciation.
        </p>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/register')}
            className="bg-[#A82B2B] hover:bg-[#8b2323] text-white px-8 py-4 rounded-xl font-semibold transition-transform hover:-translate-y-1 shadow-lg shadow-red-900/20"
          >
            Get Started Free
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <div className="aspect-square md:aspect-[4/3] w-full rounded-[2.5rem] bg-gradient-to-tr from-red-50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/10 shadow-sm border border-border-line overflow-hidden relative flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1541959833400-049d37f98ccd?auto=format&fit=crop&w=800&q=80" 
            alt="HanVault App Interface Illustration" 
            className="w-full h-full object-cover opacity-90 mix-blend-multiply dark:mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-app via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="flex flex-col items-center scroll-mt-28">
      <div className="text-center max-w-2xl mb-16">
        <h2 className="text-4xl font-bold text-text-main mb-4 tracking-tight transition-colors duration-300">Everything you need to succeed</h2>
        <p className="text-text-sub transition-colors duration-300">
          Our tools are designed to reduce cognitive load and enhance retention during intensive study sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {/* Card 1 */}
        <div className="md:col-span-7 bg-bg-surface rounded-[2rem] p-10 border border-border-line shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:shadow-md transition-all duration-300">
          <div className="flex-1">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-[#A82B2B] rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-3">Tactile Flashcards</h3>
            <p className="text-text-sub leading-relaxed">
              Experience high-quality physical cards in a digital format. Large, centered Hanzi with intuitive checking mechanisms.
            </p>
          </div>
          <div className="flex-1 w-full bg-red-50/50 dark:bg-red-900/10 rounded-2xl p-6 flex items-center justify-center border border-border-line group-hover:scale-105 transition-transform">
            <div className="bg-bg-surface w-32 h-40 rounded-xl shadow-sm flex flex-col items-center justify-center border border-border-line relative">
              <span className="text-5xl font-medium text-text-main">学</span>
              <span className="absolute bottom-3 text-[10px] text-text-sub font-bold uppercase tracking-widest">HSK 1</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="md:col-span-5 bg-bg-surface rounded-[2rem] p-10 border border-border-line shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-text-main mb-3">Smart SRS</h3>
          <p className="text-text-sub leading-relaxed mb-6">
            Optimized spaced repetition ensures you review at exactly the right time.
          </p>
          <div className="w-full h-24 bg-gradient-to-r from-orange-50 dark:from-orange-900/20 to-transparent rounded-xl border border-border-line relative overflow-hidden flex items-end">
             <svg className="w-full h-16 text-orange-400 opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,100 L0,50 Q25,20 50,60 T100,10 L100,100 Z" fill="currentColor" />
             </svg>
             <svg className="absolute w-full h-16 text-orange-500" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M0,50 Q25,20 50,60 T100,10" />
             </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="md:col-span-5 bg-bg-surface rounded-[2rem] p-10 border border-border-line shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-[#F4F1E1] dark:bg-yellow-900/30 text-[#9A8C46] rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-3">Momentum Tracking</h3>
            <p className="text-text-sub leading-relaxed">
              Visualize your progress with satisfying gradient rings and daily streaks.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-border-line border-t-[#A82B2B] border-r-[#A82B2B] flex items-center justify-center transform -rotate-45">
              <span className="text-lg font-bold text-text-main transform rotate-45">85%</span>
            </div>
          </div>
        </div>

        {/* Card 4 - Đã đổi tên và content để thể hiện quy mô của sản phẩm SaaS */}
        <div id="hsk" className="md:col-span-7 bg-bg-surface rounded-[2rem] p-10 border border-border-line shadow-sm flex flex-col-reverse md:flex-row items-center gap-8 hover:shadow-md transition-all duration-300 scroll-mt-28">
          <div className="flex-1 w-full bg-gradient-to-br from-pink-50 dark:from-pink-900/20 to-red-50/20 dark:to-red-900/10 rounded-2xl p-6 flex flex-col gap-2 border border-border-line">
            <div className="bg-bg-surface p-3 rounded-lg text-xs font-bold text-text-sub border border-border-line">HSK 1 - Beginner</div>
            <div className="bg-bg-surface p-3 rounded-lg text-xs font-bold text-text-sub border border-border-line">HSK 2 - Elementary</div>
            <div className="bg-bg-surface p-3 rounded-lg text-xs font-bold text-text-sub border border-border-line">HSK 3 - Intermediate</div>
            <div className="bg-[#A82B2B] p-3 rounded-lg text-xs font-bold text-white shadow-sm border border-[#A82B2B]">HSK 4 - Upper-Int</div>
          </div>
          <div className="flex-1">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-3">Structured HSK 1–9 Path</h3>
            <p className="text-text-sub leading-relaxed">
              Follow a comprehensive learning path from absolute beginner to advanced proficiency with our meticulously structured vocabulary decks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="w-full border-t border-border-line mt-16 bg-bg-surface transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="max-w-xs">
          <div className="text-xl font-bold text-[#A82B2B] mb-4">HanVault</div>
          <p className="text-sm text-text-sub mb-6 leading-relaxed">
            Calmly Master the Tongue. A premium learning environment for sophisticated Mandarin students.
          </p>
          <p className="text-[10px] text-text-sub uppercase font-bold tracking-widest opacity-70">
            © 2026 HanVault. All rights reserved.
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-3 text-sm">
            <span className="font-bold text-text-main">Product</span>
            <a href="#features" className="text-text-sub hover:text-[#A82B2B] transition-colors">Features</a>
            <a href="#hsk" className="text-text-sub hover:text-[#A82B2B] transition-colors">HSK Levels</a>
            <a href="#" className="text-text-sub hover:text-[#A82B2B] transition-colors">Flashcards</a>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <span className="font-bold text-text-main">Resources</span>
            <a href="#" className="text-text-sub hover:text-[#A82B2B] transition-colors">Help Center</a>
            <a href="#" className="text-text-sub hover:text-[#A82B2B] transition-colors">Privacy Policy</a>
            <a href="#" className="text-text-sub hover:text-[#A82B2B] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN EXPORT (ORCHESTRATOR)
// ==========================================
export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-app font-sans selection:bg-red-100 selection:text-[#A82B2B] flex flex-col transition-colors duration-300">
      <LandingHeader />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 md:px-16 pt-4 pb-24">
        <HeroSection />
        <FeaturesSection />
      </main>

      <LandingFooter />
    </div>
  );
}
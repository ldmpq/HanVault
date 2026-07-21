import { Play, Star, ChevronLeft, ChevronRight, Zap, Volume2, CheckCircle2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFBF9] text-gray-900 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* 1. NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-50 text-[#A82B2B] flex items-center justify-center rounded-lg font-bold text-sm">
            中
          </div>
          <span className="font-bold text-xl tracking-tight">HanVault</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#dashboard" className="text-gray-900 border-b-2 border-[#A82B2B] pb-1">Dashboard</a>
          <a href="#library" className="hover:text-gray-900 transition-colors">Library</a>
          <a href="#review" className="hover:text-gray-900 transition-colors">Review</a>
          <a href="#progress" className="hover:text-gray-900 transition-colors">Progress</a>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-[#A82B2B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#8b2323] transition-colors">
            START FREE TRIAL
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-red-50 text-[#A82B2B] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          REDEFINING CHINESE HanVault
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Master Chinese with <br />
          <span className="text-[#A82B2B] italic font-serif">Elegance</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
          Experience a serene path to fluency. Our SRS-powered platform combines 
          cognitive science with premium aesthetics for the sophisticated learner.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-[#A82B2B] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#8b2323] transition-colors">
            Start Free Trial
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            <Play className="w-4 h-4 text-[#A82B2B]" /> View Philosophy
          </button>
        </div>
      </section>

      {/* Mockup / Image Placeholder */}
      <div className="max-w-md mx-auto px-6 mb-24">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-red-900/5 border border-gray-100 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-8">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase">Daily Progress</p>
              <p className="text-xs text-gray-400">JULY 24, 2024</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>
          </div>
          {/* Vòng tròn Progress ảo */}
          <div className="w-48 h-48 rounded-full border-[12px] border-red-50 border-t-[#A82B2B] flex flex-col items-center justify-center mb-8">
            <span className="text-4xl font-bold">75%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Of Daily Goal</span>
          </div>
          <div className="flex gap-4 w-full">
            <div className="flex-1 bg-red-50 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-gray-500 mb-1">NEW WORDS</p>
              <p className="text-xl font-bold">12</p>
            </div>
            <div className="flex-1 bg-red-50 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-gray-500 mb-1">ACCURACY</p>
              <p className="text-xl font-bold">94%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BENTO GRID FEATURES SECTION */}
      <section className="max-w-5xl mx-auto px-6 mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Precision Meets Mindfulness</h2>
          <p className="text-gray-500">Tools designed for the serious student, wrapped in a distraction-free environment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Adaptive SRS */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="w-12 h-12 bg-red-50 text-[#A82B2B] rounded-full flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Adaptive Spaced Repetition</h3>
            <p className="text-gray-500 max-w-sm">Our algorithm learns your forgetting curve and presents characters just as they slip from memory.</p>
          </div>

          {/* Card 2: HSK Optimized */}
          <div className="bg-[#F2E5E5] rounded-[2rem] p-10 flex flex-col justify-center">
            <div className="w-12 h-12 bg-white/50 text-[#A82B2B] rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-6">HSK 1-6 Optimized</h3>
            <div className="w-full bg-white/40 h-2 rounded-full overflow-hidden mb-2">
              <div className="w-[88%] h-full bg-[#A82B2B] rounded-full"></div>
            </div>
            <p className="text-[10px] font-bold text-[#A82B2B] uppercase tracking-widest">CURRICULUM COVERAGE: 88%</p>
          </div>

          {/* Card 3: Native Audio */}
          <div className="bg-[#A82B2B] rounded-[2rem] p-10 text-white flex flex-col justify-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Native Audio Clarity</h3>
            <p className="text-red-100 text-sm">Studio-grade recordings from native speakers to perfect your tones and rhythm.</p>
          </div>

          {/* Card 4: Sanctuary */}
          <div className="md:col-span-2 bg-[#FCF7F7] rounded-[2rem] p-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-sm">
              <h3 className="text-xl font-bold mb-3">A Sanctuary for Focus</h3>
              <p className="text-gray-500">No gamified gimmicks. Just you, the characters, and the calm pursuit of HanVault.</p>
            </div>
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#A82B2B]/30 flex items-center justify-center text-4xl text-[#A82B2B] font-serif">
              悟
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="bg-[#FDF9F7] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold max-w-sm leading-tight">Loved by students who value serenity over streaks.</h2>
            <div className="hidden sm:flex gap-4">
              <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: "The minimalist interface finally allowed me to focus on the actual grammar rather than flashing icons and bells.",
                name: "Elena R.",
                role: "HanVault STUDENT"
              },
              {
                text: "Hanyu Pro feels like a high-end fountain pen compared to the crayon-like feel of other apps. Professional and powerful.",
                name: "Mark J.",
                role: "SENIOR DEVELOPER"
              },
              {
                text: "The native audio is crystal clear. I've finally cracked my tone issues after years of struggling with robotic voices.",
                name: "Chen L.",
                role: "LANGUAGE SPECIALIST"
              }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-6 text-[#A82B2B]">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-gray-600 italic mb-8">"{review.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${review.name}`} alt={review.name} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{review.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-[#A82B2B] rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
          {/* Pattern Overlay (Dotted) */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Journey to Fluency Starts Here</h2>
            <p className="text-red-100 mb-10 max-w-xl mx-auto">
              Join HanVault to mastering Chinese with elegance and scientific precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="bg-white text-[#A82B2B] px-10 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
                Start 14-Day Free Trial
              </button>
              <span className="text-xs font-bold text-red-200 uppercase tracking-widest">No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#A82B2B] text-white flex items-center justify-center rounded text-[10px] font-bold">
            中
          </div>
          <span className="font-bold text-lg text-[#A82B2B]">HanVault</span>
        </div>
        
        <div className="flex gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <a href="#" className="hover:text-gray-900 transition-colors">Philosophy</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Help Center</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <p className="text-xs md:hidden lg:block hidden">© 2026 HanVault. Calmly Master the Tongue.</p>
          <a href="#" className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:text-gray-900 hover:border-gray-900 transition-colors">
            <Globe className="w-4 h-4" />
          </a>
        </div>
      </footer>

    </div>
  );
}
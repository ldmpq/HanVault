import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  activeTab: 'login' | 'register';
  quoteMain: string;
  quoteSub: string;
}

function ArtworkCard({ title, imageSrc }: { title: string; imageSrc: string }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white flex p-2.5 w-full hover:scale-[1.02] transition-transform duration-300">

      <div className="w-[60%] aspect-[4/3] rounded-[18px] overflow-hidden shrink-0 shadow-inner relative bg-[#F3ECE3]">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => e.currentTarget.style.display = 'none'} // Ẩn nếu đường dẫn ảnh sai
        />
      </div>
      
      {/* Nửa phải: Form Mockup chiếm 40% */}
      <div className="w-[40%] pl-4 pr-2 flex flex-col justify-center">
        <h3 className="text-[13px] font-bold text-gray-800 mb-3 tracking-tight">{title}</h3>
        
        {/* Mockup Input Username */}
        <div className="h-6 w-full bg-gray-50 rounded-[6px] mb-2 flex items-center px-2.5">
          <span className="text-[8px] text-gray-400 font-medium">Username</span>
        </div>
        
        {/* Mockup Input Password */}
        <div className="h-6 w-full bg-gray-50 rounded-[6px] mb-3.5 flex items-center px-2.5">
          <span className="text-[8px] text-gray-400 font-medium">Password</span>
        </div>
        
        {/* Mockup Button Sign In */}
        <div className="h-7 w-full bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center">
          <span className="text-[9px] text-gray-500 font-bold">Sign In</span>
        </div>
      </div>
      
    </div>
  );
}

export default function AuthLayout({ children, title, subtitle, activeTab, quoteMain, quoteSub }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex font-sans bg-white overflow-hidden animate-fade-in">
      
      {/* ================= ĐỊNH NGHĨA ANIMATION ================= */}
      <style>{`
        @keyframes scrollVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-vertical {
          animation: scrollVertical 25s linear infinite;
        }
        .animate-scroll-vertical:hover {
          animation-play-state: paused;
        }

        @keyframes slideFadeX {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-fade-x {
          animation: slideFadeX 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideFadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-fade-up {
          animation: slideFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* ================= TRÁI: FORM ================= */}
      <div className="w-full lg:w-[45%] h-full overflow-y-auto flex flex-col custom-scrollbar bg-white z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="max-w-[440px] w-full mx-auto my-auto py-12 px-6">
          <div className="flex items-center gap-2 text-xl font-bold text-[#A82B2B] mb-12">
            <BookOpen className="w-6 h-6" /> HanVault
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h1>
          <p className="text-gray-500 mb-8 text-[15px] font-medium">{subtitle}</p>

          <div className="flex bg-[#F3F4F6] p-1.5 rounded-xl w-full mb-8">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={`w-1/2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === 'login' ? 'bg-white shadow-sm text-[#A82B2B]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className={`w-1/2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === 'register' ? 'bg-white shadow-sm text-[#A82B2B]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          <div key={activeTab} className="animate-slide-fade-x">
            {children}
          </div>
        </div>
      </div>

      {/* ================= PHẢI: VISUAL ARTWORK ================= */}
      <div className="hidden lg:flex w-[55%] h-full bg-[#F9F7F4] relative flex-col justify-center items-center border-l border-gray-100 overflow-hidden">
        
        <div 
          className="absolute inset-0 flex justify-center pt-8"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 75%, transparent 100%)'
          }}
        >
          <div className="w-full max-w-[460px] relative h-full">
            {/* Cột xoay vòng ảnh */}
            <div className="absolute inset-x-0 top-0 animate-scroll-vertical">
              
              {/* SET 1 */}
              <div className="flex flex-col gap-8 pb-8">
                <ArtworkCard title="Welcome to HanVault" imageSrc="/images/zen01.jpg" />
                <ArtworkCard title="Master Vocabulary" imageSrc="/images/zen02.jpg" />
                <ArtworkCard title="Track Your Progress" imageSrc="/images/zen03.jpg" />
              </div>
              
              {/* SET 2 */}
              <div className="flex flex-col gap-8 pb-8">
                <ArtworkCard title="Welcome to HanVault" imageSrc="/images/zen01.jpg" />
                <ArtworkCard title="Master Vocabulary" imageSrc="/images/zen02.jpg" />
                <ArtworkCard title="Track Your Progress" imageSrc="/images/zen03.jpg" />
              </div>

            </div>
          </div>
        </div>

        {/* Quote */}
        <div key={quoteMain} className="absolute bottom-12 left-16 right-16 z-20 animate-slide-fade-up">
          <h2 className="text-[32px] xl:text-[40px] font-bold text-[#A82B2B] leading-tight mb-5 max-w-xl tracking-tight">
            "{quoteMain}"
            {quoteSub && <span className="block mt-1 text-2xl font-medium opacity-90">{quoteSub}</span>}
          </h2>
          <div className="flex items-center gap-4">
            <span className="w-10 h-[2px] bg-gray-400"></span>
            <span className="text-gray-700 font-bold text-base tracking-wide">Lão Tử</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
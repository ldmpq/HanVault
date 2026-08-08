import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ArtworkCard from './ArtworkCard';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  activeTab: 'login' | 'register';
  quoteMain: string;
  quoteSub: string;
}

export default function AuthLayout({ children, title, subtitle, activeTab, quoteMain, quoteSub }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex font-sans bg-app text-main overflow-hidden animate-fade-in transition-colors">
      
      {/* ================= TRÁI: FORM ================= */}
      <div className="w-full lg:w-[45%] h-full overflow-y-auto flex flex-col custom-scrollbar bg-app z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="max-w-[440px] w-full mx-auto my-auto py-12 px-6">
          <div className="flex items-center gap-2 text-xl font-bold text-brand mb-12">
            <BookOpen className="w-6 h-6" /> HanVault
          </div>

          <h1 className="text-4xl font-bold text-main mb-2 tracking-tight">{title}</h1>
          <p className="text-sub mb-8 text-[15px] font-medium">{subtitle}</p>

          <div className="flex bg-surface p-1.5 rounded-xl w-full mb-8 border border-line">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={`w-1/2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === 'login' ? 'bg-app shadow-sm text-brand' : 'text-sub hover:text-main'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className={`w-1/2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === 'register' ? 'bg-app shadow-sm text-brand' : 'text-sub hover:text-main'
              }`}
            >
              Đăng ký
            </button>
          </div>

          <div key={activeTab} className="animate-slide-fade-x">
            {children}
          </div>
        </div>
      </div>

      {/* ================= PHẢI: VISUAL ARTWORK ================= */}
      <div className="hidden lg:flex w-[55%] h-full bg-surface relative flex-col justify-center items-center border-l border-line overflow-hidden">
        
        <div 
          className="absolute inset-0 flex justify-center pt-8"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 75%, transparent 100%)'
          }}
        >
          <div className="w-full max-w-[460px] relative h-full">
            <div className="absolute inset-x-0 top-0 animate-scroll-vertical">
              <div className="flex flex-col gap-8 pb-8">
                <ArtworkCard title="Welcome to HanVault" imageSrc="/images/zen01.jpg" />
                <ArtworkCard title="Master Vocabulary" imageSrc="/images/zen02.jpg" />
                <ArtworkCard title="Track Your Progress" imageSrc="/images/zen03.jpg" />
              </div>
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
          <h2 className="text-[32px] xl:text-[40px] font-bold text-brand leading-tight mb-5 max-w-xl tracking-tight">
            "{quoteMain}"
            {quoteSub && <span className="block mt-1 text-2xl font-medium opacity-90">{quoteSub}</span>}
          </h2>
          <div className="flex items-center gap-4">
            <span className="w-10 h-[2px] bg-sub"></span>
            <span className="text-main font-bold text-base tracking-wide">Lão Tử</span>
          </div>
        </div>
      </div>
    </div>
  );
}
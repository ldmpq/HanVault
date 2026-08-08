import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft } from 'lucide-react';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in font-sans text-main transition-colors">

      <div className="w-20 h-20 bg-brand/10 text-brand rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-brand/20">
        <Rocket className="w-10 h-10" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
        Tính năng đang phát triển
      </h1>
      
      <p className="text-sub max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
        Chúng tôi đang nỗ lực hoàn thiện tính năng này để mang lại trải nghiệm tốt nhất cho bạn. Hãy quay lại sau nhé!
      </p>

      <button
        onClick={() => navigate('/dashboard')}
        className="bg-brand hover:bg-brand-hover text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-brand/10"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Trang chủ
      </button>

    </div>
  );
}
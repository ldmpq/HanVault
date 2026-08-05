import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft } from 'lucide-react';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in font-sans">

      <div className="w-20 h-20 bg-red-50 text-[#A82B2B] rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
        <Rocket className="w-10 h-10" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
        Tính năng đang phát triển
      </h1>
      
      <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
        Chúng tôi đang nỗ lực hoàn thiện tính năng này để mang lại trải nghiệm tốt nhất cho bạn. Hãy quay lại sau nhé!
      </p>

      <button
        onClick={() => navigate('/dashboard')}
        className="bg-[#A82B2B] hover:bg-[#8b2323] text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-red-900/10"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Trang chủ
      </button>

    </div>
  );
}
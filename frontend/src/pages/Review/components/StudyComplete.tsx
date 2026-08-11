import { useNavigate } from 'react-router-dom';
import { Award, Flame, GraduationCap, Target, CalendarClock, LayoutDashboard, Library, RotateCcw } from 'lucide-react';

interface StudyCompleteProps {
  totalWords: number;
  correctWords: number;
  dueNext: number;
  elapsedTime: number;
  onRestart: () => void;
}

export default function StudyComplete({ 
  totalWords, 
  correctWords, 
  dueNext, 
  elapsedTime, 
  onRestart 
}: StudyCompleteProps) {
  const navigate = useNavigate();

  const accuracyRate = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0; 

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full min-h-[85vh] bg-app text-main flex flex-col items-center justify-center py-10 px-4 font-sans animate-fade-in relative overflow-hidden transition-colors">
      
      {/* Hiệu ứng ánh sáng nền */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-96 h-96 bg-brand/10 rounded-full blur-[100px] opacity-80"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-3xl w-full">
        
        {/* Cụm Icon Huy hiệu */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute top-10 -left-6 w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center shadow-sm z-20">
            <Flame className="w-4 h-4 text-orange-500 fill-current" />
          </div>
          
          <div className="w-28 h-28 bg-surface rounded-full shadow-lg border border-line flex items-center justify-center relative z-10">
            <Award className="w-12 h-12 text-brand" strokeWidth={2.5} />
          </div>
        </div>

        {/* Tiêu đề */}
        <h1 className="text-4xl md:text-5xl font-bold text-brand mb-4 text-center tracking-tight">
          Study Session Complete!
        </h1>
        <p className="text-sub text-center max-w-md mb-12 text-sm md:text-base leading-relaxed">
          Tuyệt vời! Bạn đã hoàn thành buổi học trong <span className="font-bold text-main">{formatTimer(elapsedTime)}</span> và tiến gần hơn tới mục tiêu HSK của mình.
        </p>

        {/* 3 Thẻ Thống Kê */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mb-12 w-full max-w-2xl justify-center">
          
          <div className="flex-1 bg-surface rounded-[1rem] p-6 flex flex-col items-center justify-center shadow-sm border border-line">
            <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5 text-brand" />
            </div>
            <span className="text-3xl font-bold text-main mb-1">{totalWords}</span>
            <span className="text-xs font-medium text-sub">Words Reviewed</span>
          </div>

          <div className="flex-1 bg-surface rounded-[1rem] p-6 flex flex-col items-center justify-center shadow-lg border-[1.5px] border-brand relative overflow-hidden scale-105 z-10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full opacity-50 -z-0"></div>
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mb-4 relative z-10">
              <Target className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-3xl font-bold text-brand mb-1 relative z-10">{accuracyRate}%</span>
            <span className="text-xs font-medium text-sub relative z-10">Accuracy Rate</span>
          </div>

          <div className="flex-1 bg-surface rounded-[1rem] p-6 flex flex-col items-center justify-center shadow-sm border border-line">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
              <CalendarClock className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-3xl font-bold text-main mb-1">+{dueNext}</span>
            <span className="text-xs font-medium text-sub">Due Next 24h</span>
          </div>
        </div>

        {/* Các nút điều hướng */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-3xl justify-center mt-2">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex-1 flex items-center justify-center gap-2 bg-surface border border-line text-main px-6 py-4 rounded-xl font-bold hover:bg-line/50 transition-colors shadow-sm"
          >
            <LayoutDashboard className="w-5 h-5" /> Trở lại Trang Chủ
          </button>
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 bg-surface border border-brand text-brand px-6 py-4 rounded-xl font-bold hover:bg-brand/10 transition-colors shadow-sm"
          >
            <RotateCcw className="w-5 h-5" /> Restart Deck
          </button>
          <button 
            onClick={() => navigate('/library')} 
            className="flex-1 flex items-center justify-center gap-2 bg-brand text-white px-6 py-4 rounded-xl font-bold hover:bg-brand-hover transition-colors shadow-sm"
          >
            <Library className="w-5 h-5" /> Tiếp tục ôn tập
          </button>
        </div>

      </div>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import { Play, Flame, RotateCw, Clock, PlusSquare, List, Loader2, GraduationCap } from 'lucide-react';
import { useGreeting } from '../../shared/hooks/useGreeting';
import { useDashboard } from './hooks/useDashboard';
import ActivityHeatmap from '../../shared/components/ActivityHeatmap';

export default function Dashboard() {
  const navigate = useNavigate();
  const greeting = useGreeting();
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
        <p className="text-sub font-medium">Đang tải dữ liệu từ Vault...</p>
      </div>
    );
  }

  if (error || !data) {
    return <div className="bg-brand/10 text-brand p-4 rounded-xl text-center font-medium border border-brand/20">{error || 'Không có dữ liệu.'}</div>;
  }

  const circleCircumference = 226; 
  const progressRatio = Math.min(data.dailyGoal.current / data.dailyGoal.target, 1);
  const strokeDashoffset = circleCircumference - (circleCircumference * progressRatio);

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in pb-12">
      
      {/* ================= HERO SECTION ================= */}
      <div className="bg-gradient-to-br from-app to-brand/5 rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line mb-8 gap-8">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-main mb-4 tracking-tight">
            {greeting}, <span className="text-brand">{data.userName || 'Học Giả'}</span>
          </h1>
          <p className="text-sub mb-8 leading-relaxed text-sm md:text-base">
            You're making steady progress toward HSK. Today is a great day to master those challenging characters. Let's keep the momentum going.
          </p>
          <button 
            onClick={() => navigate('/review')}
            className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform hover:-translate-y-1 shadow-md shadow-brand/10"
          >
            <Play className="w-4 h-4 fill-current" /> Continue Learning
          </button>
        </div>

        <div className="flex gap-4 md:gap-6 w-full md:w-auto justify-center">
          <div className="bg-surface rounded-[1.5rem] p-6 shadow-sm border border-line flex flex-col items-center justify-center min-w-[150px]">
            <h3 className="text-[11px] font-bold text-sub mb-4 tracking-wide">Daily Goal</h3>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" strokeWidth="6" fill="transparent" className="stroke-line" />
                <circle cx="40" cy="40" r="36" strokeWidth="6" fill="transparent" strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} className="stroke-brand transition-all duration-1000" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-main leading-none">{data.dailyGoal.current}</span>
                <span className="text-[9px] text-sub font-bold mt-0.5">/{data.dailyGoal.target}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-[1.5rem] p-6 shadow-sm border border-line flex flex-col items-center justify-center min-w-[150px] relative overflow-hidden">
            <Flame className="absolute -right-4 -bottom-4 w-24 h-24 text-brand/10 opacity-100" />
            <h3 className="text-[11px] font-bold text-sub mb-4 tracking-wide relative z-10">Current Streak</h3>
            <div className="flex items-center gap-2 relative z-10 mb-1">
              <Flame className="w-8 h-8 text-brand fill-brand" />
              <span className="text-4xl font-bold text-main">{data.streak}</span>
            </div>
            <span className="text-[10px] text-sub font-bold relative z-10">Days in a row</span>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-4 bg-surface rounded-[2rem] p-8 shadow-sm border border-line flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-main">Ôn tập</h2>
            <button className="text-brand hover:rotate-180 transition-transform duration-500"><RotateCw className="w-4 h-4" /></button>
          </div>
          
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex justify-between items-center bg-app p-4 rounded-2xl border border-line">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center shadow-sm text-brand"><GraduationCap className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-main">Ready</span>
              </div>
              <span className="text-xl font-bold text-brand">{data.flashcard?.ready || 0}</span>
            </div>
            
            <div className="flex justify-between items-center bg-app p-4 rounded-2xl border border-line">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center shadow-sm text-red-500"><Clock className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-main">Overdue</span>
              </div>
              <span className="text-xl font-bold text-red-500">{data.flashcard?.overdue || 0}</span>
            </div>

            <div className="flex justify-between items-center bg-app p-4 rounded-2xl border border-line">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center shadow-sm text-orange-500"><PlusSquare className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-main">New</span>
              </div>
              <span className="text-xl font-bold text-orange-500">{data.flashcard?.new || 0}</span>
            </div>
          </div>

          <button onClick={() => navigate('/review')} className="w-full bg-line/50 hover:bg-line text-main font-bold py-3.5 rounded-xl transition-colors text-sm">
            Bắt đầu phiên ôn tập
          </button>
        </div>

        <div className="lg:col-span-8 bg-surface rounded-[2rem] p-8 shadow-sm border border-line flex flex-col justify-between">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-main">Đang học</h2>
            <button onClick={() => navigate('/courses')} className="text-[10px] font-bold text-brand uppercase tracking-wider hover:underline">Xem tất cả</button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center h-full">
            <div className="w-full md:w-1/3 h-full min-h-[220px] bg-line rounded-2xl overflow-hidden relative shadow-sm">
              <img src="https://images.unsplash.com/photo-1541959833400-049d37f98ccd?w=400&q=80" alt="HSK Book" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
              <div className="absolute bottom-3 left-3 bg-brand text-white text-[10px] font-bold px-2.5 py-1 rounded">Mới cập nhật</div>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center py-2">
              <h3 className="text-2xl font-bold text-main mb-2">Chưa bắt đầu bài học</h3>
              <p className="text-sub mb-8 text-sm">Vào thư viện để tìm kiếm các bộ thẻ hoặc bài học phù hợp với lộ trình của bạn.</p>
              
              <div className="mb-8 w-full">
                <div className="flex justify-between text-[11px] font-bold text-main mb-2">
                  <span>Tiến độ hiện tại</span><span>{data.mastered?.percentage || 0}%</span>
                </div>
                <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-brand rounded-full transition-all duration-1000" style={{ width: `${data.mastered?.percentage || 0}%` }}></div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => navigate('/courses')} className="flex-1 bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm">
                  Khám phá ngay
                </button>
                <button className="w-12 h-11 bg-surface border border-line hover:bg-line/50 text-main flex items-center justify-center rounded-xl transition-colors"><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActivityHeatmap weeklyProgress={data.weeklyProgress} />

    </div>
  );
}
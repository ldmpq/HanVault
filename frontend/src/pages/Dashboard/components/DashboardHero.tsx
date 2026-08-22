import { Play, Flame } from 'lucide-react';

interface DashboardHeroProps {
  greeting: string;
  userName?: string;
  dailyGoal: { current: number; target: number };
  streak: number;
  weeklyActivity?: boolean[];
  onContinue: () => void;
}

export default function DashboardHero({ 
  greeting, 
  userName, 
  dailyGoal, 
  streak, 
  weeklyActivity = [false, false, false, false, false, false, false], 
  onContinue 
}: DashboardHeroProps) {
  const circleCircumference = 226; 
  // Fallback mục tiêu > 0 để tránh lỗi chia cho 0 (NaN) khi chưa có data
  const progressRatio = Math.min(dailyGoal.current / (dailyGoal.target || 1), 1);
  const strokeDashoffset = circleCircumference - (circleCircumference * progressRatio);

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const currentDayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="bg-gradient-to-br from-app to-brand/5 rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line mb-8 gap-8">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold text-main mb-4 tracking-tight">
          {greeting}{userName && <>, <span className="text-brand">{userName}</span></>}
        </h1>
        <p className="text-sub mb-8 leading-relaxed text-sm md:text-base">
          Bạn đang tiến bộ đều đặn trên hành trình chinh phục HSK. Hôm nay là một ngày tuyệt vời để làm chủ những chữ Hán khó. Hãy tiếp tục duy trì đà học tập!
        </p>
        <button 
          onClick={onContinue}
          className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform hover:-translate-y-1 shadow-md shadow-brand/10"
        >
          <Play className="w-4 h-4 fill-current" /> Tiếp tục học
        </button>
      </div>

      <div className="flex gap-4 md:gap-6 w-full md:w-auto justify-center">
        {/* Daily Goal Card */}
        <div className="bg-surface rounded-[1.5rem] p-6 shadow-sm border border-line flex flex-col items-center justify-center min-w-[150px]">
          <h3 className="text-[11px] font-bold text-sub mb-4 tracking-wide uppercase">Daily Goal</h3>
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" strokeWidth="6" fill="transparent" className="stroke-line" />
              <circle cx="40" cy="40" r="36" strokeWidth="6" fill="transparent" strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} className="stroke-brand transition-all duration-1000" strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-main leading-none">{dailyGoal.current}</span>
              <span className="text-[9px] text-sub font-bold mt-0.5">/{dailyGoal.target}</span>
            </div>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="bg-surface rounded-[1.5rem] p-6 shadow-sm border border-line flex flex-col items-center justify-center min-w-[180px] relative overflow-hidden">
          <Flame className="absolute -right-4 -bottom-4 w-24 h-24 text-brand/10 opacity-100 pointer-events-none" />
          
          <h3 className="text-[11px] font-bold text-sub mb-3 tracking-wide uppercase relative z-10">Current Streak</h3>
          
          <div className="flex items-center gap-2 relative z-10 mb-1">
            <Flame className="w-8 h-8 text-brand fill-brand" />
            <span className="text-4xl font-bold text-main">{streak}</span>
          </div>
          
          <span className="text-[10px] text-sub font-bold relative z-10 mb-5">Days in a row</span>

          {/* Dải hiển thị hoạt động trong tuần */}
          <div className="flex items-center gap-2 relative z-10 px-1">
            {weekDays.map((day, idx) => {
              const isActive = weeklyActivity[idx] || false;
              const isToday = idx === currentDayIndex;

              return (
                <div
                  key={idx}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                    isActive 
                      ? 'bg-brand/20 text-brand' 
                      : 'bg-line/50 text-sub/50' 
                  } ${
                    isToday 
                      ? 'ring-2 ring-brand ring-offset-2 ring-offset-surface' 
                      : ''
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
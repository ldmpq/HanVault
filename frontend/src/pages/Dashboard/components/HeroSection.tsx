import { Play, Flame } from 'lucide-react';

interface HeroSectionProps {
  greeting: string;
  userName?: string;
  dailyGoal: { current: number; target: number };
  streak: number;
  onContinue: () => void;
}

export default function HeroSection({ greeting, userName, dailyGoal, streak, onContinue }: HeroSectionProps) {
  const circleCircumference = 226; 
  const progressRatio = Math.min(dailyGoal.current / dailyGoal.target, 1);
  const strokeDashoffset = circleCircumference - (circleCircumference * progressRatio);

  return (
    <div className="bg-gradient-to-br from-app to-brand/5 rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line mb-8 gap-8">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold text-main mb-4 tracking-tight">
          {greeting}, <span className="text-brand">{userName || 'Học Giả'}</span>
        </h1>
        <p className="text-sub mb-8 leading-relaxed text-sm md:text-base">
          You're making steady progress toward HSK. Today is a great day to master those challenging characters. Let's keep the momentum going.
        </p>
        <button 
          onClick={onContinue}
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
              <span className="text-2xl font-bold text-main leading-none">{dailyGoal.current}</span>
              <span className="text-[9px] text-sub font-bold mt-0.5">/{dailyGoal.target}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-[1.5rem] p-6 shadow-sm border border-line flex flex-col items-center justify-center min-w-[150px] relative overflow-hidden">
          <Flame className="absolute -right-4 -bottom-4 w-24 h-24 text-brand/10 opacity-100" />
          <h3 className="text-[11px] font-bold text-sub mb-4 tracking-wide relative z-10">Current Streak</h3>
          <div className="flex items-center gap-2 relative z-10 mb-1">
            <Flame className="w-8 h-8 text-brand fill-brand" />
            <span className="text-4xl font-bold text-main">{streak}</span>
          </div>
          <span className="text-[10px] text-sub font-bold relative z-10">Days in a row</span>
        </div>
      </div>
    </div>
  );
}
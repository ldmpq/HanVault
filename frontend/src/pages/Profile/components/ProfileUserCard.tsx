import { GraduationCap, Flame } from 'lucide-react';

interface ProfileUserCardProps {
  user: any;
  userName: string;
  currentHsk: string;
  targetHsk: string;
  mastery: number;
  streak: number;
}

export default function ProfileUserCard({
  user, userName, currentHsk, targetHsk, mastery, streak
}: ProfileUserCardProps) {
  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-line flex flex-col items-center">
      <div className="relative mb-4">
        <img 
          src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"} 
          alt="Avatar" 
          className="w-24 h-24 rounded-full object-cover border-4 border-brand/20 shadow-sm"
        />
      </div>
      <h2 className="text-2xl font-bold text-main mb-1">{userName}</h2>
      <p className="text-sub text-sm mb-8 font-medium">Dedicated Learner</p>

      <div className="flex w-full gap-4 mb-8">
        <div className="flex-1 bg-app rounded-2xl p-4 flex flex-col items-center justify-center border border-line">
          <span className="text-[10px] font-bold text-sub uppercase tracking-widest mb-1">Current</span>
          <span className="text-lg font-bold text-brand">{currentHsk}</span>
        </div>
        <div className="flex-1 bg-app rounded-2xl p-4 flex flex-col items-center justify-center border border-line">
          <span className="text-[10px] font-bold text-sub uppercase tracking-widest mb-1">Target</span>
          <span className="text-lg font-bold text-main">{targetHsk}</span>
        </div>
      </div>

      <div className="flex w-full gap-8 border-t border-line pt-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-sub" />
            <span className="text-xs font-bold text-sub">Mastery</span>
          </div>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-3xl font-bold text-main leading-none">{mastery}</span>
            <span className="text-sm font-bold text-sub mb-0.5">%</span>
          </div>
          <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full" style={{ width: `${mastery}%` }}></div>
          </div>
        </div>
        
        <div className="flex-1 border-l border-line pl-8">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-sub">Streak</span>
          </div>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-3xl font-bold text-main leading-none">{streak}</span>
            <span className="text-sm font-bold text-sub mb-0.5">d</span>
          </div>
          <span className="text-[10px] text-sub font-bold tracking-wide">Keep it up!</span>
        </div>
      </div>
    </div>
  );
}
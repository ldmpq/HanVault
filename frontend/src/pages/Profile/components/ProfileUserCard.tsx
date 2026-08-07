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
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center">
      <div className="relative mb-4">
        <img 
          src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"} 
          alt="Avatar" 
          className="w-24 h-24 rounded-full object-cover border-4 border-red-50 shadow-sm"
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{userName}</h2>
      <p className="text-gray-500 text-sm mb-8 font-medium">Dedicated Learner</p>

      <div className="flex w-full gap-4 mb-8">
        <div className="flex-1 bg-[#FCFAF8] rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-50">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current</span>
          <span className="text-lg font-bold text-[#A82B2B]">{currentHsk}</span>
        </div>
        <div className="flex-1 bg-[#FCFAF8] rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-50">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Target</span>
          <span className="text-lg font-bold text-gray-900">{targetHsk}</span>
        </div>
      </div>

      <div className="flex w-full gap-8 border-t border-gray-100 pt-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500">Mastery</span>
          </div>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-3xl font-bold text-gray-900 leading-none">{mastery}</span>
            <span className="text-sm font-bold text-gray-500 mb-0.5">%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#A82B2B] rounded-full" style={{ width: `${mastery}%` }}></div>
          </div>
        </div>
        
        <div className="flex-1 border-l border-gray-100 pl-8">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-gray-500">Streak</span>
          </div>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-3xl font-bold text-gray-900 leading-none">{streak}</span>
            <span className="text-sm font-bold text-gray-500 mb-0.5">d</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold tracking-wide">Keep it up!</span>
        </div>
      </div>
    </div>
  );
}
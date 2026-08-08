import { Trophy, Lock, Flame } from 'lucide-react';

interface ProfileAchievementsProps {
  achievements: any[];
}

export default function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-line flex flex-col">
      <h3 className="text-xl font-bold text-main mb-6">Latest Achievements</h3>
      
      {achievements.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((ach, idx) => (
              <div key={idx} className={`border border-line rounded-2xl p-5 flex flex-col items-center text-center transition-all ${ach.isLocked ? 'bg-surface opacity-60' : 'bg-app shadow-sm'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm ${ach.isLocked ? 'bg-line text-sub' : (idx % 2 === 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-orange-500/10 text-orange-500')}`}>
                  {ach.isLocked ? <Lock className="w-5 h-5" /> : (idx % 2 === 0 ? <Trophy className="w-5 h-5" /> : <Flame className="w-5 h-5" />)}
                </div>
                <span className={`text-xs font-bold ${ach.isLocked ? 'text-sub' : 'text-main'}`}>{ach.title}</span>
              </div>
            ))}
          </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-6">
          <Trophy className="w-10 h-10 text-line mb-3" />
          <p className="text-sm text-sub font-medium">Bạn chưa đạt được thành tựu nào.</p>
        </div>
      )}
    </div>
  );
}
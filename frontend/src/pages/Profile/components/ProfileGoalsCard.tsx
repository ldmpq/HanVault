import { Bell } from 'lucide-react';

interface ProfileGoalsCardProps {
  dailyGoalMins: number;
}

export default function ProfileGoalsCard({ dailyGoalMins }: ProfileGoalsCardProps) {
  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-line">
      <h3 className="text-lg font-bold text-main mb-6">Learning Goals</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-sub">Daily Goal</span>
          <span className="text-sm font-bold text-brand">{dailyGoalMins} mins</span>
        </div>
        <div className="relative w-full h-2 bg-line rounded-full">
          <div className="absolute top-0 left-0 h-full bg-brand rounded-full w-1/3 transition-all"></div>
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-brand rounded-full border-2 border-surface shadow-sm"></div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-line">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-sub" />
          <span className="text-sm font-medium text-sub">Daily Reminder</span>
        </div>
        <span className="text-sm font-bold text-main">8:00 PM</span>
      </div>
    </div>
  );
}
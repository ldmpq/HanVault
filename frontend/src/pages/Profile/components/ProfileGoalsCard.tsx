import { Bell } from 'lucide-react';

interface ProfileGoalsCardProps {
  dailyGoalMins: number;
}

export default function ProfileGoalsCard({ dailyGoalMins }: ProfileGoalsCardProps) {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Goals</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">Daily Goal</span>
          <span className="text-sm font-bold text-[#A82B2B]">{dailyGoalMins} mins</span>
        </div>
        <div className="relative w-full h-2 bg-gray-100 rounded-full">
          <div className="absolute top-0 left-0 h-full bg-[#A82B2B] rounded-full w-1/3 transition-all"></div>
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-[#A82B2B] rounded-full border-2 border-white shadow-sm"></div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Daily Reminder</span>
        </div>
        <span className="text-sm font-bold text-gray-900">8:00 PM</span>
      </div>
    </div>
  );
}
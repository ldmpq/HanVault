import { Target, MessageCircle, Briefcase, Plane, PlayCircle, Sprout } from 'lucide-react';

interface StepGoalProps {
  learningGoals: string[];
  toggleGoal: (id: string) => void;
}

const GOALS = [
  { id: 'communication', label: 'Giao tiếp hằng ngày', icon: <MessageCircle className="w-4 h-4" /> },
  { id: 'hsk', label: 'Ôn luyện HSK', icon: <Target className="w-4 h-4" /> },
  { id: 'career', label: 'Công việc', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'travel', label: 'Du lịch', icon: <Plane className="w-4 h-4" /> },
  { id: 'culture', label: 'Văn hóa & Giải trí', icon: <PlayCircle className="w-4 h-4" /> },
  { id: 'self_growth', label: 'Phát triển bản thân', icon: <Sprout className="w-4 h-4" /> },
];

export default function StepGoal({ learningGoals, toggleGoal }: StepGoalProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Mục tiêu học tiếng Trung của bạn là gì?</h2>
        <p className="text-sm text-neutral-500">Chọn mục tiêu phù hợp để chúng tôi xây dựng lộ trình học phù hợp với bạn..</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOALS.map(goal => {
          const isActive = learningGoals.includes(goal.id);
          return (
            <div 
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                isActive ? 'border-[#A32A29] bg-[#A32A29]/5' : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={isActive ? 'text-[#A32A29]' : 'text-neutral-500'}>{goal.icon}</div>
                <span className="text-[13px] font-bold text-neutral-700">{goal.label}</span>
              </div>
              <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center ${
                isActive ? 'bg-[#A32A29] border-[#A32A29]' : 'border-neutral-300'
              }`}>
                {isActive && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
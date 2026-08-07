import type { ProgressData } from '../types';

interface ProgressHeroProps {
  data?: ProgressData['learning'];
}

export default function ProgressHero({ data }: ProgressHeroProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = data?.overallProgress || 0;
  const offset = circumference - (circumference * (progress / 100));

  return (
    <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3] flex flex-col md:flex-row items-center justify-between gap-10 h-full">
      <div className="flex-1">
        <div className="flex items-center gap-8 mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Current</span>
            <span className="text-3xl font-bold text-[#A82B2B]">{data?.currentLevel || '--'}</span>
          </div>
          <div className="w-px h-10 bg-gray-100"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Target</span>
            <span className="text-3xl font-bold text-gray-900">{data?.targetLevel || '--'}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Estimated Completion</h3>
          <p className="text-xs text-gray-500">Based on your current pace, you will reach your target in <span className="font-bold text-gray-900">{data?.estimatedDays || 0} days</span>.</p>
        </div>
      </div>
      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="72" cy="72" r={radius} stroke="#F3F4F6" strokeWidth="8" fill="transparent" />
          <circle 
            cx="72" cy="72" r={radius} 
            stroke="#A82B2B" strokeWidth="8" fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            className="transition-all duration-1000 ease-out" 
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-900 leading-none">{progress}%</span>
          <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Done</span>
        </div>
      </div>
    </div>
  );
}
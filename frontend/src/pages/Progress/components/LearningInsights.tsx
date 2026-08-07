import { Sparkles } from 'lucide-react';

interface LearningInsightsProps {
  insights?: Array<string>;
}

export default function LearningInsights({ insights = [] }: LearningInsightsProps) {
  return (
    <div className="bg-gradient-to-br from-white to-red-50/30 rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-red-100/50 relative overflow-hidden flex flex-col justify-center h-full">
      <div className="absolute -top-4 -right-4 p-4 opacity-10">
        <Sparkles className="w-24 h-24 text-[#A82B2B]" />
      </div>
      <div className="flex items-center gap-2 mb-5 relative z-10">
        <Sparkles className="w-4 h-4 text-[#A82B2B]" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">AI Insights</h3>
      </div>
      <ul className="space-y-4 relative z-10">
        {insights.map((insight, idx) => (
          <li key={idx} className="text-xs text-gray-700 font-medium leading-relaxed flex items-start gap-2">
            <span className="text-[#A82B2B] mt-0.5">•</span>{insight}
          </li>
        ))}
        {insights.length === 0 && (
          <li className="text-xs text-gray-500 italic">Chưa có đánh giá nào cho bạn trong hôm nay.</li>
        )}
      </ul>
    </div>
  );
}
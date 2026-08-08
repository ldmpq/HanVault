import { Sparkles } from 'lucide-react';

interface LearningInsightsProps {
  insights?: Array<string>;
}

export default function LearningInsights({ insights = [] }: LearningInsightsProps) {
  return (
    <div className="bg-gradient-to-br from-surface to-brand/5 rounded-[24px] p-6 shadow-sm border border-brand/20 relative overflow-hidden flex flex-col justify-center h-full">
      <div className="absolute -top-4 -right-4 p-4 opacity-10">
        <Sparkles className="w-24 h-24 text-brand" />
      </div>
      <div className="flex items-center gap-2 mb-5 relative z-10">
        <Sparkles className="w-4 h-4 text-brand" />
        <h3 className="text-sm font-bold text-main uppercase tracking-widest">AI Insights</h3>
      </div>
      <ul className="space-y-4 relative z-10">
        {insights.map((insight, idx) => (
          <li key={idx} className="text-xs text-sub font-medium leading-relaxed flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>{insight}
          </li>
        ))}
        {insights.length === 0 && (
          <li className="text-xs text-sub italic">Chưa có đánh giá nào cho bạn trong hôm nay.</li>
        )}
      </ul>
    </div>
  );
}
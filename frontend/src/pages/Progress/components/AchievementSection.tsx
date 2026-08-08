interface AchievementSectionProps {
  achievements?: Array<{ icon: string; title: string; locked: boolean }>;
}

export default function AchievementSection({ achievements = [] }: AchievementSectionProps) {
  return (
    <div className="bg-surface rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line h-fit">
      <h3 className="text-lg font-bold text-main mb-6">Achievements</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((ach, idx) => (
          <div key={idx} className={`p-4 rounded-[20px] flex flex-col items-center justify-center text-center transition-all border ${ach.locked ? 'bg-app border-line opacity-50' : 'bg-surface border-line shadow-sm hover:border-brand/30 hover:shadow-md'}`}>
            <div className={`text-3xl mb-3 ${ach.locked ? 'grayscale' : ''}`}>{ach.icon}</div>
            <span className="text-[10px] font-bold text-sub leading-tight">{ach.title}</span>
          </div>
        ))}
        {achievements.length === 0 && (
           <div className="col-span-full text-sm text-sub text-center py-4">Chưa có thành tựu nào.</div>
        )}
      </div>
    </div>
  );
}
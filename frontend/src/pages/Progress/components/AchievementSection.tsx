interface AchievementSectionProps {
  achievements?: Array<{ icon: string; title: string; locked: boolean }>;
}

export default function AchievementSection({ achievements = [] }: AchievementSectionProps) {
  return (
    <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3] h-fit">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Achievements</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((ach, idx) => (
          <div key={idx} className={`p-4 rounded-[20px] flex flex-col items-center justify-center text-center transition-all border ${ach.locked ? 'bg-[#FCFAF8] border-[#ECE7E3] opacity-50' : 'bg-white border-[#ECE7E3] shadow-sm hover:border-red-100 hover:shadow-md'}`}>
            <div className={`text-3xl mb-3 ${ach.locked ? 'grayscale' : ''}`}>{ach.icon}</div>
            <span className="text-[10px] font-bold text-gray-700 leading-tight">{ach.title}</span>
          </div>
        ))}
        {achievements.length === 0 && (
           <div className="col-span-full text-sm text-gray-400 text-center py-4">Chưa có thành tựu nào.</div>
        )}
      </div>
    </div>
  );
}
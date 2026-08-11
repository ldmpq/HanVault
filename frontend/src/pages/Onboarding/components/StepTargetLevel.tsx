interface StepTargetLevelProps {
  targetHskLevel: number | null;
  setTargetHskLevel: (level: number) => void;
}

const TARGET_LEVELS = [
    { id: 1, label: 'HSK 1' },
    { id: 2, label: 'HSK 2' },
    { id: 3, label: 'HSK 3' },
    { id: 4, label: 'HSK 4' },
    { id: 5, label: 'HSK 5' },
    { id: 6, label: 'HSK 6' },
    { id: 7, label: 'HSK 7' },
    { id: 8, label: 'HSK 8' },
    { id: 9, label: 'HSK 9' },
];

export default function StepTargetLevel({ targetHskLevel, setTargetHskLevel }: StepTargetLevelProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Mục tiêu HSK của bạn là gì?</h2>
        <p className="text-sm text-neutral-500">Chọn cấp độ bạn muốn đạt được để chúng tôi xây dựng lộ trình học phù hợp.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TARGET_LEVELS.map(level => (
          <button
            key={level.id}
            onClick={() => setTargetHskLevel(level.id)}
            className={`py-3 rounded-xl text-xs font-bold transition-all ${
              targetHskLevel === level.id 
                ? 'bg-[#A32A29] text-white shadow-md shadow-red-900/20' 
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-[#A32A29]/30 hover:bg-red-50/50'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
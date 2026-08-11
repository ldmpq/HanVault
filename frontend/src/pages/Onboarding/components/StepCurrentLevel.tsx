interface StepLevelProps {
  currentLevel: number | null;
  setCurrentLevel: (level: number) => void;
}

const LEVELS = [
  { id: 0, label: 'Nhập môn' },
  { id: 1, label: 'HSK 1' },
  { id: 2, label: 'HSK 2' },
  { id: 3, label: 'HSK 3' },
  { id: 4, label: 'HSK 4' },
  { id: 5, label: 'HSK 5' },
  { id: 6, label: 'HSK 6' },
  { id: 7, label: 'HSK 7' },
  { id: 8, label: 'HSK 8' },
  { id: 9, label: 'HSK 9' },
  { id: -1, label: 'Chưa chắc chắn' },
];

export default function StepCurrentLevel({
  currentLevel,
  setCurrentLevel,
}: StepLevelProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">
          Hãy bắt đầu hành trình của bạn.
        </h2>

        <p className="text-sm text-neutral-500">
          Cho chúng tôi biết trình độ tiếng Trung hiện tại để HanVault
          cá nhân hóa trải nghiệm học tập của bạn.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => setCurrentLevel(level.id)}
            className={`py-3 rounded-xl text-xs font-bold transition-all ${
              currentLevel === level.id
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
interface StepCommitmentProps {
  dailyCommitment: number | null;
  setDailyCommitment: (val: number) => void;
}

const TIMES = [
  { value: 10, label: '10m' }, { value: 15, label: '15m' },
  { value: 20, label: '20m' }, { value: 30, label: '30m' }, { value: 45, label: '45m+' },
];

export default function StepCommitment({ dailyCommitment, setDailyCommitment }: StepCommitmentProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Đặt mục tiêu học tập mỗi ngày</h2>
        <p className="text-sm text-neutral-500">Sự nhất quán là chìa khóa. Bạn có thể dành bao nhiêu thời gian để học mỗi ngày?</p>
      </div>
      <div className="bg-[#F8F7F5] p-2 rounded-2xl flex items-center justify-between gap-1">
        {TIMES.map(time => (
          <button
            key={time.value}
            onClick={() => setDailyCommitment(time.value)}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
              dailyCommitment === time.value 
                ? 'bg-white text-[#A32A29] shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
            }`}
          >
            {time.label}
          </button>
        ))}
      </div>
    </div>
  );
}
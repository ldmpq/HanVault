import { Pause, Clock } from 'lucide-react';

interface ReviewHeaderProps {
  currentCardNumber: number;
  totalCards: number;
  elapsedTime: number;
  setIsPaused: (val: boolean) => void;
}

export default function ReviewHeader({ currentCardNumber, totalCards, elapsedTime, setIsPaused }: ReviewHeaderProps) {
  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-3 px-1">
        <div>
          <h2 className="text-2xl font-bold text-main mb-1">Vocabulary Review</h2>
          <p className="text-xs font-medium text-sub flex items-center gap-2">
            <span>{currentCardNumber} / {totalCards} Cards</span>
            <span className="text-line">•</span>
            <span className="flex items-center gap-1 text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-md font-bold">
              <Clock className="w-3.5 h-3.5" />
              {formatTimer(elapsedTime)}
            </span>
          </p>
        </div>
        <button onClick={() => setIsPaused(true)} className="text-sub hover:text-brand transition-colors">
          <Pause className="w-5 h-5" />
        </button>
      </div>
      <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500 to-brand transition-all duration-300" style={{ width: `${(currentCardNumber / totalCards) * 100}%` }}></div>
      </div>
    </div>
  );
}
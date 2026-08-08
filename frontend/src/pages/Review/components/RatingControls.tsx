interface RatingControlsProps {
  isFlipped: boolean;
  onRateCard: (rating: number) => void;
  card: any;
}

export default function RatingControls({ isFlipped, onRateCard, card }: RatingControlsProps) {
  const formatTimeInterval = (days?: number) => {
    if (days === undefined || days < 1) return '< 10m';
    if (days < 30) return `${days}d`;
    if (days < 365) return `${Math.round(days / 30)}mo`;
    return `${(days / 365).toFixed(1)}y`;
  };

  return (
    <>
      <div className={`w-full transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="grid grid-cols-4 gap-3 md:gap-5">
          <button onClick={() => onRateCard(1)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20">
            <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Again</span>
            <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.again)}</span>
          </button>
          <button onClick={() => onRateCard(3)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-all border border-orange-500/20">
            <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Hard</span>
            <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.hard)}</span>
          </button>
          <button onClick={() => onRateCard(4)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20 transition-all border border-yellow-500/20">
            <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Good</span>
            <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.good)}</span>
          </button>
          <button onClick={() => onRateCard(5)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
            <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Easy</span>
            <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.easy)}</span>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center hidden md:block">
        <p className="text-[10px] font-bold tracking-widest text-sub uppercase">
          Press <span className="text-main">ENTER</span> to pause • Press <span className="text-main">SPACE</span> to flip • Press <span className="text-main">1-4</span> to rate
        </p>
      </div>
    </>
  );
}
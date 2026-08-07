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
          <button onClick={() => onRateCard(1)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FFF1F0] text-[#E09090] hover:brightness-95 transition-all">
            <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Again</span>
            <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.again)}</span>
          </button>
          <button onClick={() => onRateCard(3)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FCE4CD] text-[#D4A373] hover:brightness-95 transition-all">
            <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Hard</span>
            <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.hard)}</span>
          </button>
          <button onClick={() => onRateCard(4)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#EBE2AB] text-[#B0A775] hover:brightness-95 transition-all">
            <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Good</span>
            <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.good)}</span>
          </button>
          <button onClick={() => onRateCard(5)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FFF0F2] text-[#DB9AA9] hover:brightness-95 transition-all">
            <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Easy</span>
            <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.easy)}</span>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center hidden md:block">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          Press <span className="text-gray-500">ENTER</span> to pause • Press <span className="text-gray-500">SPACE</span> to flip • Press <span className="text-gray-500">1-4</span> to rate
        </p>
      </div>
    </>
  );
}
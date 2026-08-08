import { Volume2, Star } from 'lucide-react';

interface Flashcard3DProps {
  card: any;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  playAudio: (e: React.MouseEvent, text: string) => void;
  displayMeaning: string;
}

export default function Flashcard3D({ card, isFlipped, setIsFlipped, playAudio, displayMeaning }: Flashcard3DProps) {
  return (
    <div className="w-full aspect-[4/3] md:aspect-video cursor-pointer mb-6 select-none" style={{ perspective: '1200px' }} onClick={() => setIsFlipped(prev => !prev)}>
      <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform duration-700" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        
        {/* MẶT TRƯỚC */}
        <div className="absolute inset-0 w-full h-full bg-surface rounded-[1.5rem] md:rounded-[2rem] p-8 flex flex-col items-center border border-line" style={{ backfaceVisibility: 'hidden' }}>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-[100px] md:text-[140px] font-normal text-main leading-none">{card.simplified}</h1>
          </div>
          <span className="text-sub text-base md:text-lg font-medium mb-4">Tap to reveal</span>
        </div>

        {/* MẶT SAU */}
        <div className="absolute inset-0 w-full h-full bg-surface rounded-[1.5rem] md:rounded-[2rem] p-10 flex flex-col border border-line overflow-y-auto custom-scrollbar" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-medium text-main mb-2">{card.simplified}</h1>
              <p className="text-2xl text-brand font-medium">{card.pinyin}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={(e) => {e.stopPropagation(); playAudio(e, card.simplified);}} className="w-10 h-10 bg-app text-sub rounded-full flex items-center justify-center hover:bg-line hover:text-main transition-colors border border-line"><Volume2 className="w-5 h-5" /></button>
              <button onClick={(e) => e.stopPropagation()} className="w-10 h-10 bg-app text-sub rounded-full flex items-center justify-center hover:bg-line hover:text-main transition-colors border border-line"><Star className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sub text-sm font-medium mb-1 uppercase tracking-wider">{card.partOfSpeech || 'Vocabulary'}</p>
            <h2 className="text-2xl font-medium text-main mb-8">{displayMeaning}</h2>

            {card.examples && card.examples?.length > 0 && (
              <div className="bg-app rounded-2xl p-6 border border-line">
                <span className="text-[10px] font-bold tracking-widest text-sub uppercase block mb-3">Example</span>
                <p className="text-lg text-main mb-1">{card.examples[0]?.ch}</p>
                <p className="text-sub text-sm mb-2">{card.examples[0]?.py}</p>
                <p className="text-main text-sm">{card.examples[0]?.en || 'Chưa cập nhật bản dịch'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
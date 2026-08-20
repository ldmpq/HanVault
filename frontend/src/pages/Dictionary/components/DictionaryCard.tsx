import { Heart, Volume2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';

interface DictionaryCardProps {
  word: Vocabulary;
  isFav: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: number) => void;
  onPlayAudio: (e: React.MouseEvent, text: string) => void;
}

export default function DictionaryCard({ word, isFav, onToggleFavorite, onPlayAudio }: DictionaryCardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div 
      onClick={() => navigate(`/word/${word.id}`, { state: { fromDictionary: true, searchString: location.search } })} 
      className="bg-surface rounded-2xl p-4 flex flex-col items-center text-center shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.08)] hover:border-brand/30 transition-all cursor-pointer border border-line h-full group"
    >
      <div className="flex justify-between items-start w-full mb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e, word.id);
          }}
          className="text-line hover:text-brand transition-colors"
        >
          <Heart className="w-5 h-5" fill={isFav ? "var(--brand-primary)" : "none"} color={isFav ? "var(--brand-primary)" : "currentColor"} />
        </button>
        <span className="bg-line/50 text-sub text-[10px] font-bold px-2 py-1 rounded border border-line">HSK {word.hskLevel}</span>
      </div>
      <h2 className={`${word.simplified.length > 2 ? 'text-4xl' : 'text-6xl'} font-medium text-main leading-none mb-3 group-hover:text-brand transition-colors`}>
        {word.simplified}
      </h2>
      <p className="text-sm font-medium text-brand mb-2">{word.pinyin}</p>
      <p className="text-xs text-sub px-1 line-clamp-2 leading-relaxed min-h-[32px]">{word.meaning}</p>
      <div className="mt-auto pt-4 w-full flex justify-center">
        <button 
          onClick={(e) => { e.stopPropagation(); onPlayAudio(e, word.simplified); }} 
          className="w-9 h-9 bg-app hover:bg-line text-sub hover:text-main rounded-full flex items-center justify-center transition-colors border border-line"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
import { Heart, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Vocabulary } from '../shared/types/vocabulary.types';

interface DictionaryCardProps {
  word: Vocabulary;
  isFav: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: number) => void;
  onPlayAudio: (e: React.MouseEvent, text: string) => void;
}

export default function DictionaryCard({ word, isFav, onToggleFavorite, onPlayAudio }: DictionaryCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/word/${word.id}`, { state: { from: 'dictionary' } })} 
      className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.08)] transition-all cursor-pointer border border-gray-100 h-full"
    >
      <div className="flex justify-between items-start w-full mb-3">
        <button onClick={(e) => onToggleFavorite(e, word.id)} className="text-gray-300 hover:text-[#A82B2B] transition-colors">
          <Heart className="w-5 h-5" fill={isFav ? "#A82B2B" : "none"} color={isFav ? "#A82B2B" : "currentColor"} />
        </button>
        <span className="bg-[#F3F4F6] text-gray-600 text-[10px] font-bold px-2 py-1 rounded">HSK {word.hskLevel}</span>
      </div>
      <h2 className={`${word.simplified.length > 2 ? 'text-4xl' : 'text-6xl'} font-medium text-[#1A1A1A] leading-none mb-3`}>
        {word.simplified}
      </h2>
      <p className="text-sm font-medium text-[#A82B2B] mb-2">{word.pinyin}</p>
      <p className="text-xs text-gray-700 px-1 line-clamp-2 leading-relaxed min-h-[32px]">{word.meaning}</p>
      <div className="mt-auto pt-4 w-full flex justify-center">
        <button 
          onClick={(e) => { e.stopPropagation(); onPlayAudio(e, word.simplified); }} 
          className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
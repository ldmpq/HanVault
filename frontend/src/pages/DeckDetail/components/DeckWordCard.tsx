import { useNavigate } from 'react-router-dom';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';

interface DeckWordCardProps {
  word: Vocabulary;
  deckId: string | undefined;
  deckName: string;
}

export default function DeckWordCard({ word, deckId, deckName }: DeckWordCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/word/${word.id}`, {
          state: { deckId: deckId, deckName: deckName },
        })
      }
      className="bg-surface rounded-2xl p-8 flex flex-col items-center justify-center shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-line hover:border-brand/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer aspect-square group"
    >
      <h2 className={`${word.simplified.length > 2 ? 'text-5xl' : 'text-6xl'} font-bold text-main mb-4 group-hover:text-brand transition-colors`}>
        {word.simplified}
      </h2>
      <p className="text-sm font-medium text-sub">{word.pinyin}</p>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import type { Vocabulary } from '../shared/types/vocabulary.types';

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
      className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-[0_2px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer aspect-square"
    >
      <h2 className={`${word.simplified.length > 2 ? 'text-5xl' : 'text-6xl'} font-bold text-gray-900 mb-4`}>
        {word.simplified}
      </h2>
      <p className="text-sm font-medium text-gray-500">{word.pinyin}</p>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';

interface DeckWordCardProps {
  word: Vocabulary;
  deckId: string | undefined;
  deckName: string;
  isSystemDeck?: boolean; // Nhận biết bộ thẻ hệ thống
  onRemove?: (vocabId: number) => void;
}

export default function DeckWordCard({ word, deckId, deckName, isSystemDeck, onRemove }: DeckWordCardProps) {
  const navigate = useNavigate();

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn xóa "${word.simplified}" khỏi bộ thẻ này?`)) {
      onRemove?.(word.id);
    }
  };

  return (
    <div
      onClick={() =>
        navigate(`/word/${word.id}`, {
          state: { deckId: deckId, deckName: deckName },
        })
      }
      className="relative bg-surface rounded-2xl p-8 flex flex-col items-center justify-center shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-line hover:border-brand/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer aspect-square group"
    >
      {/* Chỉ hiện khi hover và không phải bộ thẻ hệ thống */}
      {!isSystemDeck && onRemove && (
        <button
          onClick={handleRemoveClick}
          className="absolute top-3 right-3 p-1.5 text-sub hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          title="Xóa khỏi bộ thẻ"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <h2 className={`${word.simplified.length > 2 ? 'text-5xl' : 'text-6xl'} font-bold text-main mb-4 group-hover:text-brand transition-colors`}>
        {word.simplified}
      </h2>
      <p className="text-sm font-medium text-sub">{word.pinyin}</p>
    </div>
  );
}
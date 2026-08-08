import { PlayCircle } from 'lucide-react';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';
import { highlightTargetWord } from '../../../shared/utils/text.utils';

interface WordExamplesProps {
  word: Vocabulary;
  playAudio: (e: React.MouseEvent, text: string) => void;
}

export default function WordExamples({ word, playAudio }: WordExamplesProps) {
  if (!word.examples || word.examples.length === 0) {
    return <div className="bg-surface rounded-[1.5rem] p-8 text-center text-sub border border-line shadow-sm">Chưa có câu ví dụ nào cho từ vựng này.</div>;
  }

  return (
    <div className="animate-fade-in space-y-4">
      {word.examples.map((ex, idx) => (
        <div key={idx} className="bg-surface rounded-[1.5rem] p-8 shadow-sm border border-line flex items-center justify-between group hover:border-brand/30 hover:shadow-md transition-all cursor-pointer">
          <div className="flex-1 pr-6">
            <p className="text-2xl text-main mb-3 font-medium">
              {highlightTargetWord(ex.ch, word.character || '')}
            </p>
            {ex.py && <p className="text-sub mb-3 text-sm">{ex.py}</p>}
            {ex.en ? <p className="text-main font-medium">{ex.en}</p> : <p className="text-sub italic text-sm mt-1">Chưa cập nhật bản dịch</p>}
          </div>
          <button onClick={(e) => playAudio(e, ex.ch)} className="w-10 h-10 rounded-full flex items-center justify-center text-sub group-hover:text-brand border border-line group-hover:border-brand/50 transition-colors shrink-0">
            <PlayCircle className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
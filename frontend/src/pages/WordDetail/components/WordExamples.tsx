import { PlayCircle } from 'lucide-react';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';
import { highlightTargetWord } from '../../../shared/utils/text.utils';

interface WordExamplesProps {
  word: Vocabulary;
  playAudio: (e: React.MouseEvent, text: string) => void;
}

export default function WordExamples({ word, playAudio }: WordExamplesProps) {
  if (!word.examples || word.examples.length === 0) {
    return <div className="bg-white rounded-[1.5rem] p-8 text-center text-gray-400 border border-gray-100">Chưa có câu ví dụ nào cho từ vựng này.</div>;
  }

  return (
    <div className="animate-fade-in space-y-4">
      {word.examples.map((ex, idx) => (
        <div key={idx} className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex-1 pr-6">
            <p className="text-2xl text-gray-900 mb-3 font-medium">
              {highlightTargetWord(ex.ch, word.character || '')}
            </p>
            {ex.py && <p className="text-gray-500 mb-3 text-sm">{ex.py}</p>}
            {ex.en ? <p className="text-gray-800 font-medium">{ex.en}</p> : <p className="text-gray-400 italic text-sm mt-1">Chưa cập nhật bản dịch</p>}
          </div>
          <button onClick={(e) => playAudio(e, ex.ch)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#A82B2B] border border-gray-200 group-hover:border-[#A82B2B] transition-colors shrink-0">
            <PlayCircle className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
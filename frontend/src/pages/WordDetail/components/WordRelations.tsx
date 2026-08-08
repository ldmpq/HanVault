import { Link2, Split } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';

export default function WordRelations({ word }: { word: Vocabulary }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface rounded-[1.5rem] p-8 shadow-sm border border-line animate-fade-in space-y-8">
      <div>
        <h3 className="text-sm font-bold text-sub uppercase tracking-widest mb-5 flex items-center gap-2"><Link2 className="w-4 h-4 text-blue-500" /> Đồng nghĩa</h3>
        {word.synonyms && word.synonyms.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {word.synonyms.map((syn) => (
              <div key={syn.id} onClick={() => navigate(`/word/${syn.id}`)} className="group cursor-pointer bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-2xl px-5 py-3 transition-all">
                <p className="text-2xl font-medium text-blue-600 mb-1">{syn.character}</p>
                <p className="text-xs text-blue-500/80 font-medium">{syn.pinyin}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-sub italic">Chưa có dữ liệu từ đồng nghĩa.</p>}
      </div>
      <div className="w-full h-px border-t border-dashed border-line/80"></div>
      <div>
        <h3 className="text-sm font-bold text-sub uppercase tracking-widest mb-5 flex items-center gap-2"><Split className="w-4 h-4 text-orange-500" /> Trái nghĩa</h3>
        {word.antonyms && word.antonyms.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {word.antonyms.map((ant) => (
              <div key={ant.id} onClick={() => navigate(`/word/${ant.id}`)} className="group cursor-pointer bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-2xl px-5 py-3 transition-all">
                <p className="text-2xl font-medium text-orange-600 mb-1">{ant.character}</p>
                <p className="text-xs text-orange-500/80 font-medium">{ant.pinyin}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-sub italic">Chưa có dữ liệu từ trái nghĩa.</p>}
      </div>
    </div>
  );
}
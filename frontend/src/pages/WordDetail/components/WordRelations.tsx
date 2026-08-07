import { Link2, Split } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';

export default function WordRelations({ word }: { word: Vocabulary }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 animate-fade-in space-y-8">
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2"><Link2 className="w-4 h-4 text-blue-500" /> Đồng nghĩa</h3>
        {word.synonyms && word.synonyms.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {word.synonyms.map((syn) => (
              <div key={syn.id} onClick={() => navigate(`/word/${syn.id}`)} className="group cursor-pointer bg-blue-50/50 hover:bg-blue-100/50 border border-blue-100 rounded-2xl px-5 py-3 transition-all">
                <p className="text-2xl font-medium text-blue-900 mb-1">{syn.character}</p>
                <p className="text-xs text-blue-600/70 font-medium">{syn.pinyin}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 italic">Chưa có dữ liệu từ đồng nghĩa.</p>}
      </div>
      <div className="w-full h-px bg-gray-100 border-t border-dashed border-gray-200"></div>
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2"><Split className="w-4 h-4 text-orange-500" /> Trái nghĩa</h3>
        {word.antonyms && word.antonyms.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {word.antonyms.map((ant) => (
              <div key={ant.id} onClick={() => navigate(`/word/${ant.id}`)} className="group cursor-pointer bg-orange-50/50 hover:bg-orange-100/50 border border-orange-100 rounded-2xl px-5 py-3 transition-all">
                <p className="text-2xl font-medium text-orange-900 mb-1">{ant.character}</p>
                <p className="text-xs text-orange-600/70 font-medium">{ant.pinyin}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 italic">Chưa có dữ liệu từ trái nghĩa.</p>}
      </div>
    </div>
  );
}
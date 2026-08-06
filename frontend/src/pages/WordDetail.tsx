import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Volume2, Edit3, PlayCircle, Link2, Split, FolderPlus } from 'lucide-react';
import type { Vocabulary } from '../shared/types/vocabulary.types';
import { useTextToSpeech } from '../shared/hooks/useTextToSpeech';
import { highlightTargetWord } from '../shared/utils/text.utils';
import { renderBreadcrumbs } from '../shared/utils/navigation.utils';
import AddToDeckModal from '../components/AddToDeckModal';
import { useWordDetail } from '../shared/hooks/useWordDetail';
import HanziBoard from '../components/HanziBoard';

const getDisplayPos = (word: Vocabulary | null) => {
  if (!word) return 'Từ vựng';
  const rawPos = word.partOfSpeech || (word as any).part_of_speech || (word as any).pos;
  if (!rawPos) return 'Từ vựng';
  const posMap: Record<string, string> = {
    'v': 'Động từ', 'n': 'Danh từ', 'adj': 'Tính từ', 'adv': 'Phó từ',
    'pron': 'Đại từ', 'num': 'Số từ', 'm': 'Lượng từ', 'conj': 'Liên từ',
    'prep': 'Giới từ', 'part': 'Trợ từ', 'int': 'Thán từ', 'idiom': 'Thành ngữ'
  };
  return posMap[rawPos.toLowerCase()] || rawPos;
};

export default function WordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  const deckId = location.state?.deckId || '';
  const deckName = location.state?.deckName || 'Chi tiết bộ thẻ';

  const { word, isLoading, activeStrokeChar, setActiveStrokeChar } = useWordDetail(id);
  const { playAudio } = useTextToSpeech();

  const [activeTab, setActiveTab] = useState<'examples' | 'relations'>('examples');
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);

  if (isLoading) return <div className="text-center py-20 text-gray-500 font-medium">Đang tải chi tiết từ vựng...</div>;
  if (!word || !word.character) return <div className="text-center py-20 text-red-500 font-medium">Không tìm thấy từ vựng này!</div>;

  const chars = word.character.split('');
  const hskLevel = word.hskLevel || (word as any).hsk_level || (word as any).level || 0;

  return (
    <div className="max-w-[1300px] mx-auto pb-24 animate-fade-in relative">
      {renderBreadcrumbs(location.state, deckId, deckName, word.character)}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI - CHI TIẾT TỪ VỰNG & VÍ DỤ */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-gradient-to-br from-white to-red-50/40 rounded-[2rem] p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-red-50 flex flex-col md:flex-row justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-3 mb-6">
                {hskLevel > 0 ? (
                  <span className="bg-[#A82B2B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">HSK {hskLevel}</span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Ngoài HSK</span>
                )}
                <span className="text-gray-500 text-sm font-medium capitalize">{getDisplayPos(word)}</span>
              </div>

              <div className="flex items-end gap-6 mb-4">
                <h1 className="text-8xl md:text-9xl font-medium text-[#A82B2B] leading-none tracking-tight">{word.character}</h1>
                <button onClick={(e) => playAudio(e, word.character || '')} className="w-12 h-12 bg-gray-100 hover:bg-red-100 text-[#A82B2B] rounded-full flex items-center justify-center transition-colors mb-4"><Volume2 className="w-6 h-6" /></button>
              </div>

              <div className="mb-8 pl-1">
                <p className="text-2xl text-gray-800 font-medium">{word.pinyin}</p>
                {word.sinoVietnamese && (
                  <div className="mt-2"><span className="bg-[#FDFBF9] text-[#E09353] border border-[#E09353]/30 px-3 py-1 rounded-md text-sm font-bold tracking-wide uppercase">{word.sinoVietnamese}</span></div>
                )}
              </div>
              
              <div className="border-l-[5px] border-[#A82B2B] pl-4">
                <p className="text-3xl text-gray-900 font-bold tracking-tight">{word.meaning}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8 md:mt-0 justify-center min-w-[200px] z-10">
              <button 
                onClick={() => setIsDeckModalOpen(true)} 
                className="w-full bg-[#A82B2B] hover:bg-[#8b2323] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm"
              >
                <FolderPlus className="w-5 h-5" /> Thêm vào thẻ
              </button>
              
              <button className="w-full bg-white border border-[#A82B2B] text-[#A82B2B] hover:bg-red-50 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm">
                <Edit3 className="w-5 h-5" /> Luyện viết
              </button>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-100/50 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* TAB VÍ DỤ VÀ TỪ LIÊN QUAN */}
          <div className="mt-8">
            <div className="flex gap-8 border-b border-gray-200 mb-6 px-2">
              <button
                onClick={() => setActiveTab('examples')}
                className={`pb-4 text-lg font-bold transition-all border-b-[3px] ${
                  activeTab === 'examples' ? 'border-[#A82B2B] text-[#A82B2B]' : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                Câu ví dụ
              </button>
              <button
                onClick={() => setActiveTab('relations')}
                className={`pb-4 text-lg font-bold transition-all border-b-[3px] ${
                  activeTab === 'relations' ? 'border-[#A82B2B] text-[#A82B2B]' : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                Từ liên quan
              </button>
            </div>

            {activeTab === 'examples' && (
              <div className="animate-fade-in">
                {word.examples && word.examples.length > 0 ? (
                  <div className="space-y-4">
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
                ) : (
                  <div className="bg-white rounded-[1.5rem] p-8 text-center text-gray-400 border border-gray-100">Chưa có câu ví dụ nào cho từ vựng này.</div>
                )}
              </div>
            )}

            {activeTab === 'relations' && (
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
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <HanziBoard 
            activeStrokeChar={activeStrokeChar}
            setActiveStrokeChar={setActiveStrokeChar}
            chars={chars}
            word={word}
          />
        </div>
      </div>

      <AddToDeckModal 
        isOpen={isDeckModalOpen} 
        onClose={() => setIsDeckModalOpen(false)} 
        wordId={word.id} 
        wordCharacter={word.character} 
      />
    </div>
  );
}
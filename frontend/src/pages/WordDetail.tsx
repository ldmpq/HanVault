import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Volume2, GraduationCap, Edit3, PlayCircle, RotateCcw, Play, ChevronRight, Link2, Split } from 'lucide-react';
import axiosClient from '../shared/lib/axiosClient';
import HanziWriter from 'hanzi-writer';
import type { Vocabulary } from '../shared/types/vocabulary.types';
import { useTextToSpeech } from '../shared/hooks/useTextToSpeech';
import { highlightTargetWord } from '../shared/utils/text.utils';

const getDisplayPos = (word: Vocabulary | null) => {
  if (!word) return 'Từ vựng';

  const rawPos = word.partOfSpeech || (word as any).part_of_speech || (word as any).pos;
  if (!rawPos) return 'Từ vựng';
  
  // Từ điển ánh xạ
  const posMap: Record<string, string> = {
    'v': 'Động từ',
    'n': 'Danh từ',
    'adj': 'Tính từ',
    'adv': 'Phó từ',
    'pron': 'Đại từ',
    'num': 'Số từ',
    'm': 'Lượng từ',
    'conj': 'Liên từ',
    'prep': 'Giới từ',
    'part': 'Trợ từ',
    'int': 'Thán từ',
    'idiom': 'Thành ngữ'
  };
  
  return posMap[rawPos.toLowerCase()] || rawPos;
};

export default function WordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  const deckId = location.state?.deckId || '';
  const deckName = location.state?.deckName || 'Chi tiết bộ thẻ';

  const [word, setWord] = useState<Vocabulary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { playAudio } = useTextToSpeech();
  
  const [activeStrokeChar, setActiveStrokeChar] = useState<string>('');
  const writerRef = useRef<HTMLDivElement>(null);
  const [writerInstance, setWriterInstance] = useState<HanziWriter | null>(null);
  const [activeDetails, setActiveDetails] = useState({ strokes: 0, radical: '...' });

  const [activeTab, setActiveTab] = useState<'examples' | 'relations'>('examples');

  useEffect(() => {
    const fetchWordDetail = async () => {
      try {
        const response = await axiosClient.get(`/vocabularies/${id}`);
        if (response.data.success) {
          setWord(response.data.data);
          if (response.data.data.character) {
            setActiveStrokeChar(response.data.data.character[0]);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết từ vựng:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchWordDetail();
  }, [id]);

  useEffect(() => {
    if (!writerRef.current || !activeStrokeChar) return;

    writerRef.current.innerHTML = '';
    const writer = HanziWriter.create(writerRef.current, activeStrokeChar, {
      width: 240, height: 240, padding: 15, strokeAnimationSpeed: 1.5, delayBetweenStrokes: 150,
      strokeColor: '#A82B2B', radicalColor: '#E09353', showOutline: true, outlineColor: '#E5E7EB',
      charDataLoader: (char, onComplete) => {
        fetch(`/hanzi-writer-data/${char}.json`)
          .then(res => res.json())
          .then(onComplete)
          .catch(() => {
            fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`)
              .then(res => res.json())
              .then(onComplete);
          });
      }
    });
    setWriterInstance(writer);
  }, [activeStrokeChar]);

  useEffect(() => {
    if (!activeStrokeChar) return;
    const fetchDynamicCharData = async () => {
      let strokesCount = 0;
      try {
        const res = await fetch(`/hanzi-writer-data/${activeStrokeChar}.json`);
        strokesCount = (await res.json()).strokes?.length || 0; 
      } catch (err) {
        try { strokesCount = (await (await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${activeStrokeChar}.json`)).json()).strokes?.length || 0; } catch (e) {}
      }

      const component = word?.components?.find(c => c.ch === activeStrokeChar);
      let radicalText = 'Chưa rõ';
      if (component) {
        if (component.meaning && component.meaning !== 'Bộ thủ/Thành phần') {
          radicalText = `${component.ch} (${component.meaning})`;
        } else {
          radicalText = component.ch;
        }
      }
      setActiveDetails({ strokes: strokesCount, radical: radicalText });
    };
    fetchDynamicCharData();
  }, [activeStrokeChar, word]);

  if (isLoading) return <div className="text-center py-20 text-gray-500 font-medium">Đang tải chi tiết từ vựng...</div>;
  if (!word || !word.character) return <div className="text-center py-20 text-red-500 font-medium">Không tìm thấy từ vựng này!</div>;

  const chars = word.character.split('');

  const hskLevel = word.hskLevel || (word as any).hsk_level || (word as any).level || 0;
  const displayPos = getDisplayPos(word);

  const renderBreadcrumbs = () => {
    if (location.state?.from === 'dictionary') {
      return (
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8 tracking-wide">
          <Link to="/dictionary" className="hover:text-gray-900 transition-colors">Từ điển</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900">{word.character}</span>
        </div>
      );
    }
    if (deckId) {
      return (
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8 tracking-wide">
          <Link to="/library" className="hover:text-gray-900 transition-colors">Bộ thẻ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/deck/${deckId}`} className="hover:text-gray-900 transition-colors">{deckName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900">{word.character}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8 tracking-wide">
        <Link to="/" className="hover:text-gray-900 transition-colors">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900">{word.character}</span>
      </div>
    );
  };

  return (
    <div className="max-w-[1300px] mx-auto pb-24 animate-fade-in">
      
      {renderBreadcrumbs()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= CỘT TRÁI ================= */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-gradient-to-br from-white to-red-50/40 rounded-[2rem] p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-red-50 flex flex-col md:flex-row justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-3 mb-6">
                {hskLevel > 0 ? (
                  <span className="bg-[#A82B2B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    HSK {hskLevel}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Ngoài HSK
                  </span>
                )}
                <span className="text-gray-500 text-sm font-medium capitalize">
                  {displayPos}
                </span>
              </div>

              <div className="flex items-end gap-6 mb-4">
                <h1 className="text-8xl md:text-9xl font-medium text-[#A82B2B] leading-none tracking-tight">
                  {word.character}
                </h1>
                <button 
                  onClick={(e) => playAudio(e, word.character || '')}
                  className="w-12 h-12 bg-gray-100 hover:bg-red-100 text-[#A82B2B] rounded-full flex items-center justify-center transition-colors mb-4"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-8 pl-1">
                <p className="text-2xl text-gray-800 font-medium">
                  {word.pinyin}
                </p>

                {word.sinoVietnamese && (
                  <div className="mt-2">
                    <span className="bg-[#FDFBF9] text-[#E09353] border border-[#E09353]/30 px-3 py-1 rounded-md text-sm font-bold tracking-wide uppercase">
                      Âm Hán Việt: {word.sinoVietnamese}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="border-l-[5px] border-[#A82B2B] pl-4">
                <p className="text-3xl text-gray-900 font-bold tracking-tight">{word.meaning}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8 md:mt-0 justify-center min-w-[200px] z-10">
              <button onClick={() => navigate(`/review`)} className="w-full bg-[#A82B2B] hover:bg-[#8b2323] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm">
                <GraduationCap className="w-5 h-5" /> Học ngay
              </button>
              <button className="w-full bg-white border border-[#A82B2B] text-[#A82B2B] hover:bg-red-50 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm">
                <Edit3 className="w-5 h-5" /> Luyện viết
              </button>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-100/50 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* ================= HỆ THỐNG TAB (VÍ DỤ & TỪ LIÊN QUAN) ================= */}
          <div className="mt-8">
            {/* Tab Headers */}
            <div className="flex gap-8 border-b border-gray-200 mb-6 px-2">
              <button
                onClick={() => setActiveTab('examples')}
                className={`pb-4 text-lg font-bold transition-all border-b-[3px] ${
                  activeTab === 'examples' 
                    ? 'border-[#A82B2B] text-[#A82B2B]' 
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                Câu ví dụ
              </button>
              <button
                onClick={() => setActiveTab('relations')}
                className={`pb-4 text-lg font-bold transition-all border-b-[3px] ${
                  activeTab === 'relations' 
                    ? 'border-[#A82B2B] text-[#A82B2B]' 
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                Từ liên quan
              </button>
            </div>

            {/* Tab Content: Câu ví dụ */}
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
                          {ex.en ? (
                            <p className="text-gray-800 font-medium">{ex.en}</p>
                          ) : (
                            <p className="text-gray-400 italic text-sm mt-1">Chưa cập nhật bản dịch</p>
                          )}
                        </div>
                        <button 
                          onClick={(e) => playAudio(e, ex.ch)}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#A82B2B] border border-gray-200 group-hover:border-[#A82B2B] transition-colors shrink-0"
                        >
                          <PlayCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[1.5rem] p-8 text-center text-gray-400 border border-gray-100">
                    Chưa có câu ví dụ nào cho từ vựng này.
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Từ liên quan (Đồng nghĩa / Trái nghĩa) */}
            {activeTab === 'relations' && (
              <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 animate-fade-in space-y-8">
                
                {/* Từ đồng nghĩa */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-blue-500" /> Đồng nghĩa
                  </h3>
                  
                  {word.synonyms && word.synonyms.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {word.synonyms.map((syn) => (
                        <div 
                          key={syn.id}
                          onClick={() => navigate(`/word/${syn.id}`)}
                          className="group cursor-pointer bg-blue-50/50 hover:bg-blue-100/50 border border-blue-100 rounded-2xl px-5 py-3 transition-all"
                        >
                          <p className="text-2xl font-medium text-blue-900 mb-1">{syn.character}</p>
                          <p className="text-xs text-blue-600/70 font-medium">{syn.pinyin}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Chưa có dữ liệu từ đồng nghĩa.</p>
                  )}
                </div>

                <div className="w-full h-px bg-gray-100 border-t border-dashed border-gray-200"></div>

                {/* Từ trái nghĩa */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <Split className="w-4 h-4 text-orange-500" /> Trái nghĩa
                  </h3>
                  
                  {word.antonyms && word.antonyms.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {word.antonyms.map((ant) => (
                        <div 
                          key={ant.id}
                          onClick={() => navigate(`/word/${ant.id}`)}
                          className="group cursor-pointer bg-orange-50/50 hover:bg-orange-100/50 border border-orange-100 rounded-2xl px-5 py-3 transition-all"
                        >
                          <p className="text-2xl font-medium text-orange-900 mb-1">{ant.character}</p>
                          <p className="text-xs text-orange-600/70 font-medium">{ant.pinyin}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Chưa có dữ liệu từ trái nghĩa.</p>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ================= CỘT PHẢI - LUYỆN CHỮ ================= */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0D1B2A]">Thứ tự nét bút</h2>
              <div className="flex bg-gray-50/80 rounded-lg p-1 border border-gray-100">
                {chars.map((char, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStrokeChar(char)}
                    className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                      activeStrokeChar === char ? 'bg-white text-[#A82B2B] shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full aspect-square bg-[#FDFBF9] rounded-2xl relative border border-gray-100 overflow-hidden flex items-center justify-center group mb-8">
              <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
                  <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
                </svg>
              </div>
              
              <div ref={writerRef} className="z-10 cursor-crosshair"></div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 z-20">
                <button 
                  onClick={() => { writerInstance?.hideCharacter(); setTimeout(() => writerInstance?.showCharacter(), 50); }}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-[#A82B2B] shadow-sm border border-gray-100 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => writerInstance?.animateCharacter()}
                  className="w-14 h-14 bg-[#A82B2B] rounded-full flex items-center justify-center text-white shadow-lg shadow-red-900/20 hover:bg-[#8b2323] transition-colors"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-[#0D1B2A] mb-6">Chi tiết ký tự</h2>
              
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-[#FDFBF9] rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Số nét ({activeStrokeChar})</span>
                  <span className="text-3xl font-bold text-[#A82B2B]">{activeDetails.strokes}</span>
                </div>
                <div className="flex-1 bg-[#FDFBF9] rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Hình thái ({activeStrokeChar})</span>
                  <span className="text-base font-bold text-[#0D1B2A] mt-1">{activeDetails.radical}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-200">
                <span className="text-sm font-medium text-gray-600">Độ phổ biến</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <StarIcon key={star} className="w-4 h-4 text-[#A82B2B]" />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"></polygon>
    </svg>
  );
}
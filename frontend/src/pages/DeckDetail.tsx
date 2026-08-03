import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Star, Heart, ArrowRight, ChevronRight } from 'lucide-react';
import axiosClient from '../shared/lib/axiosClient';
import SearchFilterBar from '../components/SearchFilterBar';
import type { Vocabulary } from '../shared/types/vocabulary.types';

export default function DeckDetail() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [deckInfo, setDeckInfo] = useState<any>(null);
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDeckDetails = async () => {
      try {
        const response = await axiosClient.get(`/library/decks/${deckId}`);
        if (response.data.success) {
          setDeckInfo(response.data.data.deck);
          setWords(response.data.data.words);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết bộ thẻ:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (deckId) fetchDeckDetails();
  }, [deckId]);

  // Lọc theo Hán tự, pinyin, hoặc nghĩa — không phân biệt hoa/thường
  const filteredWords = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return words;
    return words.filter(
      (w) =>
        w.simplified.toLowerCase().includes(keyword) ||
        w.pinyin.toLowerCase().includes(keyword) ||
        (w.meaning || '').toLowerCase().includes(keyword)
    );
  }, [words, searchTerm]);

  if (isLoading) return <div className="text-center py-20 text-gray-500">Đang tải dữ liệu bộ thẻ...</div>;
  if (!deckInfo) return <div className="text-center py-20 text-red-500">Không tìm thấy bộ thẻ này!</div>;

  // Giả lập dữ liệu thống kê (sau này có thể nối API thật)
  const stats = {
    total: words.length,
    mastered: Math.floor(words.length * 0.2), 
    learning: Math.floor(words.length * 0.1), 
    progressPercent: 24
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-24 animate-fade-in font-sans">
      
      {/* ================= BREADCRUMBS ================= */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 pt-4">
        <span className="cursor-pointer hover:text-gray-900 transition-colors" onClick={() => navigate('/library')}>
          Bộ thẻ
        </span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900">{deckInfo.name}</span>
      </div>

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-16">
        
        {/* Ảnh bìa */}
        <div className="w-full lg:w-[420px] shrink-0 relative rounded-[2rem] overflow-hidden shadow-sm bg-white aspect-[3/4]">
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full z-10 shadow-sm">
            <span className="text-[#A82B2B] text-xs font-bold tracking-wide">HSK {deckInfo.hskLevel || 4}</span>
          </div>
          <img 
            src={deckInfo.coverUrl || "https://images.unsplash.com/photo-1541959833400-049d37f98ccd?w=800&q=80"} 
            alt={deckInfo.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 flex flex-col justify-center">
          
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-[#FFEFE5] text-[#E07A5F] text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded">
              Vocabulary Deck
            </span>
            <div className="flex items-center gap-1.5 text-[#D4AF37] text-sm font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>4.9 <span className="text-gray-400 font-medium text-xs ml-1">(128 reviews)</span></span>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-medium text-gray-900 mb-5 tracking-tight">
            {deckInfo.name}
          </h1>
          
          <p className="text-gray-600 text-[15px] leading-relaxed mb-10 max-w-2xl">
            {deckInfo.description || 'Accelerate your professional communication skills with this comprehensive deck focused on modern business terminology, negotiations, and formal workplace etiquette. Designed for intermediate to advanced learners seeking fluency in corporate environments.'}
          </p>

          {/* Khôi phục Hàng Thống Kê (4 ô vuông) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-[#A82B2B] mb-1">{stats.total}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Words</span>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-[#E08535] mb-1">{stats.mastered}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mastered</span>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-[#C7B745] mb-1">{stats.learning}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Learning</span>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-50 flex items-center justify-center">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke="#F3F4F6" strokeWidth="5" fill="transparent" />
                  <circle 
                    cx="28" cy="28" r="24" 
                    stroke="#A82B2B" strokeWidth="5" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 24} 
                    strokeDashoffset={2 * Math.PI * 24 * (1 - stats.progressPercent / 100)} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{stats.progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/review/${deckId}`)}
              disabled={words.length === 0}
              className="bg-[#A82B2B] hover:bg-[#8b2323] disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" /> Start Learning
            </button>
            <button className="bg-white hover:bg-gray-50 text-[#A82B2B] px-8 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 border border-gray-200 transition-colors shadow-sm">
              <Heart className="w-4 h-4" /> Favorite
            </button>
          </div>
        </div>
      </div>

      {/* ================= VOCABULARY PREVIEW SECTION ================= */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Vocabulary Preview</h2>
            <p className="text-gray-500 text-sm">A glimpse of the characters in this deck.</p>
          </div>
          <button className="text-[#A82B2B] text-sm font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-8">
          <SearchFilterBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Bạn muốn tìm từ nào?"
            onFilterClick={() => {}}
          />
        </div>

        {words.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl text-gray-400 shadow-[0_2px_15px_rgb(0,0,0,0.03)]">
            Bộ thẻ này hiện chưa có từ vựng nào.
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl text-gray-400 shadow-[0_2px_15px_rgb(0,0,0,0.03)]">
            Không tìm thấy từ nào khớp với "{searchTerm}".
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                onClick={() =>
                  navigate(`/word/${word.id}`, {
                    state: { deckId: deckId, deckName: deckInfo.name },
                  })
                }
                className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-[0_2px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer aspect-square"
              >
                <h2 className="text-6xl font-bold text-gray-900 mb-4">{word.simplified}</h2>
                <p className="text-sm font-medium text-gray-500">{word.pinyin}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
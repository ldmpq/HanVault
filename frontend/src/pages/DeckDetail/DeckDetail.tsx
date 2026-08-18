import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowRight, ChevronRight } from 'lucide-react';
import Pagination from '../../shared/components/Pagination';
import { useDeckDetail } from './hooks/useDeckDetail';
import DeckWordCard from './components/DeckWordCard';

export default function DeckDetail() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const {
    deckInfo,
    words,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    displayedWords
  } = useDeckDetail(deckId);

  if (isLoading) return <div className="text-center py-20 text-sub">Đang tải dữ liệu bộ thẻ...</div>;
  if (!deckInfo) return <div className="text-center py-20 text-red-500">Không tìm thấy bộ thẻ này!</div>;

  const stats = deckInfo.stats || { total: 0, mastered: 0, learning: 0, progressPercent: 0 };

  return (
    <div className="max-w-[1200px] mx-auto pb-24 animate-fade-in font-sans">
      
      {/* ================= BREADCRUMBS ================= */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-sub uppercase tracking-widest mb-8 pt-4">
        <span className="cursor-pointer hover:text-main transition-colors" onClick={() => navigate('/library')}>
          Bộ thẻ
        </span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-main">{deckInfo.name}</span>
      </div>

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-16">
        <div className="w-full lg:w-[420px] shrink-0 relative rounded-[2rem] overflow-hidden shadow-sm bg-surface aspect-[3/4] border border-line">
          <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-4 py-1.5 rounded-full z-10 shadow-sm border border-line">
            <span className="text-brand text-xs font-bold tracking-wide">HSK {deckInfo.hskLevel || 4}</span>
          </div>
          <img 
            src={deckInfo.coverUrl || "https://images.unsplash.com/photo-1541959833400-049d37f98ccd?w=800&q=80"} 
            alt={deckInfo.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-brand/10 text-brand text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded border border-brand/20">
              Vocabulary Deck
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-medium text-main mb-5 tracking-tight">
            {deckInfo.name}
          </h1>
          
          <p className="text-sub text-[15px] leading-relaxed mb-10 max-w-2xl">
            {deckInfo.description || 'Accelerate your professional communication skills with this comprehensive deck focused on modern business terminology, negotiations, and formal workplace etiquette.'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-surface rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-line flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-brand mb-1">{stats.total}</span>
              <span className="text-[10px] text-sub font-bold uppercase tracking-widest">Tổng số từ</span>
            </div>
            <div className="bg-surface rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-line flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-orange-500 mb-1">{stats.mastered}</span>
              <span className="text-[10px] text-sub font-bold uppercase tracking-widest">Đã học thuộc</span>
            </div>
            <div className="bg-surface rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-line flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-yellow-500 mb-1">{stats.learning}</span>
              <span className="text-[10px] text-sub font-bold uppercase tracking-widest">Đang học</span>
            </div>
            <div className="bg-surface rounded-2xl p-5 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-line flex items-center justify-center">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="24" strokeWidth="5" fill="transparent" className="stroke-line" />
                  <circle 
                    cx="28" cy="28" r="24" 
                    strokeWidth="5" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 24} 
                    strokeDashoffset={2 * Math.PI * 24 * (1 - stats.progressPercent / 100)} 
                    strokeLinecap="round"
                    className="stroke-brand transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-main">{stats.progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/review/${deckId}`)}
              disabled={words.length === 0}
              className="bg-brand hover:bg-brand-hover disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" /> Bắt đầu ôn tập
            </button>
            {/* <button className="bg-surface hover:bg-line/50 text-brand px-8 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 border border-line transition-colors shadow-sm">
              <Heart className="w-4 h-4" /> Yêu thích
            </button> */}
          </div>
        </div>
      </div>

      {/* ================= VOCABULARY PREVIEW SECTION ================= */}
      <div className="pt-8 border-t border-line">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-main mb-1">Danh sách từ vựng</h2>
            <p className="text-sub text-sm">Xem trước các từ vựng bạn sẽ học trong bộ thẻ này.</p>
          </div>
          <button className="text-brand text-sm font-bold flex items-center gap-1 hover:underline">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {words.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl text-sub border border-line shadow-sm">
            Bộ thẻ này hiện chưa có từ vựng nào.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {displayedWords.map((word) => (
                <DeckWordCard 
                  key={word.id} 
                  word={word} 
                  deckId={deckId} 
                  deckName={deckInfo.name} 
                />
              ))}
            </div>

            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => setCurrentPage(page)} 
            />
          </>
        )}
      </div>
    </div>
  );
}
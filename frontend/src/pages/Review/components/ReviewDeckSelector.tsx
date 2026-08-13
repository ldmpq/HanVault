import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosClient from '../../../shared/lib/axiosClient';
import { getUIConfigForLevel } from '../../../shared/utils/hsk.utils';

const DeckSection = ({ title, decks, isCompleted }: any) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  
  const itemsPerPage = 4;
  const totalPages = Math.ceil(decks.length / itemsPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(0, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

  const visibleDecks = decks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  if (decks.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-3xl font-bold text-main">{title}</h2>
        </div>

        {/* Nút Chuyển tiếp (Chỉ hiện khi số lượng thẻ > 4) */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="p-2 rounded-full border border-line text-sub hover:text-brand hover:border-brand transition-colors bg-surface disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:text-sub"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full border border-line text-sub hover:text-brand hover:border-brand transition-colors bg-surface disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:text-sub"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {visibleDecks.map((deck: any) => (
          <div 
            key={deck.id} 
            onClick={() => navigate(`/review/${deck.id}`)} 
            className="bg-surface rounded-[2rem] p-6 shadow-sm border border-line hover:border-brand/30 hover:shadow-md transition-all cursor-pointer flex flex-col min-h-[260px] relative"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-10 h-10 ${deck.bgColor} ${deck.iconColor} rounded-xl flex items-center justify-center border border-current/10`}>
                <span className="font-bold text-lg leading-none">{deck.icon}</span>
              </div>
              <span className="bg-line/50 text-sub text-[10px] font-bold px-2 py-1 rounded-full border border-line">
                {deck.tag}
              </span>
            </div>

            <h3 className="text-lg font-bold text-main mb-1 line-clamp-1">{deck.title || deck.name}</h3>
            <p className="text-xs text-sub mb-6 flex-1 leading-relaxed line-clamp-2">
              {deck.description || 'Bộ từ vựng cơ bản để bắt đầu hành trình học tập.'}
            </p>
            
            <div className="flex items-center gap-1.5 text-xs font-bold text-sub mb-3">
              <span className="text-sm font-bold text-brand leading-none">字</span>{deck.words || 0} từ
            </div>

            <div className="w-full h-1.5 bg-line rounded-full overflow-hidden mb-4">
              <div 
                className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-brand'} rounded-full`} 
                style={{ width: `${deck.progress}%` }}
              ></div>
            </div>
            <button 
              className={`w-full py-2.5 rounded-xl border font-bold text-xs transition-colors ${
                isCompleted 
                  ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/10' 
                  : 'border-brand text-brand hover:bg-brand/10'
              }`}
            >
              {isCompleted ? 'Ôn tập lại' : 'Tiếp tục'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function ReviewDeckSelector() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axiosClient.get('/library/decks');
        if (response.data.success) {
          const formattedDecks = response.data.data.map((dbDeck: any) => {
            const title = dbDeck.title || dbDeck.name || '';
            if (title.toLowerCase().includes('yêu thích')) {
              return { ...dbDeck, level: null, tag: 'Cá nhân', bgColor: 'bg-pink-50', iconColor: 'text-[#A82B2B]', icon: '❤️' };
            }
            if (!dbDeck.level && !dbDeck.isSystem) {
               return { ...dbDeck, level: null, tag: 'Tự tạo', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', icon: dbDeck.icon || '📘' };
            }
            return { ...dbDeck, ...getUIConfigForLevel(dbDeck.level) };
          });
          
          setDecks(formattedDecks || []);
        }
      } catch (error) {
        console.error('Lỗi tải danh sách bộ thẻ ôn tập:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDecks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
        <p className="text-sub font-medium">Đang chuẩn bị Sảnh ôn tập...</p>
      </div>
    );
  }

  // 1. LỌC: Chỉ lấy những thẻ thực sự có học (progress là 1 con số > 0)
  const learningDecks = decks.filter(deck => {
    const prog = Number(deck.progress);
    return !isNaN(prog) && prog > 0;
  });

  // 2. PHÂN LOẠI: Đang học và Đã hoàn thành
  const inProgressDecks = learningDecks.filter(deck => Number(deck.progress) < 100);
  const completedDecks = learningDecks.filter(deck => Number(deck.progress) >= 100);

  return (
    <div className="w-full max-w-[1200px] mx-auto py-10 px-4 animate-fade-in text-main transition-colors">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-main mb-3">Sảnh Ôn Tập</h1>
      </div>

      <div className="space-y-4">
        {/* Render Phần 1: Đang học */}
        <DeckSection 
          title="Đang học" 
          iconColor="text-orange-500" 
          bgColor="bg-orange-500/10" 
          decks={inProgressDecks} 
          isCompleted={false} 
        />

        {/* Render Phần 2: Đã hoàn thành */}
        <DeckSection 
          title="Đã hoàn thành" 
          iconColor="text-emerald-500" 
          bgColor="bg-emerald-500/10" 
          decks={completedDecks} 
          isCompleted={true} 
        />

        {/* Thông báo khi không có bất kỳ thẻ nào đang học */}
        {learningDecks.length === 0 && (
          <div className="bg-surface border border-line rounded-[2rem] p-12 text-center border-dashed mt-8">
            <h3 className="text-xl font-bold text-main mb-2">Chưa có dữ liệu ôn tập</h3>
            <p className="text-sub mb-6">Bạn cần bắt đầu học ít nhất một bộ thẻ trong Thư viện để hệ thống ghi nhận tiến độ.</p>
            <button 
              onClick={() => navigate('/library')} 
              className="bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm"
            >
              Đến Thư viện
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
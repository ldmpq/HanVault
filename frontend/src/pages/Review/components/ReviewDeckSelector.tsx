import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosClient from '../../../shared/lib/axiosClient';
import { getUIConfigForLevel } from '../../../shared/utils/hsk.utils';
import LibraryBanner from '../../Library/components/LibraryBanner';
import LibraryDeckCard from '../../Library/components/LibraryDeckCard';

const DeckSection = ({ title, decks }: any) => {
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
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-main">{title}</h2>
        </div>

        {/* Nút Chuyển tiếp */}
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

      {/* Grid Section - Dùng LibraryDeckCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {visibleDecks.map((deck: any) => (
          <LibraryDeckCard
            key={deck.id}
            deck={deck}
            customOnClick={() => navigate(`/review/${deck.id}`)}
          />
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
            const levelStr = dbDeck.level || dbDeck.hskLevel || (title.match(/HSK\s*(\d+)/i)?.[1]);
            const levelNum = levelStr ? Number(levelStr) : null;

            if (!levelNum && !dbDeck.isSystem) {
               return { ...dbDeck, level: null, tag: 'Tự tạo', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', icon: dbDeck.icon || '📘' };
            }
            return { 
              ...dbDeck, 
              level: levelNum || dbDeck.level,
              ...getUIConfigForLevel((levelNum || dbDeck.level) as number) 
            };
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

  // Lọc và phân loại thẻ
  const customDecks = decks.filter(deck => deck.tag === 'Tự tạo' || deck.tag === 'Cá nhân');

  const systemLearningDecks = decks.filter(deck => {
    const prog = Number(deck.progress);
    return !isNaN(prog) && prog > 0 && deck.tag !== 'Tự tạo' && deck.tag !== 'Cá nhân';
  });

  const inProgressDecks = systemLearningDecks.filter(deck => Number(deck.progress) < 100);
  const completedDecks = systemLearningDecks.filter(deck => Number(deck.progress) >= 100);

  return (
    <div className="animate-fade-in pb-20 w-full max-w-[1200px] mx-auto text-main transition-colors">
      <LibraryBanner 
        title="Ôn tập" 
        description="Tiếp tục hành trình học tập với Spaced Repetition. Tại đây chỉ hiển thị những bộ thẻ bạn đã bắt đầu học."
      />

      <div className="space-y-4">
        {/* Cá nhân */}
        {customDecks.length > 0 && (
          <DeckSection 
            title="Bộ thẻ của bạn" 
            countColor="text-blue-500" 
            countBg="bg-blue-500/10" 
            decks={customDecks} 
          />
        )}

        {/* Đang học */}
        <DeckSection 
          title="Đang học" 
          countColor="text-orange-500" 
          countBg="bg-orange-500/10" 
          decks={inProgressDecks} 
        />

        {/* Đã hoàn thành */}
        <DeckSection 
          title="Đã hoàn thành" 
          countColor="text-emerald-500" 
          countBg="bg-emerald-500/10" 
          decks={completedDecks} 
        />

        {/* Thông báo */}
        {customDecks.length === 0 && systemLearningDecks.length === 0 && (
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
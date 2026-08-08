import { Plus } from 'lucide-react';
import LibraryDeckCard from '../components/LibraryDeckCard';
import Pagination from '../../../shared/components/Pagination';

interface DeckGridProps {
  isLoading: boolean;
  activeTab: string;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  paginatedDecks: any[];
  visibleDecksLength: number;
  itemsPerPage: number;
  activeMenuId: number | null;
  setActiveMenuId: (id: number | null) => void;
  setTargetDeck: (deck: any) => void;
  setIsDeckModalOpen: (isOpen: boolean) => void;
  handleDeleteDeck: (id: number) => void;
  setCurrentPage: (page: number) => void;
}

export default function DeckGrid({
  isLoading, activeTab, searchQuery, currentPage, totalPages,
  paginatedDecks, visibleDecksLength, itemsPerPage,
  activeMenuId, setActiveMenuId, setTargetDeck,
  setIsDeckModalOpen, handleDeleteDeck, setCurrentPage
}: DeckGridProps) {
  
  if (isLoading) {
    return <div className="text-center py-20 text-sub font-medium">Đang tải thư viện...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeTab === 'My list' && currentPage === 1 && !searchQuery && (
          <div 
            onClick={() => { setTargetDeck(null); setIsDeckModalOpen(true); }} 
            className="bg-surface border-2 border-dashed border-brand/30 hover:border-brand rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px] group"
          >
            <div className="w-16 h-16 bg-brand/10 group-hover:bg-brand/20 rounded-full flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-8 h-8 text-brand" />
            </div>
            <h3 className="text-lg font-bold text-brand">Tạo thẻ mới</h3>
            <p className="text-xs text-sub mt-2 text-center">Tùy chỉnh từ vựng theo cách của bạn</p>
          </div>
        )}

        {paginatedDecks.map((deck) => (
          <LibraryDeckCard
            key={deck.id}
            deck={deck}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            setTargetDeck={setTargetDeck}
            setIsDeckModalOpen={setIsDeckModalOpen}
            handleDeleteDeck={handleDeleteDeck}
          />
        ))}
      </div>

      {visibleDecksLength === 0 && (
        <div className="text-center py-20 text-sub font-medium">Không tìm thấy bộ thẻ nào phù hợp.</div>
      )}

      {visibleDecksLength > itemsPerPage && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
}
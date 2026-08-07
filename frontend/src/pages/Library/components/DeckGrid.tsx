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
    return <div className="text-center py-20 text-gray-400 font-medium">Đang tải thư viện...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* NÚT TẠO THẺ (Chỉ hiển thị ở Tab My list) */}
        {activeTab === 'My list' && currentPage === 1 && !searchQuery && (
          <div 
            onClick={() => { setTargetDeck(null); setIsDeckModalOpen(true); }} 
            className="bg-white border-2 border-dashed border-[#A82B2B]/30 hover:border-[#A82B2B] rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px] group"
          >
            <div className="w-16 h-16 bg-red-50 group-hover:bg-red-100 rounded-full flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-8 h-8 text-[#A82B2B]" />
            </div>
            <h3 className="text-lg font-bold text-[#A82B2B]">Tạo thẻ mới</h3>
            <p className="text-xs text-gray-400 mt-2 text-center">Tùy chỉnh từ vựng theo cách của bạn</p>
          </div>
        )}

        {/* RENDER DANH SÁCH THẺ */}
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

      {/* TRẠNG THÁI EMPTY & PHÂN TRANG */}
      {visibleDecksLength === 0 && (
        <div className="text-center py-20 text-gray-400 font-medium">Không tìm thấy bộ thẻ nào phù hợp.</div>
      )}

      {visibleDecksLength > itemsPerPage && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
}
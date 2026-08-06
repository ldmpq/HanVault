import { useNavigate } from 'react-router-dom';
import { Book, GraduationCap, Search, Plus } from 'lucide-react';
import Pagination from '../components/Pagination';
import DeckFormModal from '../components/DeckFormModal';
import { useLibrary } from '../shared/hooks/useLibrary';
import LibraryDeckCard from '../components/LibraryDeckCard';

export default function Library() {
  const navigate = useNavigate();

  const {
    TABS, CAROUSEL_IMAGES, DAILY_IMAGES, ITEMS_PER_PAGE,
    activeTab, setActiveTab,
    isLoading, currentSlide, setCurrentSlide,
    searchQuery, setSearchQuery,
    isDeckModalOpen, setIsDeckModalOpen,
    targetDeck, setTargetDeck,
    activeMenuId, setActiveMenuId,
    currentPage, setCurrentPage,
    visibleDecks, totalPages, paginatedDecks,
    carouselDecks, dailyDeck,
    fetchDecks, handleDeleteDeck
  } = useLibrary();

  return (
    <div className="animate-fade-in pb-20 w-full max-w-[1200px] mx-auto">
      
      {/* HEADER BANNER */}
      <div className="bg-[#F8F9FA] rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center mb-10 shadow-sm border border-gray-100 overflow-hidden">
        <div className="max-w-md z-10 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Bộ thẻ</h1>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Học và ôn tập từ vựng bằng Flashcard với các bộ thẻ theo trình độ HSK, chủ đề hoặc tự tạo theo sở thích.
          </p>
        </div>
        <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-sm">
          <img src="/images/chinese-flashcards.jpg" alt="Study Desk Illustration" className="w-full h-48 md:h-64 object-cover" />
        </div>
      </div>

      {/* TÍNH NĂNG NỔI BẬT (Carousel & Daily Suggestion) */}
      {!isLoading && carouselDecks.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bộ sưu tập nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Carousel */}
            <div className="md:col-span-8 relative rounded-[2rem] overflow-hidden shadow-sm h-[280px] bg-gray-900 group">
              {carouselDecks.map((deck, idx) => {
                const isActive = idx === currentSlide;
                const bgImg = CAROUSEL_IMAGES[idx % CAROUSEL_IMAGES.length];
                return (
                  <div key={deck.id} onClick={() => navigate(`/deck/${deck.id}`)} className={`absolute inset-0 transition-opacity duration-1000 cursor-pointer ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <img src={bgImg} alt={deck.title} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ${isActive ? 'scale-110' : 'scale-100'}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    {deck.level && <div className="absolute top-6 right-6 bg-[#A82B2B] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">HSK {deck.level}</div>}
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1 block">{deck.tag || 'Bộ thẻ Nổi bật'}</span>
                      <h3 className="text-3xl font-bold text-white mb-2 truncate">{deck.title}</h3>
                      <div className="flex gap-4 text-xs font-medium text-white/90">
                        <span className="flex items-center gap-1"><Book className="w-3.5 h-3.5" /> {deck.words} Từ vựng</span>
                        <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Bắt đầu học</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Pagination Dots */}
              <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                {carouselDecks.map((_, idx) => (
                  <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-[#A82B2B]' : 'w-2 bg-white/50 hover:bg-white/80'}`} />
                ))}
              </div>
            </div>

            {/* Daily Deck */}
            {dailyDeck && (
              <div onClick={() => navigate(`/deck/${dailyDeck.id}`)} className="md:col-span-4 bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
                <div className="relative h-32 overflow-hidden bg-gray-100">
                  <img src={DAILY_IMAGES[dailyDeck.id % DAILY_IMAGES.length]} alt={dailyDeck.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-[#A82B2B] uppercase tracking-widest mb-1 block">Gợi ý hôm nay</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1" title={dailyDeck.title}>{dailyDeck.title}</h3>
                  <p className="text-xs text-gray-500 mb-6 flex-1 line-clamp-2 leading-relaxed">{dailyDeck.description || 'Khám phá bộ thẻ từ vựng thú vị dành riêng cho ngày hôm nay để mở rộng vốn từ của bạn.'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><Book className="w-3.5 h-3.5" /> {dailyDeck.words} từ</span>
                    <button className="bg-gray-100 group-hover:bg-[#A82B2B] group-hover:text-white text-gray-700 text-xs font-bold px-5 py-2 rounded-lg transition-colors">Khám phá</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DANH SÁCH BỘ THẺ */}
      <div>
        {/* TABS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Thư viện</h2>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeTab === tab ? 'bg-red-50 text-[#A82B2B] border border-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* BỘ LỌC TÌM KIẾM */}
        <div className="mb-8 relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm bộ thẻ theo tên..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A82B2B]/20 focus:border-[#A82B2B] transition-all shadow-sm"
          />
        </div>

        {/* LƯỚI BỘ THẺ */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400 font-medium">Đang tải thư viện...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* THẺ ĐẶC BIỆT: TẠO THẺ CÁ NHÂN */}
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

            {/* DANH SÁCH BỘ THẺ (Sử dụng Component đã tách) */}
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
        )}

        {/* TRẠNG THÁI EMPTY & PHÂN TRANG */}
        {!isLoading && visibleDecks.length === 0 && (
           <div className="text-center py-20 text-gray-400 font-medium">Không tìm thấy bộ thẻ nào phù hợp.</div>
        )}

        {!isLoading && visibleDecks.length > ITEMS_PER_PAGE && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>

      <DeckFormModal 
        isOpen={isDeckModalOpen}
        deck={targetDeck}
        onClose={() => setIsDeckModalOpen(false)}
        onSuccess={fetchDecks}
      />
    </div>
  );
}
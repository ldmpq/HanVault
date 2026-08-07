import { DatabaseBackup } from 'lucide-react';
import { useTextToSpeech } from '../../shared/hooks/useTextToSpeech';
import Pagination from '../../shared/components/Pagination';
import SearchFilterBar from '../../shared/components/SearchFilterBar';
import { useDictionary } from './hooks/useDictionary';
import DictionaryCard from './components/DictionaryCard';

export default function Dictionary() {
  const { playAudio } = useTextToSpeech();

  const {
    words, topics, favoriteIds, isLoading,
    searchTerm, setSearchTerm,
    hskFilter, setHskFilter,
    topicFilter, setTopicFilter,
    showFavorites, setShowFavorites,
    currentPage, setCurrentPage, totalPages,
    toggleFavorite
  } = useDictionary();

  return (
    <div className="min-h-screen bg-[#FCFAF8] font-sans pb-24 animate-fade-in relative">
      
      <div className="max-w-[800px] mx-auto pt-16 pb-8 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Tra cứu từ vựng</h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
          Tra cứu từ vựng tiếng Trung, tìm kiếm theo chữ Hán, pinyin hoặc nghĩa.
        </p>

        <SearchFilterBar 
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          hskFilter={hskFilter}
          onHskFilterChange={(val) => { setHskFilter(val); setCurrentPage(1); }}
          topicFilter={topicFilter}
          onTopicFilterChange={(val) => { setTopicFilter(val); setCurrentPage(1); }}
          showFavorites={showFavorites}
          onShowFavoritesChange={(val) => { setShowFavorites(val); setCurrentPage(1); }}
          topics={topics}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Đang tải dữ liệu...</div>
        ) : words.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <DatabaseBackup className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy từ vựng</h3>
            <p className="text-gray-500 text-sm">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {words.map((word) => (
              <DictionaryCard 
                key={word.id} 
                word={word} 
                isFav={favoriteIds.has(word.id)}
                onToggleFavorite={toggleFavorite}
                onPlayAudio={playAudio}
              />
            ))}
          </div>
        )}

        {!isLoading && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        )}
      </div>
    </div>
  );
}
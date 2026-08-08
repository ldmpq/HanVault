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
    <div className="min-h-screen bg-app font-sans pb-24 animate-fade-in relative transition-colors">
      
      <div className="max-w-[800px] mx-auto pt-16 pb-8 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-main mb-4 tracking-tight">Tra cứu từ vựng</h1>
        <p className="text-sub mb-8 max-w-xl mx-auto leading-relaxed">
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
          <div className="text-center py-20 text-sub font-medium animate-pulse">Đang tải dữ liệu...</div>
        ) : words.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-line shadow-sm">
            <DatabaseBackup className="w-16 h-16 text-sub mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-main mb-2">Không tìm thấy từ vựng</h3>
            <p className="text-sub text-sm">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
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
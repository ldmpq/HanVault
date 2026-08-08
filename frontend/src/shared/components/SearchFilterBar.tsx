import { useState } from 'react';
import { Search, SlidersHorizontal, X, History, Trash2, CheckCircle2, Heart } from 'lucide-react';
import { useRecentSearches } from '../../shared/hooks/useRecentSearches';
import { HSK_FILTER_OPTIONS } from '../../shared/constants/app.constants';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  hskFilter: string;
  onHskFilterChange: (value: string) => void;
  topicFilter: string;
  onTopicFilterChange: (value: string) => void;
  showFavorites: boolean;
  onShowFavoritesChange: (value: boolean) => void;
  topics: any[];
  placeholder?: string;
  filterLabel?: string;
}

export default function SearchFilterBar({
  searchTerm, onSearchChange,
  hskFilter, onHskFilterChange,
  topicFilter, onTopicFilterChange,
  showFavorites, onShowFavoritesChange,
  topics,
  placeholder = 'Tìm kiếm từ vựng (Hán tự, Pinyin, Nghĩa)...',
  filterLabel = 'Bộ lọc nâng cao',
}: SearchFilterBarProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { recentSearches, clearRecentSearches } = useRecentSearches(searchTerm);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-sub" />
          </div>
          <input
            type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-14 pr-6 py-4 bg-surface text-main border border-line rounded-full text-base focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-sub shadow-sm"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-brand/10 text-brand border border-brand/20 px-8 py-4 rounded-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-brand/20 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" /> {filterLabel}
        </button>
      </div>

      {(hskFilter || topicFilter || showFavorites) && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 mb-6">
          <span className="text-xs font-bold text-sub uppercase tracking-widest mr-2">Đang lọc:</span>
          
          {hskFilter && (
            <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-medium border border-brand/20">
              {HSK_FILTER_OPTIONS.find(o => o.value === hskFilter)?.label}
            </span>
          )}
          
          {topicFilter && (
            <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-medium border border-brand/20">
              {topics.find(t => t.id.toString() === topicFilter)?.name}
            </span>
          )}
          
          {showFavorites && (
            <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-medium border border-brand/20 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current" /> Yêu thích
            </span>
          )}
          
          <button 
            onClick={() => { onHskFilterChange(''); onTopicFilterChange(''); onShowFavoritesChange(false); }}
            className="text-sub hover:text-main text-xs font-medium underline ml-2 transition-colors"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-app rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in max-h-[90vh] border border-line">
            
            <div className="flex items-center justify-between p-5 border-b border-line bg-surface">
              <h2 className="text-lg font-bold text-main">Bộ lọc nâng cao</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-sub hover:text-main bg-line/50 hover:bg-line p-1.5 rounded-md transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-left">
              
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-sub uppercase tracking-widest">Từ khóa gần đây</h3>
                    <button onClick={clearRecentSearches} className="text-[10px] text-sub hover:text-brand flex items-center gap-1 uppercase font-bold">
                      <Trash2 className="w-3 h-3" /> Xóa lịch sử
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <button key={idx} onClick={() => { onSearchChange(term); setIsModalOpen(false); }} className="bg-surface border border-line text-main px-4 py-2 rounded-lg text-sm font-medium hover:bg-line/50 flex items-center gap-2 transition-colors shadow-sm">
                        <History className="w-4 h-4 text-sub" /> {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xs font-bold text-sub uppercase tracking-widest mb-3">Cấp độ HSK</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  <button onClick={() => onHskFilterChange('')} className={`py-2.5 rounded-xl text-sm font-medium transition-colors border ${hskFilter === '' ? 'bg-brand text-white border-brand shadow-md' : 'bg-surface text-sub border-transparent hover:border-line'}`}>Tất cả</button>
                  {HSK_FILTER_OPTIONS.map(option => (
                    <button key={option.value} onClick={() => onHskFilterChange(option.value)} className={`py-2.5 rounded-xl text-sm font-medium transition-colors border flex items-center justify-center gap-1.5 ${hskFilter === option.value ? 'bg-brand text-white border-brand shadow-md' : 'bg-surface text-sub border-transparent hover:border-line shadow-sm'}`}>
                      {hskFilter === option.value && <CheckCircle2 className="w-4 h-4" />} {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-bold text-sub uppercase tracking-widest mb-3">Chủ đề từ vựng</h3>
                <div className="bg-surface p-1 rounded-xl shadow-sm border border-line">
                  <select value={topicFilter} onChange={(e) => onTopicFilterChange(e.target.value)} className="w-full bg-transparent border-none text-main py-3 px-4 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer">
                    <option value="">Tất cả chủ đề</option>
                    {topics.map(t => <option key={t.id} value={t.id}>{t.name} ({t.vocabCount} từ)</option>)}
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-sub uppercase tracking-widest mb-3">Bộ sưu tập</h3>
                <button onClick={() => onShowFavoritesChange(!showFavorites)} className={`w-full sm:w-auto py-3 px-6 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 border ${showFavorites ? 'bg-brand/10 border-brand/30 text-brand shadow-sm' : 'bg-surface border-transparent text-sub hover:border-line shadow-sm'}`}>
                  <Heart className="w-5 h-5" fill={showFavorites ? "currentColor" : "none"} /> Từ vựng Yêu thích
                </button>
              </div>
            </div>

            <div className="p-5 border-t border-line bg-surface flex justify-end gap-3">
              <button onClick={() => { onHskFilterChange(''); onTopicFilterChange(''); onShowFavoritesChange(false); }} className="px-6 py-2.5 rounded-xl text-sm font-bold text-sub hover:bg-line/50 transition-colors">Đặt lại</button>
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-2.5 rounded-xl text-sm font-bold bg-brand text-white hover:bg-brand-hover shadow-md transition-colors">Ok</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
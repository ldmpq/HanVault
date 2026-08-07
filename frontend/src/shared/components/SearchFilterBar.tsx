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
      {/* 1. THANH TÌM KIẾM CHÍNH */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-14 pr-6 py-4 bg-white rounded-full text-base focus:outline-none focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-400 shadow-sm"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-red-50 text-[#A82B2B] px-8 py-4 rounded-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" /> {filterLabel}
        </button>
      </div>

      {/* 2. HIỂN THỊ BADGE LỌC NHANH TRÊN MÀN HÌNH CHÍNH */}
      {(hskFilter || topicFilter || showFavorites) && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 mb-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Đang lọc:</span>
          
          {hskFilter && (
            <span className="bg-red-50 text-[#A82B2B] px-3 py-1 rounded-full text-xs font-medium border border-red-100">
              {HSK_FILTER_OPTIONS.find(o => o.value === hskFilter)?.label}
            </span>
          )}
          
          {topicFilter && (
            <span className="bg-red-50 text-[#A82B2B] px-3 py-1 rounded-full text-xs font-medium border border-red-100">
              {topics.find(t => t.id.toString() === topicFilter)?.name}
            </span>
          )}
          
          {showFavorites && (
            <span className="bg-red-50 text-[#A82B2B] px-3 py-1 rounded-full text-xs font-medium border border-red-100 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current" /> Yêu thích
            </span>
          )}
          
          <button 
            onClick={() => { onHskFilterChange(''); onTopicFilterChange(''); onShowFavoritesChange(false); }}
            className="text-gray-400 hover:text-gray-700 text-xs font-medium underline ml-2 transition-colors"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* 3. MODAL LỌC NÂNG CAO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#F4F4F5] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200/60 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Bộ lọc nâng cao</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-md transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-left">
              
              {/* Lịch sử tìm kiếm */}
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Từ khóa gần đây</h3>
                    <button onClick={clearRecentSearches} className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1 uppercase font-bold">
                      <Trash2 className="w-3 h-3" /> Xóa lịch sử
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <button key={idx} onClick={() => { onSearchChange(term); setIsModalOpen(false); }} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm">
                        <History className="w-4 h-4 text-gray-400" /> {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lọc HSK */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Cấp độ HSK</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  <button onClick={() => onHskFilterChange('')} className={`py-2.5 rounded-xl text-sm font-medium transition-colors border ${hskFilter === '' ? 'bg-[#A82B2B] text-white border-[#A82B2B] shadow-md' : 'bg-white text-gray-600 border-transparent hover:border-gray-200'}`}>Tất cả</button>
                  {HSK_FILTER_OPTIONS.map(option => (
                    <button key={option.value} onClick={() => onHskFilterChange(option.value)} className={`py-2.5 rounded-xl text-sm font-medium transition-colors border flex items-center justify-center gap-1.5 ${hskFilter === option.value ? 'bg-[#A82B2B] text-white border-[#A82B2B] shadow-md' : 'bg-white text-gray-600 border-transparent hover:border-gray-200 shadow-sm'}`}>
                      {hskFilter === option.value && <CheckCircle2 className="w-4 h-4" />} {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lọc Chủ đề */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Chủ đề từ vựng</h3>
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                  <select value={topicFilter} onChange={(e) => onTopicFilterChange(e.target.value)} className="w-full bg-transparent border-none text-gray-700 py-3 px-4 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                    <option value="">Tất cả chủ đề</option>
                    {topics.map(t => <option key={t.id} value={t.id}>{t.name} ({t.vocabCount} từ)</option>)}
                  </select>
                </div>
              </div>

              {/* Lọc Yêu thích */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Bộ sưu tập</h3>
                <button onClick={() => onShowFavoritesChange(!showFavorites)} className={`w-full sm:w-auto py-3 px-6 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 border ${showFavorites ? 'bg-red-50 border-red-200 text-[#A82B2B] shadow-sm' : 'bg-white border-transparent text-gray-600 hover:border-gray-200 shadow-sm'}`}>
                  <Heart className="w-5 h-5" fill={showFavorites ? "#A82B2B" : "none"} color={showFavorites ? "#A82B2B" : "currentColor"} /> Từ vựng Yêu thích
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-200/60 bg-white flex justify-end gap-3">
              <button onClick={() => { onHskFilterChange(''); onTopicFilterChange(''); onShowFavoritesChange(false); }} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Đặt lại</button>
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#A82B2B] text-white hover:bg-[#8b2323] shadow-md transition-colors">Ok</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
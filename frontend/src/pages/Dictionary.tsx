import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Volume2, DatabaseBackup } from 'lucide-react';
import axiosClient from '../shared/lib/axiosClient';
import type { Vocabulary } from '../shared/types/vocabulary.types';
import { useTextToSpeech } from '../shared/hooks/useTextToSpeech';
import Pagination from '../components/Pagination';
import SearchFilterBar from '../components/SearchFilterBar';

export default function Dictionary() {
  const navigate = useNavigate();
  const { playAudio } = useTextToSpeech();
  
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [hskFilter, setHskFilter] = useState(''); 
  const [topicFilter, setTopicFilter] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [topicRes, favRes] = await Promise.all([
          axiosClient.get('/topics'),
          axiosClient.get('/favorites/ids').catch(() => ({ data: { data: [] } }))
        ]);
        if (topicRes.data.success) setTopics(topicRes.data.data);
        if (favRes.data?.data) setFavoriteIds(new Set(favRes.data.data));
      } catch (error) {
        console.error('Lỗi tải dữ liệu khởi tạo:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchVocabularies = async () => {
      if (showFavorites && favoriteIds.size === 0) {
        setWords([]);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const params: Record<string, any> = { page: currentPage, limit: 25 };
        
        if (searchTerm.trim() !== '') params.keyword = searchTerm.trim();
        if (hskFilter !== '') params.hskLevel = hskFilter;
        if (topicFilter !== '') params.topicId = topicFilter;
        
        if (showFavorites && favoriteIds.size > 0) {
          params.ids = Array.from(favoriteIds).join(',');
        }

        const response = await axiosClient.get(`/vocabularies`, { params });
        
        if (response.data.success) {
          const items = response.data.data || response.data.vocabularies || [];
          const formattedWords: Vocabulary[] = items.map((item: any) => ({
            id: item.id,
            simplified: item.simplified,
            pinyin: item.pinyin,
            meaning: item.meanings?.find((m: any) => m.languageCode === 'vi')?.meaning 
                  || item.meanings?.[0]?.meaning || item.meaning || 'Chưa cập nhật',
            hskLevel: item.hskLevel,
          }));
          setWords(formattedWords);
          if (response.data.pagination) setTotalPages(response.data.pagination.totalPages || 1);
        }
      } catch (error: any) {
        setWords([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => fetchVocabularies(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm, hskFilter, topicFilter, showFavorites, favoriteIds]);

  const toggleFavorite = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      await axiosClient.post('/favorites/toggle', { vocabularyId: id });
    } catch (error: any) {
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      alert("Vui lòng đăng nhập để lưu từ vựng!");
    }
  };

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
            {words.map((word) => {
              const isFav = favoriteIds.has(word.id);
              return (
                <div key={word.id} onClick={() => navigate(`/word/${word.id}`, { state: { from: 'dictionary' } })} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.08)] transition-all cursor-pointer border border-gray-100 h-full">
                  <div className="flex justify-between items-start w-full mb-3">
                    <button onClick={(e) => toggleFavorite(e, word.id)} className="text-gray-300 hover:text-[#A82B2B] transition-colors">
                      <Heart className="w-5 h-5" fill={isFav ? "#A82B2B" : "none"} color={isFav ? "#A82B2B" : "currentColor"} />
                    </button>
                    <span className="bg-[#F3F4F6] text-gray-600 text-[10px] font-bold px-2 py-1 rounded">HSK {word.hskLevel}</span>
                  </div>
                  <h2 className={`${word.simplified.length > 2 ? 'text-4xl' : 'text-6xl'} font-medium text-[#1A1A1A] leading-none mb-3`}>
                    {word.simplified}
                  </h2>
                  <p className="text-sm font-medium text-[#A82B2B] mb-2">{word.pinyin}</p>
                  <p className="text-xs text-gray-700 px-1 line-clamp-2 leading-relaxed min-h-[32px]">{word.meaning}</p>
                  <div className="mt-auto pt-4 w-full flex justify-center">
                    <button onClick={(e) => { e.stopPropagation(); playAudio(e, word.simplified); }} className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        )}
      </div>
    </div>
  );
}
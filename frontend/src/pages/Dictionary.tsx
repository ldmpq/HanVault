import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Volume2, ChevronLeft, ChevronRight, DatabaseBackup, ChevronDown } from 'lucide-react';
import axiosClient from '../shared/lib/axiosClient';
import type { Vocabulary } from '../shared/types/vocabulary.types';
import { generatePagination } from '../shared/utils/pagination.utils';
import { useTextToSpeech } from '../shared/hooks/useTextToSpeech';

export default function Dictionary() {
  const navigate = useNavigate();
  const { playAudio } = useTextToSpeech();
  
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hskFilter, setHskFilter] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchVocabularies = async () => {
      try {
        setIsLoading(true);
        const params: Record<string, any> = { page: currentPage, limit: 25 };
        if (searchTerm.trim() !== '') params.keyword = searchTerm.trim();
        if (hskFilter !== '') params.hskLevel = hskFilter;

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
            isFavorite: false,
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
  }, [currentPage, searchTerm, hskFilter]);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setWords(prev => prev.map(w => w.id === id ? { ...w, isFavorite: !w.isFavorite } : w));
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] font-sans pb-24 animate-fade-in">
      <div className="max-w-[800px] mx-auto pt-16 pb-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Tra cứu từ vựng</h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">Tra cứu từ vựng tiếng Trung, tìm kiếm theo chữ Hán, pinyin hoặc nghĩa. Bạn cũng có thể lọc theo HSK Level để học tập hiệu quả hơn.</p>

        <div className="relative max-w-2xl mx-auto w-full mb-6">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Tìm kiếm từ vựng (Hán tự, Pinyin, Nghĩa)..." 
            className="w-full pl-6 pr-16 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:border-red-200 focus:ring-4 focus:ring-red-50 transition-all text-gray-700 bg-white" 
          />
          <button className="absolute right-2 top-2 bottom-2 aspect-square bg-[#A82B2B] hover:bg-[#8b2323] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"><Search className="w-5 h-5" /></button>
        </div>

        {/* Khôi phục đầy đủ các nút Filter UI */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <div className="relative">
             <select value={hskFilter} onChange={(e) => { setHskFilter(e.target.value); setCurrentPage(1); }} className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-5 pr-10 rounded-full text-sm font-medium focus:outline-none focus:border-red-200 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
                <option value="">Tất cả các cấp HSK</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => <option key={level} value={level}>HSK {level}</option>)}
             </select>
             <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 py-2.5 px-5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">Chủ đề <ChevronDown className="w-4 h-4 text-gray-500" /></button>
          <button className="bg-white border border-gray-200 text-gray-700 py-2.5 px-5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">Độ khó <ChevronDown className="w-4 h-4 text-gray-500" /></button>
          <button className="bg-white border border-gray-200 text-gray-700 py-2.5 px-5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors"><Heart className="w-4 h-4 text-gray-500" /> Yêu thích</button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Đang tải dữ liệu...</div>
        ) : words.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"><DatabaseBackup className="w-16 h-16 text-gray-300 mb-4" /><h3 className="text-xl font-bold text-gray-900 mb-2">Thư viện trống</h3></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {words.map((word) => (
              <div key={word.id} onClick={() => navigate(`/word/${word.id}`, { state: { from: 'dictionary' } })} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.08)] transition-all cursor-pointer border border-gray-100 h-full">
                <div className="flex justify-between items-start w-full mb-3">
                  <button onClick={(e) => toggleFavorite(e, word.id)} className="text-gray-300 hover:text-[#A82B2B] transition-colors"><Heart className="w-5 h-5" fill={word.isFavorite ? "#A82B2B" : "none"} color={word.isFavorite ? "#A82B2B" : "currentColor"} /></button>
                  <span className="bg-[#F3F4F6] text-gray-600 text-[10px] font-bold px-2 py-1 rounded">HSK {word.hskLevel}</span>
                </div>
                <h2 className="text-6xl font-medium text-[#1A1A1A] leading-none mb-3">{word.simplified}</h2>
                <p className="text-sm font-medium text-[#A82B2B] mb-2">{word.pinyin}</p>
                <p className="text-xs text-gray-700 px-1 line-clamp-2 leading-relaxed min-h-[32px]">{word.meaning}</p>
                <div className="mt-auto pt-4 w-full flex justify-center">
                  <button onClick={(e) => playAudio(e, word.simplified)} className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors"><Volume2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#A82B2B] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            {generatePagination(currentPage, totalPages).map((page, index) => (
              page === '...' ? <span key={`ellipsis-${index}`} className="w-8 h-10 flex items-end justify-center pb-2 text-gray-500 tracking-widest font-medium">...</span> : 
              <button key={page} onClick={() => setCurrentPage(page as number)} className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${currentPage === page ? 'bg-[#A82B2B] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#A82B2B] disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { X, Check, BookmarkPlus, Search, Bookmark, Loader2 } from 'lucide-react';
import axiosClient from '../shared/lib/axiosClient';
import type { Deck } from '../shared/types/deck.types';

interface AddToDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordId?: number | string; 
  wordCharacter: string;
}

export default function AddToDeckModal({ isOpen, onClose, wordId, wordCharacter }: AddToDeckModalProps) {
  const { id: routeId } = useParams(); // Lấy ID trực tiếp từ URL 
  
  const [userDecks, setUserDecks] = useState<Deck[]>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(false);
  const [isAddingToDeck, setIsAddingToDeck] = useState(false);
  
  // Các state mới cho UI
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPersonalDecks();
      // Reset state mỗi khi mở modal
      setSearchQuery('');
      setSelectedDeckId(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const fetchPersonalDecks = async () => {
    setIsLoadingDecks(true);
    try {
      const response = await axiosClient.get('/library/decks');
      if (response.data.success) {
        const personalDecks = response.data.data.filter((d: any) => {
           const title = (d.title || d.name || '').toLowerCase();
           return !d.level || title.includes('yêu thích');
        });
        setUserDecks(personalDecks);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách thẻ cá nhân:', error);
    } finally {
      setIsLoadingDecks(false);
    }
  };

  // Lọc bộ thẻ theo thanh tìm kiếm
  const filteredDecks = useMemo(() => {
    if (!searchQuery.trim()) return userDecks;
    return userDecks.filter(deck => {
      const title = deck.title || (deck as any).name || '';
      return title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, userDecks]);

  const handleSubmit = async () => {
    if (!selectedDeckId) return;
    
    setIsAddingToDeck(true);
    try {
      // Ép kiểu chuẩn xác ID thành số nguyên để vượt qua Zod validation
      const finalWordId = Number(routeId || wordId);
      
      if (isNaN(finalWordId)) {
         alert('Lỗi: Không xác định được ID của từ vựng này!');
         setIsAddingToDeck(false);
         return;
      }

      const payload = { vocabularyIds: [finalWordId] };
      const config = { headers: { 'Content-Type': 'application/json' } };

      await axiosClient.post(`/decks/${selectedDeckId}/items`, payload, config);
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error: any) {
      console.error("🔥 Lỗi API thêm từ:", error.response?.data);
      const backendError = error.response?.data?.errors?.[0]?.message 
                        || error.response?.data?.message 
                        || 'Không thể thêm từ vựng vào bộ thẻ.';
      alert(`Lỗi: ${backendError}`);
    } finally {
      setIsAddingToDeck(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-[420px] p-8 shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Nút Đóng (Góc trên phải) */}
        {!isSuccess && (
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thành công!</h3>
            <p className="text-gray-500">Đã lưu "{wordCharacter}" vào bộ thẻ.</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-50/80 text-[#A82B2B] rounded-full flex items-center justify-center mb-5 shadow-sm">
                <BookmarkPlus className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Thêm vào bộ thẻ</h2>
              <p className="text-gray-500 text-sm">Lưu giữ từ vựng để ôn tập sau này</p>
            </div>
            
            {/* SEARCH BAR */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
              <input 
                type="text"
                placeholder="Search your decks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm placeholder-gray-300 focus:outline-none focus:border-[#A82B2B]/30 focus:ring-4 focus:ring-red-50 transition-all text-gray-700 font-medium"
              />
            </div>

            {/* DANH SÁCH BỘ THẺ */}
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 min-h-[200px] pr-1">
              {isLoadingDecks ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
                </div>
              ) : filteredDecks.length > 0 ? (
                filteredDecks.map(deck => {
                  const isSelected = selectedDeckId === deck.id;
                  const title = deck.title || (deck as any).name || 'Untitled Deck';
                  
                  return (
                    <button
                      key={deck.id}
                      onClick={() => setSelectedDeckId(deck.id)}
                      className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 group ${
                        isSelected 
                          ? 'border border-red-200 bg-red-50/30' 
                          : 'border border-transparent bg-[#FCFAF8] hover:bg-gray-100'
                      }`}
                    >
                      {/* Icon Container */}
                      <div className="w-12 h-12 bg-white rounded-[14px] shadow-sm flex items-center justify-center text-xl shrink-0 border border-gray-50">
                        {deck.icon || '📘'}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 truncate">
                        <h4 className="font-bold text-gray-900 truncate mb-0.5 text-[15px]">{title}</h4>
                        <p className="text-xs text-gray-500 font-medium">{deck.words || 0} items</p>
                      </div>

                      {/* Radio / Check icon */}
                      <div className="shrink-0 ml-2">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#A82B2B] flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-white group-hover:border-gray-300 transition-colors"></div>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-sm mb-3">Không tìm thấy bộ thẻ nào.</p>
                </div>
              )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex items-center justify-between gap-4 mt-6 pt-2">
              <button 
                onClick={onClose} 
                className="flex-1 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!selectedDeckId || isAddingToDeck}
                className="flex-[2] flex items-center justify-center gap-2 bg-[#A82B2B] hover:bg-[#8b2323] text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isAddingToDeck ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 fill-current" />
                    Thêm vào bộ thẻ
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
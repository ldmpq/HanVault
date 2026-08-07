import { X, Check, BookmarkPlus, Search, Bookmark, Loader2 } from 'lucide-react';
import { useAddToDeckModal } from '../hooks/useAddToDeckModal';

interface AddToDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordId?: number | string; 
  wordCharacter: string;
}

export default function AddToDeckModal({ isOpen, onClose, wordId, wordCharacter }: AddToDeckModalProps) {
  const {
    filteredDecks, isLoadingDecks, isAddingToDeck, isSuccess,
    searchQuery, setSearchQuery, selectedDeckId, setSelectedDeckId, handleSubmit
  } = useAddToDeckModal(isOpen, onClose, wordId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-[420px] p-8 shadow-2xl relative flex flex-col max-h-[90vh]">
        {!isSuccess && (
          <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thành công!</h3>
            <p className="text-sm text-gray-500">
              Đã lưu <strong className="font-bold text-gray-800">"{wordCharacter}"</strong> vào bộ thẻ.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-50/80 text-[#A82B2B] rounded-full flex items-center justify-center mb-5 shadow-sm">
                <BookmarkPlus className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Thêm vào bộ thẻ</h2>
              <p className="text-gray-500 text-sm">Lưu giữ từ vựng để ôn tập sau này</p>
            </div>
            
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

            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 min-h-[200px] pr-1">
              {isLoadingDecks ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-gray-300 animate-spin" /></div>
              ) : filteredDecks.length > 0 ? (
                filteredDecks.map(deck => {
                  const isSelected = selectedDeckId === deck.id;
                  const title = deck.title || (deck as any).name || 'Untitled Deck';
                  return (
                    <button
                      key={deck.id}
                      onClick={() => setSelectedDeckId(deck.id)}
                      className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 group ${isSelected ? 'border border-red-200 bg-red-50/30' : 'border border-transparent bg-[#FCFAF8] hover:bg-gray-100'}`}
                    >
                      <div className="w-12 h-12 bg-white rounded-[14px] shadow-sm flex items-center justify-center text-xl shrink-0 border border-gray-50">{deck.icon || '📘'}</div>
                      <div className="flex-1 truncate">
                        <h4 className="font-bold text-gray-900 truncate mb-0.5 text-[15px]">{title}</h4>
                        <p className="text-xs text-gray-500 font-medium">{deck.words || 0} items</p>
                      </div>
                      <div className="shrink-0 ml-2">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#A82B2B] flex items-center justify-center shadow-sm"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /></div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-white group-hover:border-gray-300 transition-colors"></div>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-10"><p className="text-gray-400 text-sm mb-3">Không tìm thấy bộ thẻ nào.</p></div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 mt-6 pt-2">
              <button onClick={onClose} className="flex-1 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">Hủy</button>
              <button 
                onClick={handleSubmit} disabled={!selectedDeckId || isAddingToDeck}
                className="flex-[2] flex items-center justify-center gap-2 bg-[#A82B2B] hover:bg-[#8b2323] text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isAddingToDeck ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Bookmark className="w-4 h-4 fill-current" /> Thêm vào bộ thẻ</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
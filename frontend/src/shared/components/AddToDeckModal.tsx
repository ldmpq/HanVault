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
    searchQuery, setSearchQuery, selectedDeckIds, toggleDeckSelection, handleSubmit
  } = useAddToDeckModal(isOpen, onClose, wordId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-line rounded-[2rem] w-full max-w-[420px] p-8 shadow-2xl relative flex flex-col max-h-[90vh]">
        {!isSuccess && (
          <button onClick={onClose} className="absolute top-5 right-5 text-sub hover:text-main transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-emerald-500" strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-main mb-2">Thành công!</h3>
            <p className="text-sm text-sub">
              Đã lưu <strong className="font-bold text-main">"{wordCharacter}"</strong> vào {selectedDeckIds.length} bộ thẻ.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-5 shadow-sm border border-brand/20">
                <BookmarkPlus className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-main mb-1.5">Thêm vào bộ thẻ</h2>
              <p className="text-sub text-sm">Lưu giữ từ vựng để ôn tập sau này</p>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sub pointer-events-none" />
              <input 
                type="text"
                placeholder="Tìm bộ thẻ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-app border border-line rounded-2xl text-sm text-main placeholder-sub focus:outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/10 transition-all font-medium"
              />
            </div>

            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 min-h-[200px] pr-1">
              {isLoadingDecks ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-sub animate-spin" /></div>
              ) : filteredDecks.length > 0 ? (
                filteredDecks.map(deck => {
                  const isSelected = selectedDeckIds.includes(deck.id);
                  const title = deck.title || (deck as any).name || 'Untitled Deck';
                  return (
                    <button
                      key={deck.id}
                      onClick={() => toggleDeckSelection(deck.id)}
                      className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 group ${isSelected ? 'border border-brand/30 bg-brand/10' : 'border border-transparent bg-app hover:bg-line/50'}`}
                    >
                      <div className="w-12 h-12 bg-surface rounded-[14px] shadow-sm flex items-center justify-center text-xl shrink-0 border border-line">{deck.icon || '📘'}</div>
                      <div className="flex-1 truncate">
                        <h4 className="font-bold text-main truncate mb-0.5 text-[15px]">{title}</h4>
                        <p className="text-xs text-sub font-medium">{deck.words || 0} items</p>
                      </div>
                      <div className="shrink-0 ml-2">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-md bg-brand flex items-center justify-center shadow-sm"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /></div>
                        ) : (
                          <div className="w-6 h-6 rounded-md border-2 border-line bg-surface group-hover:border-sub transition-colors"></div>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-10"><p className="text-sub text-sm mb-3">Không tìm thấy bộ thẻ nào.</p></div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 mt-6 pt-2">
              <button onClick={onClose} className="flex-1 py-3.5 text-sm font-bold text-sub hover:text-main transition-colors">Hủy</button>
              <button 
                onClick={handleSubmit} 
                disabled={selectedDeckIds.length === 0 || isAddingToDeck}
                className="flex-[2] flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isAddingToDeck ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Bookmark className="w-4 h-4 fill-current" /> Thêm {selectedDeckIds.length > 0 ? `(${selectedDeckIds.length})` : ''}</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
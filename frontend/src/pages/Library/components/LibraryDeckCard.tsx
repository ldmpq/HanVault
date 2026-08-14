import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Deck } from '../../../shared/types/deck.types';

interface LibraryDeckCardProps {
  deck: Deck | any;
  activeMenuId?: number | null;
  setActiveMenuId?: (id: number | null) => void;
  setTargetDeck?: (deck: any) => void;
  setIsDeckModalOpen?: (isOpen: boolean) => void;
  handleDeleteDeck?: (id: number) => void;
  customOnClick?: () => void;
}

export default function LibraryDeckCard({
  deck,
  activeMenuId = null,
  setActiveMenuId,
  setTargetDeck,
  setIsDeckModalOpen,
  handleDeleteDeck,
  customOnClick
}: LibraryDeckCardProps) {
  const navigate = useNavigate();

  const progress = deck.progress || 0;
  const hasStarted = progress > 0;
  const isCompleted = progress >= 100;

  const handleCardClick = () => {
    if (customOnClick) {
      customOnClick();
    } else {
      navigate(`/deck/${deck.id}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-surface rounded-[2rem] p-6 shadow-sm border border-line hover:border-brand/30 hover:shadow-md transition-all cursor-pointer flex flex-col min-h-[260px] relative group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-10 h-10 ${deck.bgColor} ${deck.iconColor} rounded-xl flex items-center justify-center border border-current/10`}>
          <span className="font-bold text-lg leading-none">{deck.icon}</span>
        </div>

        {deck.tag === 'Tự tạo' ? (
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveMenuId?.(activeMenuId === deck.id ? null : deck.id); }}
              className="p-1 text-sub hover:text-main bg-line/50 hover:bg-line rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {activeMenuId === deck.id && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-surface rounded-xl shadow-xl border border-line overflow-hidden z-20 animate-fade-in py-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setTargetDeck?.(deck); setIsDeckModalOpen?.(true); setActiveMenuId?.(null); }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-main hover:bg-line/50 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Chỉnh sửa
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteDeck?.(deck.id); setActiveMenuId?.(null); }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Xóa bộ thẻ
                </button>
              </div>
            )}
          </div>
        ) : (
          <span className="bg-line/50 text-sub text-[10px] font-bold px-2 py-1 rounded-full border border-line">{deck.tag}</span>
        )}
      </div>

      <h3 className="text-lg font-bold text-main mb-1 line-clamp-1">{deck.title || (deck as any).name}</h3>
      <p className="text-xs text-sub mb-6 flex-1 leading-relaxed line-clamp-2">
        {deck.description || 'Bộ từ vựng cơ bản để bắt đầu hành trình học tập.'}
      </p>
      
      <div className="flex items-center gap-1.5 text-xs font-bold text-sub mb-3">
        <span className="text-sm font-bold text-brand leading-none">字</span>{deck.words} từ
      </div>

      {/* Hiển thị UI dựa theo Progress tự động */}
      <div className={`w-full h-1.5 rounded-full overflow-hidden mb-4 ${hasStarted ? 'bg-line' : 'bg-transparent'}`}>
        {hasStarted && (
          <div 
            className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-brand'}`} 
            style={{ width: `${progress}%` }}
          ></div>
        )}
      </div>

      {isCompleted ? (
        <button className="w-full py-2.5 rounded-xl border border-emerald-500 text-emerald-500 font-bold text-xs group-hover:bg-emerald-500/10 transition-colors">
          Ôn tập lại
        </button>
      ) : hasStarted ? (
        <button className="w-full py-2.5 rounded-xl border border-brand text-brand font-bold text-xs group-hover:bg-brand/10 transition-colors">
          Tiếp tục
        </button>
      ) : (
        <button className="w-full py-2.5 rounded-xl bg-line/50 text-sub font-bold text-xs group-hover:text-main group-hover:bg-line transition-colors">
          Bắt đầu
        </button>
      )}
    </div>
  );
}
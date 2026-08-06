import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Deck } from '../shared/types/deck.types';

interface LibraryDeckCardProps {
  deck: Deck;
  activeMenuId: number | null;
  setActiveMenuId: (id: number | null) => void;
  setTargetDeck: (deck: any) => void;
  setIsDeckModalOpen: (isOpen: boolean) => void;
  handleDeleteDeck: (id: number) => void;
}

export default function LibraryDeckCard({
  deck,
  activeMenuId,
  setActiveMenuId,
  setTargetDeck,
  setIsDeckModalOpen,
  handleDeleteDeck
}: LibraryDeckCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/deck/${deck.id}`)} 
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col min-h-[260px] relative"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-10 h-10 ${deck.bgColor} ${deck.iconColor} rounded-xl flex items-center justify-center border border-current/10`}>
          <span className="font-bold text-lg leading-none">{deck.icon}</span>
        </div>

        {deck.tag === 'Tự tạo' ? (
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === deck.id ? null : deck.id); }}
              className="p-1 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {activeMenuId === deck.id && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-fade-in py-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setTargetDeck(deck); setIsDeckModalOpen(true); setActiveMenuId(null); }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Chỉnh sửa
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteDeck(deck.id); setActiveMenuId(null); }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Xóa bộ thẻ
                </button>
              </div>
            )}
          </div>
        ) : (
          <span className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full border border-gray-100">{deck.tag}</span>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{deck.title || (deck as any).name}</h3>
      <p className="text-xs text-gray-500 mb-6 flex-1 leading-relaxed line-clamp-2">
        {deck.description || 'Bộ từ vựng cơ bản để bắt đầu hành trình học tập.'}
      </p>
      
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-3">
        <span className="text-sm font-bold text-[#A82B2B] leading-none">字</span>{deck.words} từ
      </div>

      {deck.progress > 0 ? (
        <>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#A82B2B] rounded-full" style={{ width: `${deck.progress}%` }}></div>
          </div>
          <button className="w-full py-2.5 rounded-xl border border-[#A82B2B] text-[#A82B2B] font-bold text-xs hover:bg-red-50 transition-colors">Tiếp tục</button>
        </>
      ) : (
        <>
          <div className="w-full h-1.5 bg-transparent mb-4"></div>
          <button className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-500 font-bold text-xs hover:bg-gray-100 transition-colors">Bắt đầu</button>
        </>
      )}
    </div>
  );
}
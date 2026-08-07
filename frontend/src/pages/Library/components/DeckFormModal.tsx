import { useState, useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import axiosClient from '../../../shared/lib/axiosClient';

interface DeckFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  deck?: {
    id?: number;
    title?: string;
    name?: string;
    description?: string;
    icon?: string;
    hskLevel?: number | null;
  } | null;
}

const HSK_LEVELS = [
  { label: 'Any', value: null },
  { label: 'HSK 1', value: 1 },
  { label: 'HSK 2', value: 2 },
  { label: 'HSK 3', value: 3 },
  { label: 'HSK 4', value: 4 },
  { label: 'HSK 5', value: 5 },
  { label: 'HSK 6', value: 6 },
];

export default function DeckFormModal({ isOpen, onClose, onSuccess, deck }: DeckFormModalProps) {
  const isEditing = !!deck;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📚');
  const [hskLevel, setHskLevel] = useState<number | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (deck) {
      setTitle(deck.title || deck.name || '');
      setDescription(deck.description || '');
      setIcon(deck.icon || '📚');
      setHskLevel(deck.hskLevel ?? null);
    } else {
      setTitle('');
      setDescription('');
      setIcon('📚');
      setHskLevel(null);
    }
  }, [deck, isOpen]);

  // Đóng picker khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowIconPicker(false);
      }
    };
    if (showIconPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showIconPicker]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: title,
        description,
        icon,
        hskLevel: hskLevel !== null ? Number(hskLevel) : undefined,
      };
      if (isEditing && deck?.id) {
        await axiosClient.put(`/decks/${deck.id}`, payload);
      } else {
        await axiosClient.post('/decks', payload);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Lỗi chi tiết từ Server:', error.response?.data);
      if (error.response?.data?.errors) {
        console.table(error.response.data.errors);
      }
      alert(`Lỗi: ${error.response?.data?.message || 'Không thể lưu bộ thẻ'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setIcon(emojiData.emoji);
    setShowIconPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
      
      {/* Overlay tối nhẹ + Blur */}
      <div 
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[560px] bg-white rounded-[24px] shadow-[0_20px_50px_rgb(0,0,0,0.12)] border border-[#ECE7E3] p-8 md:p-10 z-10 overflow-visible max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-[#ECE7E3] shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#A82B2B] flex items-center justify-center shrink-0 border border-red-100/60 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {isEditing ? 'Edit Deck' : 'Create New Deck'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Create a personalized vocabulary collection for your learning journey.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-1 custom-scrollbar flex-1">
          
          {/* 1. DECK ICON */}
          <div className="relative" ref={pickerRef}>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Deck Icon
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="w-16 h-16 rounded-2xl bg-[#FCFAF8] border-2 border-[#ECE7E3] hover:border-[#A82B2B] flex items-center justify-center text-3xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  {icon}
                </button>
                
                {/* Tích hợp emoji-picker-react chuẩn xác */}
                {showIconPicker && (
                  <div className="absolute top-20 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-[#ECE7E3] animate-fade-in">
                    <EmojiPicker 
                      onEmojiClick={handleEmojiClick}
                      theme={Theme.LIGHT}
                      width={320}
                      height={380}
                      searchPlaceholder="Search emoji..."
                    />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Choose an icon</p>
                <p className="text-xs text-gray-500">Click to select an icon representation for your deck.</p>
              </div>
            </div>
          </div>

          {/* 2. DECK NAME */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Deck Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Business Chinese"
              className="w-full bg-[#FCFAF8] border border-[#ECE7E3] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#A82B2B] focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 text-sm font-medium shadow-sm"
              required
            />
            <p className="text-[11px] text-gray-400 mt-1.5 ml-1">This name will be displayed in your library.</p>
          </div>

          {/* 3. DESCRIPTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Description
              </label>
              <span className="text-[11px] font-medium text-gray-400">
                {200 - description.length} chars left
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this deck is about..."
              rows={3}
              maxLength={200}
              className="w-full bg-[#FCFAF8] border border-[#ECE7E3] rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#A82B2B] focus:bg-white transition-all placeholder:text-gray-400 text-gray-800 text-sm font-medium shadow-sm resize-none"
            />
          </div>

          {/* 4. HSK LEVEL (OPTIONAL) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              HSK Level (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-3">Useful if this deck follows a specific HSK curriculum.</p>
            
            <div className="flex flex-wrap gap-2">
              {HSK_LEVELS.map((item) => {
                const isSelected = hskLevel === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setHskLevel(item.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected 
                        ? 'bg-[#A82B2B] text-white border-[#A82B2B] shadow-sm shadow-red-900/10' 
                        : 'bg-[#FCFAF8] text-gray-600 border-[#ECE7E3] hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECE7E3] mt-8 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-[#ECE7E3] text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-[#A82B2B] hover:bg-[#8b2323] text-white font-bold text-sm transition-all shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Deck')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
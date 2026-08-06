import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../lib/axiosClient';
import type { Deck } from '../types/deck.types';
import { getUIConfigForLevel } from '../utils/hsk.utils';

export const TABS = ['All Levels', 'HSK 1-2', 'HSK 3-4', 'HSK 5-6', 'HSK 7-8-9', 'Topics', 'My list'] as const;

export const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
  "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80",
  "https://images.unsplash.com/photo-1527685651268-b7a4be46797a?w=800&q=80",
  "https://images.unsplash.com/photo-1510006903531-1558bf0c64c7?w=800&q=80",
  "https://images.unsplash.com/photo-1499955085172-a104c9463ece?w=800&q=80"
];

export const DAILY_IMAGES = [
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80"
];

// Hàm filter tách biệt để dễ test
function filterDecksByTab(decks: Deck[], tab: string): Deck[] {
  const level = (deck: Deck) => Number(deck.level);
  const isFavoriteDeck = (deck: Deck) => deck.tag === 'Cá nhân' || deck.tag === 'Tự tạo';
  
  switch (tab) {
    case 'HSK 1-2': return decks.filter((d) => !isFavoriteDeck(d) && [1, 2].includes(level(d)));
    case 'HSK 3-4': return decks.filter((d) => !isFavoriteDeck(d) && [3, 4].includes(level(d)));
    case 'HSK 5-6': return decks.filter((d) => !isFavoriteDeck(d) && [5, 6].includes(level(d)));
    case 'HSK 7-8-9': return decks.filter((d) => !isFavoriteDeck(d) && [7, 8, 9].includes(level(d)));
    case 'My list': return decks.filter((d) => d.progress > 0 || isFavoriteDeck(d));
    case 'Topics': return decks.filter((d) => !isFavoriteDeck(d) && !d.level);
    default: return decks;
  }
}

export const useLibrary = () => {
  const [activeTab, setActiveTab] = useState<string>('All Levels');
  const [hskDecks, setHskDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [targetDeck, setTargetDeck] = useState<any>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDecks = async () => {
    try {
      const response = await axiosClient.get('/library/decks');
      if (response.data.success) {
        const formattedDecks = response.data.data.map((dbDeck: any) => {
          const title = dbDeck.title || dbDeck.name || '';
          if (title.toLowerCase().includes('yêu thích')) {
            return { ...dbDeck, level: null, tag: 'Cá nhân', bgColor: 'bg-pink-50', iconColor: 'text-[#A82B2B]', icon: '❤️' };
          }
          if (!dbDeck.level && !dbDeck.isSystem) {
             return { ...dbDeck, level: null, tag: 'Tự tạo', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', icon: dbDeck.icon || '📘' };
          }
          return { ...dbDeck, ...getUIConfigForLevel(dbDeck.level) };
        });
        setHskDecks(formattedDecks);
      }
    } catch (error) {
      console.error('Lỗi khi tải thư viện:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleDeleteDeck = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bộ thẻ này? Toàn bộ từ vựng bên trong sẽ bị gỡ bỏ.')) return;
    try {
      await axiosClient.delete(`/decks/${id}`);
      fetchDecks(); 
    } catch (error) {
      alert('Không thể xóa bộ thẻ. Vui lòng thử lại.');
    }
  };

  // Logic Lọc & Tìm kiếm
  const visibleDecks = useMemo(() => {
    let filtered = filterDecksByTab(hskDecks, activeTab);
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(deck => 
        (deck.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [hskDecks, activeTab, searchQuery]);

  const totalPages = Math.ceil(visibleDecks.length / ITEMS_PER_PAGE);

  const paginatedDecks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return visibleDecks.slice(start, start + ITEMS_PER_PAGE);
  }, [visibleDecks, currentPage]);

  // Logic Carousel
  const carouselDecks = useMemo(() => {
    const withLevel = hskDecks.filter(d => d.level && Number(d.level) > 0).slice(0, 5);
    return withLevel.length > 0 ? withLevel : hskDecks.slice(0, 5);
  }, [hskDecks]);

  useEffect(() => {
    if (carouselDecks.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % carouselDecks.length), 5000);
    return () => clearInterval(timer);
  }, [carouselDecks.length]);

  // Logic Thẻ gợi ý mỗi ngày (Hash Date)
  const dailyDeck = useMemo(() => {
    if (hskDecks.length === 0) return null;
    let topicalDecks = hskDecks.filter(d => !d.level);
    if (topicalDecks.length === 0) topicalDecks = hskDecks;
    
    const todayStr = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = todayStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return topicalDecks[Math.abs(hash) % topicalDecks.length];
  }, [hskDecks]);

  return {
    TABS, CAROUSEL_IMAGES, DAILY_IMAGES, ITEMS_PER_PAGE,
    activeTab, setActiveTab,
    isLoading, currentSlide, setCurrentSlide,
    searchQuery, setSearchQuery,
    isDeckModalOpen, setIsDeckModalOpen,
    targetDeck, setTargetDeck,
    activeMenuId, setActiveMenuId,
    currentPage, setCurrentPage,
    visibleDecks, totalPages, paginatedDecks,
    carouselDecks, dailyDeck,
    fetchDecks, handleDeleteDeck
  };
};
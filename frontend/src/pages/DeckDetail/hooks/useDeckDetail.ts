import { useState, useEffect, useMemo, useCallback } from 'react';
import axiosClient from '../../../shared/lib/axiosClient';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';

const ITEMS_PER_PAGE = 20; 

export const useDeckDetail = (deckId: string | undefined) => {
  const [deckInfo, setDeckInfo] = useState<any>(null);
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRemoveWord = useCallback(async (vocabId: number) => {
    if (!deckId) return;
    
    // Optimistic UI update
    setWords(prev => prev.filter(w => w.id !== vocabId));
    
    try {
      await axiosClient.delete(`/decks/${deckId}/items/${vocabId}`);
    } catch (error) {
      console.error('Lỗi khi xóa từ:', error);
      alert('Không thể xóa từ vựng lúc này!');
    }
  }, [deckId]);

  // Tính toán Phân trang trực tiếp từ mảng words ban đầu
  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE);
  const displayedWords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return words.slice(start, start + ITEMS_PER_PAGE);
  }, [words, currentPage]);

  useEffect(() => {
    const fetchDeckDetails = async () => {
      if (!deckId) return;
      try {
        setIsLoading(true);
        const response = await axiosClient.get(`/library/decks/${deckId}`);
        if (response.data.success) {
          setDeckInfo(response.data.data.deck);
          setWords(response.data.data.words);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết bộ thẻ:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeckDetails();
  }, [deckId]);

  return {
    deckInfo,
    words,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    displayedWords,
    handleRemoveWord
  };
};
import { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '../lib/axiosClient';
import type { Vocabulary } from '../types/vocabulary.types';

export const useReviewSession = (deckId: string | undefined) => {
  const [session, setSession] = useState<{ sessionId: number; cards: Vocabulary[] } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const logsRef = useRef<any[]>([]);

  // 1. KHỞI TẠO PHIÊN HỌC
  useEffect(() => {
    if (!deckId) {
      setIsLoading(false);
      return;
    }
    const startStudy = async () => {
      try {
        setError(null);
        const response = await axiosClient.get(`/srs/decks/${deckId}/study`);
        if (response.data.success && response.data.data?.totalCards > 0) {
          setSession(response.data.data);
          logsRef.current = [];
        } else {
          setIsFinished(true);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi kết nối API.');
      } finally {
        setIsLoading(false);
      }
    };
    startStudy();
  }, [deckId]);

  // 2. XỬ LÝ ĐÁNH GIÁ THẺ
  const handleRate = useCallback(async (quality: number) => {
    if (!session || isFinished) return;
    
    const currentCard = session.cards[currentIndex];
    const isCorrect = quality >= 3;

    // A. Bắn API lưu thẻ đơn lẻ (không cần await để UI mượt hơn)
    try {
      axiosClient.post('/srs/review', { vocabularyId: currentCard.id, quality });
    } catch (error) {}

    // B. Lưu log cục bộ
    logsRef.current.push({ 
      vocabularyId: currentCard.id, 
      isCorrect, 
      responseQuality: quality, 
      responseTimeMs: 0 
    });
    
    setIsFlipped(false);

    // C. Chuyển thẻ hoặc Kết thúc
    setTimeout(async () => {
      if (currentIndex < session.cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);

        try {
          const correctWords = logsRef.current.filter(l => l.isCorrect).length;
          await axiosClient.post(`/srs/sessions/${session.sessionId}/end`, {
            totalWords: session.cards.length,
            correctWords,
            logs: logsRef.current
          });
        } catch (err) {
          console.error('Lỗi khi kết thúc phiên:', err);
        }
      }
    }, 200); // Đợi 200ms để hiệu ứng lật úp thẻ kịp diễn ra
  }, [session, currentIndex, isFinished]);

  // 3. LẮNG NGHE PHÍM TẮT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || !deckId || error) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
      if (isFlipped) {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(3);
        if (e.key === '3') handleRate(4);
        if (e.key === '4') handleRate(5);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isFinished, handleRate, deckId, error]);

  return { session, currentIndex, isFlipped, setIsFlipped, isFinished, isLoading, error, handleRate };
};
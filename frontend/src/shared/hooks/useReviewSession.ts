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
  const [isPaused, setIsPaused] = useState(false);
  
  const logsRef = useRef<any[]>([]);

  // 1. HÀM KHỞI TẠO TÍCH HỢP FALLBACK
  const startStudy = useCallback(async () => {
    if (!deckId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsPaused(false);
    setError(null);

    try {
      const response = await axiosClient.get(`/srs/decks/${deckId}/study`);

      if (response.data.success && response.data.data?.cards?.length > 0) {
        setSession(response.data.data);
        logsRef.current = [];
      } else {

        const fallbackResponse = await axiosClient.get(`/library/decks/${deckId}`);
        const fallbackWords = fallbackResponse.data.data?.words || fallbackResponse.data.data || [];
        
        if (fallbackWords.length > 0) {
          setSession({
            sessionId: -1,
            cards: fallbackWords
          });
          logsRef.current = [];
        } else {
          setIsFinished(true); // Bộ thẻ thực sự trống
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi kết nối API.');
    } finally {
      setIsLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    startStudy();
  }, [startStudy]);

  // 2. XỬ LÝ ĐÁNH GIÁ THẺ
  const handleRate = useCallback(async (quality: number) => {
    if (!session || isFinished || isPaused) return;
    
    const currentCard = session.cards[currentIndex];
    const isCorrect = quality >= 3;

    try {
      if (session.sessionId !== -1) {
        axiosClient.post('/srs/review', { vocabularyId: currentCard.id, quality });
      }
    } catch (error) {}

    logsRef.current.push({ 
      vocabularyId: currentCard.id, 
      isCorrect, 
      responseQuality: quality, 
      responseTimeMs: 0 
    });
    
    setIsFlipped(false);

    setTimeout(async () => {
      if (currentIndex < session.cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
        try {
          if (session.sessionId !== -1) {
            const correctWords = logsRef.current.filter(l => l.isCorrect).length;
            await axiosClient.post(`/srs/sessions/${session.sessionId}/end`, {
              totalWords: session.cards.length,
              correctWords,
              logs: logsRef.current
            });
          }
        } catch (err) {
          console.error('Lỗi khi kết thúc phiên:', err);
        }
      }
    }, 200); 
  }, [session, currentIndex, isFinished, isPaused]);

  // 3. LẮNG NGHE PHÍM TẮT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || !deckId || error) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }
      if (isPaused) return;

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
  }, [isFlipped, isFinished, handleRate, deckId, error, isPaused]);

  const restartSessionLocal = useCallback(() => {
    if (session && session.cards && session.cards.length > 0) {
      setIsFinished(false);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsPaused(false);
      setError(null);
      logsRef.current = []; 
    } else {
      startStudy();
    }
  }, [session, startStudy]);

  return { 
    session, currentIndex, isFlipped, setIsFlipped, 
    isFinished, isLoading, error, handleRate,
    restartSession: restartSessionLocal, 
    isPaused, setIsPaused 
  };
};
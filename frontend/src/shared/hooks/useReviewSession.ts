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

  const endStudySession = async (sessionId: number, totalCards: number, finalLogs: any[]) => {
    try {
      const correctWords = finalLogs.filter(l => l.isCorrect).length;
      await axiosClient.post(`/srs/sessions/${sessionId}/end`, {
        totalWords: totalCards,
        correctWords,
        logs: finalLogs
      });
      setIsFinished(true);
    } catch (error) {
      console.error('Lỗi khi kết thúc phiên:', error);
    }
  };

  const handleRate = useCallback(async (quality: number) => {
    if (!session || isFinished) return;
    
    const currentCard = session.cards[currentIndex];
    const isCorrect = quality >= 3;

    try {
      await axiosClient.post('/srs/review', { vocabularyId: currentCard.id, quality });
    } catch (error) {}

    logsRef.current.push({ vocabularyId: currentCard.id, isCorrect, responseQuality: quality, responseTimeMs: 0 });
    setIsFlipped(false);

    setTimeout(async () => {
      if (currentIndex < session.cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        await endStudySession(session.sessionId, session.cards.length, logsRef.current);
      }
    }, 200);
  }, [session, currentIndex, isFinished]);

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
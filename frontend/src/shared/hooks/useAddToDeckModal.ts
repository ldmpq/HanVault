import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../lib/axiosClient';
import type { Deck } from '../types/deck.types';

export function useAddToDeckModal(isOpen: boolean, onClose: () => void, wordId?: number | string) {
  const { id: routeId } = useParams();
  const [userDecks, setUserDecks] = useState<Deck[]>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(false);
  const [isAddingToDeck, setIsAddingToDeck] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeckIds, setSelectedDeckIds] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchPersonalDecks = async () => {
        setIsLoadingDecks(true);
        try {
          const response = await axiosClient.get('/library/decks');
          if (response.data.success) {
            const personalDecks = response.data.data.filter((d: any) => {
               const title = (d.title || d.name || '').toLowerCase();
               return !d.level || title.includes('yêu thích');
            });
            setUserDecks(personalDecks);
          }
        } catch (error) {
          console.error('Lỗi lấy danh sách thẻ:', error);
        } finally {
          setIsLoadingDecks(false);
        }
      };
      
      fetchPersonalDecks();
      setSearchQuery('');
      setSelectedDeckIds([]);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const filteredDecks = useMemo(() => {
    if (!searchQuery.trim()) return userDecks;
    return userDecks.filter(deck => {
      const title = deck.title || (deck as any).name || '';
      return title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, userDecks]);

  const toggleDeckSelection = (deckId: number) => {
    setSelectedDeckIds((prev) => 
      prev.includes(deckId)
        ? prev.filter(id => id !== deckId)
        : [...prev, deckId]
    )
  }

  const handleSubmit = async () => {
    if (!selectedDeckIds) return;
    
    setIsAddingToDeck(true);
    try {
      const finalWordId = Number(routeId || wordId);
      if (isNaN(finalWordId)) {
         alert('Lỗi: Không xác định được ID của từ vựng này!');
         setIsAddingToDeck(false);
         return;
      }

      const addPromises = selectedDeckIds.map(deckId => 
        axiosClient.post(`/decks/${deckId}/items`, { vocabularyIds: [finalWordId] })
      );
      
      await Promise.all(addPromises);
      setIsSuccess(true);
      setTimeout(() => onClose(), 1200);
    } catch (error: any) {
      const backendError = error.response?.data?.errors?.[0]?.message 
                        || error.response?.data?.message 
                        || 'Không thể thêm từ vựng vào bộ thẻ.';
      alert(`Lỗi: ${backendError}`);
    } finally {
      setIsAddingToDeck(false);
    }
  };

  return {
    filteredDecks, isLoadingDecks, isAddingToDeck, isSuccess,
    searchQuery, setSearchQuery, selectedDeckIds, setSelectedDeckIds, toggleDeckSelection, handleSubmit
  };
}
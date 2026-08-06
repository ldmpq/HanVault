import { useState, useEffect } from 'react';
import axiosClient from '../lib/axiosClient';
import type { Vocabulary } from '../types/vocabulary.types';

export const useWordDetail = (id: string | undefined) => {
  const [word, setWord] = useState<Vocabulary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStrokeChar, setActiveStrokeChar] = useState<string>('');

  useEffect(() => {
    const fetchWordDetail = async () => {
      try {
        const response = await axiosClient.get(`/vocabularies/${id}`);
        if (response.data.success) {
          setWord(response.data.data);
          if (response.data.data.character) {
            setActiveStrokeChar(response.data.data.character[0]);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết từ vựng:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchWordDetail();
  }, [id]);

  return { word, isLoading, activeStrokeChar, setActiveStrokeChar };
};
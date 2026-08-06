import { useState, useEffect } from 'react';
import axiosClient from '../lib/axiosClient';
import type { Vocabulary } from '../types/vocabulary.types';

export const useDictionary = () => {
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [hskFilter, setHskFilter] = useState(''); 
  const [topicFilter, setTopicFilter] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Tải danh sách chủ đề và từ vựng yêu thích khi vào trang
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [topicRes, favRes] = await Promise.all([
          axiosClient.get('/topics'),
          axiosClient.get(`/favorites/ids`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }).catch(() => ({ data: { data: [] } }))
        ]);
        if (topicRes.data.success) setTopics(topicRes.data.data);
        if (favRes.data?.data) {
          const numericIds = favRes.data.data.map((id: any) => Number(id));
          setFavoriteIds(new Set(numericIds));
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu khởi tạo:', error);
      } finally {
        setIsInitialLoaded(true);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Tìm kiếm từ vựng (Có debounce 300ms chống spam)
  useEffect(() => {
    if (!isInitialLoaded) return;

    const fetchVocabularies = async () => {
      if (showFavorites && favoriteIds.size === 0) {
        setWords([]);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const params: Record<string, any> = { page: currentPage, limit: 25 };
        
        if (searchTerm.trim() !== '') params.keyword = searchTerm.trim();
        if (hskFilter !== '') params.hskLevel = hskFilter;
        if (topicFilter !== '') params.topicId = topicFilter;
        
        if (showFavorites && favoriteIds.size > 0) {
          params.ids = Array.from(favoriteIds).join(',');
        }

        const response = await axiosClient.get(`/vocabularies`, { params });
        
        if (response.data.success) {
          const items = response.data.data || response.data.vocabularies || [];
          const formattedWords: Vocabulary[] = items.map((item: any) => ({
            id: Number(item.id),
            simplified: item.simplified,
            pinyin: item.pinyin,
            meaning: item.meanings?.find((m: any) => m.languageCode === 'vi')?.meaning 
                  || item.meanings?.[0]?.meaning || item.meaning || 'Chưa cập nhật',
            hskLevel: item.hskLevel,
          }));
          setWords(formattedWords);
          if (response.data.pagination) setTotalPages(response.data.pagination.totalPages || 1);
        }
      } catch (error: any) {
        setWords([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => fetchVocabularies(), 300);
    return () => clearTimeout(delayDebounceFn);

  }, [currentPage, searchTerm, hskFilter, topicFilter, showFavorites, isInitialLoaded, favoriteIds.size]);

  // 3. Logic thêm/xóa yêu thích (Optimistic Update - Cập nhật UI trước khi gọi API)
  const toggleFavorite = async (e: React.MouseEvent, rawId: number) => {
    e.stopPropagation();
    const numId = Number(rawId);
    
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(numId)) next.delete(numId);
      else next.add(numId);
      return next;
    });

    try {
      await axiosClient.post('/favorites/toggle', { vocabularyId: numId });
    } catch (error: any) {
      // Revert lại state nếu API lỗi
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (next.has(numId)) next.delete(numId);
        else next.add(numId);
        return next;
      });
      alert("Vui lòng đăng nhập để lưu từ vựng!");
    }
  };

  return {
    words, topics, favoriteIds, isLoading,
    searchTerm, setSearchTerm,
    hskFilter, setHskFilter,
    topicFilter, setTopicFilter,
    showFavorites, setShowFavorites,
    currentPage, setCurrentPage, totalPages,
    toggleFavorite
  };
};
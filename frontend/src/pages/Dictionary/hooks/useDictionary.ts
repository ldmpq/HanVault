import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../../../shared/lib/axiosClient';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';

export const useDictionary = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. STATE NỘI BỘ
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [hskFilter, setHskFilter] = useState(searchParams.get('hsk') || '');
  const [topicFilter, setTopicFilter] = useState(searchParams.get('topic') || '');
  const [showFavorites, setShowFavorites] = useState(searchParams.get('fav') === 'true');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  const [words, setWords] = useState<Vocabulary[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // 2. ĐỒNG BỘ TỪ URL VỀ STATE (Khi user ấn nút Back/Forward của trình duyệt)
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setHskFilter(searchParams.get('hsk') || '');
    setTopicFilter(searchParams.get('topic') || '');
    setShowFavorites(searchParams.get('fav') === 'true');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // 3. ĐỒNG BỘ TỪ STATE LÊN URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (hskFilter) params.set('hsk', hskFilter);
    if (topicFilter) params.set('topic', topicFilter);
    if (showFavorites) params.set('fav', 'true');
    if (currentPage > 1) params.set('page', String(currentPage));

    setSearchParams(params, { replace: true });
  }, [searchTerm, hskFilter, topicFilter, showFavorites, currentPage, setSearchParams]);

  // Ép kiểu mọi filter về Chuỗi (String) để khớp với URL
  const safeSetHskFilter = (val: any) => setHskFilter(val ? String(val) : '');
  const safeSetTopicFilter = (val: any) => setTopicFilter(val ? String(val) : '');

  // 4. API CALL - LẤY DỮ LIỆU KHỞI TẠO
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [topicRes, favRes] = await Promise.all([
          axiosClient.get('/topics'),
          axiosClient.get(`/favorites/ids`, {
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' }
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

  // 5. API CALL - TÌM KIẾM TỪ VỰNG
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
        if (showFavorites && favoriteIds.size > 0) params.ids = Array.from(favoriteIds).join(',');

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
  }, [currentPage, searchTerm, hskFilter, topicFilter, showFavorites, isInitialLoaded, favoriteIds]);

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
    hskFilter, setHskFilter: safeSetHskFilter,
    topicFilter, setTopicFilter: safeSetTopicFilter,
    showFavorites, setShowFavorites,
    currentPage, setCurrentPage, totalPages,
    toggleFavorite
  };
};
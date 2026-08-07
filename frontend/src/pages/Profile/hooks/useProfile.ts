import { useState, useEffect } from 'react';
import axiosClient from '../../../shared/lib/axiosClient';
import { useAuthStore } from '../../../shared/store/authStore';

export const useProfile = () => {
  const user = useAuthStore(state => state.user);
  
  const [dashboard, setDashboard] = useState<any>(null);
  const [favoriteDecks, setFavoriteDecks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const [dashRes, decksRes, actRes, achRes] = await Promise.allSettled([
          axiosClient.get('/dashboard'),
          axiosClient.get('/library/decks'),
          axiosClient.get('/user/activities'),
          axiosClient.get('/user/achievements') 
        ]);

        if (dashRes.status === 'fulfilled' && dashRes.value.data.success) {
          setDashboard(dashRes.value.data.data);
        }

        // Lấy 2 bộ thẻ yêu thích/đang học có progress cao nhất
        if (decksRes.status === 'fulfilled' && decksRes.value.data.success) {
          const allDecks = decksRes.value.data.data || [];
          const favs = allDecks.filter((d: any) => d.progress > 0 || d.tag === 'Cá nhân').slice(0, 2);
          setFavoriteDecks(favs);
        }

        if (actRes.status === 'fulfilled' && actRes.value.data.success) {
          setActivities(actRes.value.data.data || []);
        }

        if (achRes.status === 'fulfilled' && achRes.value.data.success) {
          setAchievements(achRes.value.data.data || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin Profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return { user, dashboard, favoriteDecks, activities, achievements, isLoading };
};
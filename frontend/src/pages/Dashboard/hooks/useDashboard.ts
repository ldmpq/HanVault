import { useState, useEffect } from 'react';
import axiosClient from '../../../shared/lib/axiosClient';
import { useAuthStore } from '../../../shared/store/authStore';

export interface DashboardData {
  userName: string;
  dailyGoal: { current: number; target: number; };
  streak: number;
  flashcard: { new: number; ready: number; overdue: number };
  nextQuiz: { date: string; title: string };
  mastered: { count: number; percentage: number };
  weeklyProgress: number[]; 
}

export const useDashboard = () => {
  const setUser = useAuthStore((state) => state.setUser); 
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosClient.get('/dashboard');
        const dashboardData = response.data.data;
        setData(dashboardData); 

        setUser({
          displayName: dashboardData.userName, 
          email: dashboardData.email,
          id: ''
        });
      } catch (err: any) {
        setError('Không thể tải dữ liệu Dashboard. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [setUser]);

  return { data, isLoading, error };
};
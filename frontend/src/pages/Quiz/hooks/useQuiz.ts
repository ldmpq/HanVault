import { useState, useEffect } from 'react';
import axiosClient from '../../../shared/lib/axiosClient';

export type QuizState = 'dashboard' | 'playing' | 'results';

export const useQuiz = () => {
  const [quizState, setQuizState] = useState<QuizState>('dashboard');
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const res = await axiosClient.get('/quizzes/recommended');

      const responseData = res.data || res;
      const quizList = responseData.data || responseData || [];
      
      setQuizzes(Array.isArray(quizList) ? quizList : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = async (quizId: number) => {
    try {
      setIsLoading(true);
      const res = await axiosClient.get(`/quizzes/${quizId}/questions`);
      setQuestions(res.data?.data || res.data);
      setActiveQuizId(quizId);
      setQuizState('playing');
    } catch (error) {
      console.error('Lỗi khi tải câu hỏi:', error);
      alert('Không thể tải bài kiểm tra lúc này.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitQuiz = async (answers: Record<number, string>, timeSpent: number) => {
    if (!activeQuizId) return;
    try {
      setIsLoading(true);
      const res = await axiosClient.post(`/quizzes/${activeQuizId}/submit`, {
        answers,
        timeSpent
      });
      setResults(res.data?.data || res.data);
      setQuizState('results');
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
      alert('Đã xảy ra lỗi khi chấm điểm.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setQuizState('dashboard');
    setActiveQuizId(null);
    setQuestions([]);
    setResults(null);
  };

  // Load danh sách quizzes khi vào trang
  useEffect(() => {
    fetchQuizzes();
  }, []);

  return {
    quizState,
    quizzes,
    questions,
    results,
    isLoading,
    startQuiz,
    submitQuiz,
    resetQuiz
  };
};
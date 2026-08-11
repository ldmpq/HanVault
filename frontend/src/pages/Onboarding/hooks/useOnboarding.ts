import { useState } from 'react';
import axiosClient from '../../../shared/lib/axiosClient';
import { useAuthStore } from '../../../shared/store/authStore';

export interface OnboardingData {
  currentLevel: number | null;
  learningGoals: string[];
  targetHskLevel: number | null;
  dailyCommitment: number | null;
}

interface UseOnboardingProps {
  onSuccess: (data: OnboardingData) => void;
}

export const useOnboarding = ({ onSuccess }: UseOnboardingProps) => {
  const [loading, setLoading] = useState(false);
  const fetchUserProfile = useAuthStore(state => state.fetchUserProfile);

  const [step, setStep] = useState(1);

  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [targetHskLevel, setTargetHskLevel] = useState<number | null>(null);
  const [dailyCommitment, setDailyCommitment] = useState<number | null>(null);

  const toggleGoal = (id: string) => {
    setLearningGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const isStepValid = () => {
    if (step === 1) return currentLevel !== null;
    if (step === 2) return learningGoals.length > 0;
    if (step === 3) return targetHskLevel !== null;
    if (step === 4) return dailyCommitment !== null;
    return false;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosClient.put('/auth/setup-profile', {
        currentHskLevel: currentLevel && currentLevel > 0 ? currentLevel : 1,
        targetHskLevel: targetHskLevel,
        learningGoals: learningGoals,
        dailyGoal: dailyCommitment,
      });
      
      if (fetchUserProfile) await fetchUserProfile();
      
      onSuccess({ currentLevel, learningGoals, targetHskLevel, dailyCommitment });
    } catch (error) {
      console.error('Lỗi khi thiết lập tài khoản:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    step, handleNext, handleBack, isStepValid,
    currentLevel, setCurrentLevel,
    learningGoals, toggleGoal,
    targetHskLevel, setTargetHskLevel,
    dailyCommitment, setDailyCommitment,
    loading
  };
};
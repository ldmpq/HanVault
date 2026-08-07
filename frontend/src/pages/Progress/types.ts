export interface ProgressData {
  learning?: {
    currentLevel?: string;
    targetLevel?: string;
    overallProgress?: number;
    estimatedDays?: number;
    dailyGoal?: { current: number; total: number };
    weeklyGoal?: { current: number; total: number };
    monthlyGoal?: { current: number; total: number };
    wordsLearned?: number;
    masteredWords?: number;
    learningWords?: number;
    remainingWords?: number;
    hskProgress?: Array<{ level: number; learned: number; total: number; progress: number }>;
    growthData?: Array<{ label: string; value: number }>;
    achievements?: Array<{ icon: string; title: string; locked: boolean }>;
  };
  flashcards?: {
    totalReviews?: number;
    dueToday?: number;
    reviewAccuracy?: number;
    currentStreak?: number;
    heatmapData?: Array<Array<number>>;
    retention?: { today: number; thisWeek: number; thisMonth: number };
    distribution?: Array<{ name: string; value: number; color: string }>;
    reviewTrendData?: Array<{ label: string; value: number }>;
    accuracyStats?: { rate: number; avgTime: number; correct: number; incorrect: number };
    insights?: Array<string>;
  };
}

export interface ProgressProps {
  data?: ProgressData;
  isLoading?: boolean;
}
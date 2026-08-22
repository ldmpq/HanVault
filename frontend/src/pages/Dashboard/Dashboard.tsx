import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useGreeting } from '../../shared/hooks/useGreeting';
import { useDashboard } from './hooks/useDashboard';
import DashboardHero from './components/DashboardHero';
import ReviewWidget from './components/ReviewWidget';
import CurrentCourseWidget from './components/CurrentCourseWidget';
import RecommendedDecks from './components/RecommendedDecks';
import ActivityHeatmap from '../../shared/components/ActivityHeatmap';

export default function Dashboard() {
  const navigate = useNavigate();
  const greeting = useGreeting();
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
        <p className="text-sub font-medium">Đang tải dữ liệu ...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-brand/10 text-brand p-4 rounded-xl text-center font-medium border border-brand/20">
        {error || 'Không có dữ liệu.'}
      </div>
    );
  }

  const weeklyActivity = [false, false, false, false, false, false, false];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 (T2) -> 6 (CN)
  
  if (data.weeklyProgress && data.weeklyProgress.length > 0) {
    const todayDataIndex = data.weeklyProgress.length - 1; 

    for (let i = 0; i <= currentDayIndex; i++) {
      const offset = currentDayIndex - i; 
      const activityLevel = data.weeklyProgress[todayDataIndex - offset];

      weeklyActivity[i] = activityLevel > 0;
    }
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in pb-12">
      
      <DashboardHero
        greeting={greeting}
        userName={data.userName}
        dailyGoal={data.dailyGoal}
        streak={data.streak}
        weeklyActivity={weeklyActivity}
        onContinue={() => navigate('/review')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <ReviewWidget 
          flashcard={data.flashcard}
          onStartReview={() => navigate('/review')}
          onReload={refetch}
        />

        <CurrentCourseWidget 
          mastered={data.mastered}
          onExplore={() => navigate('/courses')}
        />
      </div>

      <div className="mt-8 space-y-8">
        <RecommendedDecks />
        <ActivityHeatmap weeklyProgress={data.weeklyProgress} />
      </div>

    </div>
  );
}
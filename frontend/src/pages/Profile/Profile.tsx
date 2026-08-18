import { Loader2 } from 'lucide-react';
import { useProfile } from './hooks/useProfile';
import ProfileUserCard from './components/ProfileUserCard';
import ProfileGoalsCard from './components/ProfileGoalsCard';
import ProfileFavoriteDecks from './components/ProfileFavoriteDecks';
import ProfileActivities from './components/ProfileActivities';
import ProfileAchievements from './components/ProfileAchievements';

export default function Profile() {
  const { user, dashboard, favoriteDecks, activities, achievements, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
        <p className="text-sub font-medium">Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  const userName = dashboard?.userName || user?.displayName || 'Người dùng';
  const mastery = dashboard?.mastered?.percentage || 0;
  const streak = dashboard?.streak || 0;
  const dailyGoalMins = dashboard?.dailyGoal?.target || 30;

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in pb-12 px-4 md:px-8 mt-6 text-main transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= CỘT TRÁI ================= */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileUserCard 
            user={user} 
            userName={userName} 
            mastery={mastery} 
            streak={streak} 
          />
          <ProfileGoalsCard dailyGoalMins={dailyGoalMins} />
        </div>

        {/* ================= CỘT PHẢI ================= */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ProfileFavoriteDecks favoriteDecks={favoriteDecks} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <ProfileActivities activities={activities} />
            <ProfileAchievements achievements={achievements} />
          </div>
        </div>

      </div>
    </div>
  );
}
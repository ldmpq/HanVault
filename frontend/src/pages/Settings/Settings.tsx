import { useSettings } from './hooks/useSettings';
import AppearanceSection from './components/AppearanceSection';
import LearningPreferencesSection from './components/LearningPreferencesSection';
import AccountSecuritySection from './components/AccountSecuritySection';
import NotificationsSection from './components/NotificationsSection';

export default function Settings() {
  const {
    theme, setTheme,
    dailyGoal, setDailyGoal,
    reviewPace, setReviewPace,
    audioAutoplay, setAudioAutoplay,
    playbackSpeed, setPlaybackSpeed,
    notifications, markAllAsRead
  } = useSettings();

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 px-4 md:px-8 pt-6 font-sans animate-fade-in bg-[#FCFAF8] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Cài đặt</h1>
        <p className="text-gray-500 text-sm md:text-base">Quản lý trải nghiệm học tập và tùy chọn tài khoản của bạn.</p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= CỘT TRÁI ================= */}
        <div className="lg:col-span-8 space-y-8">
          <AppearanceSection theme={theme} setTheme={setTheme} />
          
          <LearningPreferencesSection 
            dailyGoal={dailyGoal} setDailyGoal={setDailyGoal}
            reviewPace={reviewPace} setReviewPace={setReviewPace}
            audioAutoplay={audioAutoplay} setAudioAutoplay={setAudioAutoplay}
            playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed}
          />
          
          <AccountSecuritySection />
        </div>

        {/* ================= CỘT PHẢI ================= */}
        <div className="lg:col-span-4 space-y-6">
          <NotificationsSection 
            notifications={notifications} 
            markAllAsRead={markAllAsRead} 
          />
        </div>

      </div>
    </div>
  );
}
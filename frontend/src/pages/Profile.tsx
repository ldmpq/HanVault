import { useNavigate } from 'react-router-dom';
import { Bell, Trophy, Flame, Lock, GraduationCap, Loader2 } from 'lucide-react';
import { useProfile } from '../shared/hooks/useProfile';

export default function Profile() {
  const navigate = useNavigate();
  const { user, dashboard, favoriteDecks, activities, achievements, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#A82B2B] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  const userName = dashboard?.userName || user?.displayName || 'Người dùng';
  const mastery = dashboard?.mastered?.percentage || 0;
  const streak = dashboard?.streak || 0;
  const currentHsk = dashboard?.currentLevel || 'HSK 3';
  const targetHsk = dashboard?.targetLevel || 'HSK 4';
  const dailyGoalMins = dashboard?.dailyGoal?.target || 30;

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in pb-12 px-4 md:px-8 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= CỘT TRÁI ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* USER INFO CARD */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center">
            <div className="relative mb-4">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-red-50 shadow-sm"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{userName}</h2>
            <p className="text-gray-500 text-sm mb-8 font-medium">Dedicated Learner</p>

            <div className="flex w-full gap-4 mb-8">
              <div className="flex-1 bg-[#FCFAF8] rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current</span>
                <span className="text-lg font-bold text-[#A82B2B]">{currentHsk}</span>
              </div>
              <div className="flex-1 bg-[#FCFAF8] rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Target</span>
                <span className="text-lg font-bold text-gray-900">{targetHsk}</span>
              </div>
            </div>

            <div className="flex w-full gap-8 border-t border-gray-100 pt-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500">Mastery</span>
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold text-gray-900 leading-none">{mastery}</span>
                  <span className="text-sm font-bold text-gray-500 mb-0.5">%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#A82B2B] rounded-full" style={{ width: `${mastery}%` }}></div>
                </div>
              </div>
              
              <div className="flex-1 border-l border-gray-100 pl-8">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-gray-500">Streak</span>
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900 leading-none">{streak}</span>
                  <span className="text-sm font-bold text-gray-500 mb-0.5">d</span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold tracking-wide">Keep it up!</span>
              </div>
            </div>
          </div>

          {/* LEARNING GOALS CARD */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Goals</h3>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">Daily Goal</span>
                <span className="text-sm font-bold text-[#A82B2B]">{dailyGoalMins} mins</span>
              </div>
              <div className="relative w-full h-2 bg-gray-100 rounded-full">
                <div className="absolute top-0 left-0 h-full bg-[#A82B2B] rounded-full w-1/3 transition-all"></div>
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-[#A82B2B] rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Daily Reminder</span>
              </div>
              <span className="text-sm font-bold text-gray-900">8:00 PM</span>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI ================= */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* FAVORITE DECKS */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Favorite Decks</h3>
              <button onClick={() => navigate('/library')} className="text-sm font-bold text-[#A82B2B] hover:underline">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {favoriteDecks.map(deck => (
                <div key={deck.id} onClick={() => navigate(`/deck/${deck.id}`)} className="bg-[#FCFAF8] rounded-2xl p-5 border border-gray-100 hover:border-red-200 cursor-pointer transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-900 line-clamp-2 pr-2">{deck.title || deck.name}</h4>
                    {deck.level && <span className="bg-red-50 text-[#A82B2B] text-[10px] font-bold px-2 py-1 rounded">H{deck.level}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-6 font-medium">{deck.words || 0} Cards</p>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-2">
                    <span>Progress</span><span>{deck.progress || 0}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#A82B2B] rounded-full" style={{ width: `${deck.progress || 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TWO COLUMNS: ACTIVITY & ACHIEVEMENTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            
            {/* Recent Activity */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              
              {activities.length > 0 ? (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {activities.map((act, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-[#A82B2B] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                          <time className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">{act.time}</time>
                          <div className="text-sm font-bold text-gray-900">{act.title}</div>
                          <div className="text-xs font-medium text-gray-500 mt-1">{act.description}</div>
                        </div>
                      </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center mt-6">
                  <p className="text-sm text-gray-400 font-medium">Bạn chưa có hoạt động nào gần đây.</p>
                  <button onClick={() => navigate('/library')} className="mt-4 px-5 py-2.5 bg-red-50 text-[#A82B2B] rounded-xl text-sm font-bold transition-colors hover:bg-red-100">Bắt đầu học ngay</button>
                </div>
              )}
            </div>

            {/* Latest Achievements */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Latest Achievements</h3>
              
              {achievements.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((ach, idx) => (
                      <div key={idx} className={`border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center transition-all ${ach.isLocked ? 'bg-white opacity-60' : 'bg-[#FCFAF8] shadow-sm'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm ${ach.isLocked ? 'bg-gray-100 text-gray-400' : (idx % 2 === 0 ? 'bg-yellow-50 text-yellow-600' : 'bg-orange-50 text-orange-500')}`}>
                          {ach.isLocked ? <Lock className="w-5 h-5" /> : (idx % 2 === 0 ? <Trophy className="w-5 h-5" /> : <Flame className="w-5 h-5" />)}
                        </div>
                        <span className={`text-xs font-bold ${ach.isLocked ? 'text-gray-400' : 'text-gray-900'}`}>{ach.title}</span>
                      </div>
                    ))}
                  </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center mt-6">
                  <Trophy className="w-10 h-10 text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400 font-medium">Bạn chưa đạt được thành tựu nào.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
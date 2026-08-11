import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, PenTool, Brain, Loader2 } from 'lucide-react';
import axiosClient from '../../shared/lib/axiosClient';
import { useAuthStore } from '../../shared/store/authStore';

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fetchUserProfile = useAuthStore(state => state.fetchUserProfile);

  // States lưu trữ lựa chọn
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [learningGoals, setLearningGoals] = useState<string[]>(['build_vocab']);
  const [dailyCommitment, setDailyCommitment] = useState<number>(20);

  const levels = [
    { id: 0, label: 'Beginner' },
    { id: 1, label: 'HSK 1' },
    { id: 2, label: 'HSK 2' },
    { id: 3, label: 'HSK 3' },
    { id: 4, label: 'HSK 4' },
    { id: 5, label: 'HSK 5' },
    { id: 6, label: 'HSK 6' },
    { id: -1, label: 'Not sure' },
  ];

  const goals = [
    { id: 'build_vocab', label: 'Build vocabulary', icon: <Brain className="w-4 h-4" /> },
    { id: 'prepare_hsk', label: 'Prepare for HSK', icon: <Target className="w-4 h-4" /> },
    { id: 'improve_reading', label: 'Improve reading', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'improve_writing', label: 'Improve writing', icon: <PenTool className="w-4 h-4" /> },
  ];

  const times = [
    { value: 10, label: '10m' },
    { value: 15, label: '15m' },
    { value: 20, label: '20m' },
    { value: 30, label: '30m' },
    { value: 45, label: '45m+' },
  ];

  const toggleGoal = (id: string) => {
    setLearningGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Gọi API module Auth để lưu Profile
      await axiosClient.put('/auth/setup-profile', {
        currentHskLevel: currentLevel > 0 ? currentLevel : 1,
        dailyGoal: dailyCommitment,
      });
      
      // Lấy lại data mới nhất nạp vào store
      if (fetchUserProfile) await fetchUserProfile();
      
      // Chuyển hướng vào trang chủ
      navigate('/dashboard');
    } catch (error) {
      console.error('Lỗi khi thiết lập tài khoản:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-[500px] w-full rounded-[32px] p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-neutral-100 relative mt-10">
        
        {/* Header & Progress */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#9E2A2B] tracking-tight mb-4">HanVault</h1>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-1 rounded-full bg-[#9E2A2B]"></div>
            <div className="w-8 h-1 rounded-full bg-neutral-200"></div>
            <div className="w-8 h-1 rounded-full bg-neutral-200"></div>
          </div>
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">Step 1 of 3</p>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Let's set up your learning journey.</h2>
          <p className="text-sm text-neutral-500">Tell us a little about your goals so HanVault can personalize your experience.</p>
        </div>

        <div className="space-y-8">
          {/* Current Level Section */}
          <section>
            <h3 className="text-[15px] font-bold text-neutral-900 mb-4">Current Chinese Level</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {levels.map(level => (
                <button
                  key={level.id}
                  onClick={() => setCurrentLevel(level.id)}
                  className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                    currentLevel === level.id 
                      ? 'bg-[#A32A29] text-white shadow-md shadow-red-900/20' 
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:border-[#A32A29]/30 hover:bg-red-50/50'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </section>

          {/* Learning Goal Section */}
          <section>
            <h3 className="text-[15px] font-bold text-neutral-900 mb-4">Learning Goal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map(goal => {
                const isActive = learningGoals.includes(goal.id);
                return (
                  <div 
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive ? 'border-[#A32A29] bg-[#A32A29]/5' : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={isActive ? 'text-[#A32A29]' : 'text-neutral-500'}>{goal.icon}</div>
                      <span className="text-[13px] font-medium text-neutral-700">{goal.label}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center ${
                      isActive ? 'bg-[#A32A29] border-[#A32A29]' : 'border-neutral-300'
                    }`}>
                      {isActive && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Daily Commitment Section */}
          <section>
            <h3 className="text-[15px] font-bold text-neutral-900 mb-4">Daily Commitment</h3>
            <div className="bg-[#F8F7F5] p-1.5 rounded-2xl flex items-center justify-between">
              {times.map(time => (
                <button
                  key={time.value}
                  onClick={() => setDailyCommitment(time.value)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    dailyCommitment === time.value 
                      ? 'bg-white text-[#A32A29] shadow-sm' 
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col gap-4">
          <button 
            onClick={handleSubmit}
            disabled={loading || learningGoals.length === 0}
            className="w-full bg-[#A32A29] hover:bg-[#8B2323] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            Skip for now
          </button>
        </div>

      </div>
    </div>
  );
}
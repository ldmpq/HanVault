import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Flame, RotateCw, BookOpen, Clock, PlusSquare, ChevronLeft, ChevronRight, List, Lock, Loader2, GraduationCap } from 'lucide-react';
import axiosClient from '../shared/api/axiosClient';

interface DashboardData {
  userName: string;
  dailyGoal: { current: number; target: number; };
  streak: number;
  flashcard: any;
  nextQuiz: any;
  mastered: any;
  weeklyProgress: any[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosClient.get('/dashboard');
        setData(response.data.data); 
      } catch (err: any) {
        setError('Không thể tải dữ liệu Dashboard. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#A82B2B] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải dữ liệu từ Vault...</p>
      </div>
    );
  }

  if (error || !data) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium">{error || 'Không có dữ liệu.'}</div>;
  }

  // Tính toán vòng tròn Progress
  const circleCircumference = 226; // 2 * pi * r (r=36)
  const progressRatio = Math.min(data.dailyGoal.current / data.dailyGoal.target, 1);
  const strokeDashoffset = circleCircumference - (circleCircumference * progressRatio);

  // Dữ liệu mô phỏng cho Heatmap (Weekly Activity)
  const activityData = Array.from({ length: 90 }, () => Math.floor(Math.random() * 5));

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in pb-12">
      
      {/* ================= HERO SECTION (Welcome & Stats) ================= */}
      <div className="bg-gradient-to-br from-[#FFFBFB] to-red-50/30 rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 mb-8 gap-8">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Chào buổi sáng, <span className="text-[#A82B2B]">{data.userName || 'Alex'}</span>
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
            You're making steady progress toward HSK 4. Today is a great day to master those challenging characters. Let's keep the momentum going.
          </p>
          <button 
            onClick={() => navigate('/review')}
            className="bg-[#A82B2B] hover:bg-[#8b2323] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform hover:-translate-y-1 shadow-md shadow-red-900/10"
          >
            <Play className="w-4 h-4 fill-current" /> Continue Learning
          </button>
        </div>

        <div className="flex gap-4 md:gap-6 w-full md:w-auto justify-center">
          {/* Daily Goal Circle */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50 flex flex-col items-center justify-center min-w-[150px]">
            <h3 className="text-[11px] font-bold text-gray-400 mb-4 tracking-wide">Daily Goal</h3>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="#F5F5F5" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="36" stroke="#9A5A20" strokeWidth="6" fill="transparent" strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900 leading-none">{data.dailyGoal.current}</span>
                <span className="text-[9px] text-gray-400 font-bold mt-0.5">/{data.dailyGoal.target} xp</span>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50 flex flex-col items-center justify-center min-w-[150px] relative overflow-hidden">
            <Flame className="absolute -right-4 -bottom-4 w-24 h-24 text-red-50 opacity-40" />
            <h3 className="text-[11px] font-bold text-gray-400 mb-4 tracking-wide relative z-10">Current Streak</h3>
            <div className="flex items-center gap-2 relative z-10 mb-1">
              <Flame className="w-8 h-8 text-[#A82B2B] fill-[#A82B2B]" />
              <span className="text-4xl font-bold text-gray-900">{data.streak}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold relative z-10">Days in a row</span>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE SECTION (Reviews & Course) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Reviews Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
            <button className="text-[#A82B2B] hover:rotate-180 transition-transform duration-500">
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-[#A82B2B]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ready</span>
              </div>
              <span className="text-xl font-bold text-[#A82B2B]">34</span>
            </div>
            
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-red-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">Overdue</span>
              </div>
              <span className="text-xl font-bold text-red-500">12</span>
            </div>

            <div className="flex justify-between items-center bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-500">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">New</span>
              </div>
              <span className="text-xl font-bold text-orange-600">15</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/review')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-colors text-sm"
          >
            Start Review Session
          </button>
        </div>

        {/* Current Course Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Current Course</h2>
            <button className="text-[10px] font-bold text-[#A82B2B] uppercase tracking-wider hover:underline">View all</button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center h-full">
            {/* Cover Image Placeholder */}
            <div className="w-full md:w-1/3 h-full min-h-[220px] bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1541959833400-049d37f98ccd?w=400&q=80" 
                alt="HSK 4 Book" 
                className="w-full h-full object-cover opacity-90 mix-blend-multiply"
              />
              <div className="absolute bottom-3 left-3 bg-[#A82B2B] text-white text-[10px] font-bold px-2.5 py-1 rounded">HSK 4</div>
            </div>

            {/* Course Details */}
            <div className="flex-1 w-full flex flex-col justify-center py-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mastering Intermediate Grammar</h3>
              <p className="text-gray-500 mb-8 text-sm">Module 3: Expressing conditions and hypotheses.</p>
              
              <div className="mb-8 w-full">
                <div className="flex justify-between text-[11px] font-bold text-gray-900 mb-2">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#A82B2B] rounded-full w-[65%]"></div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/courses')}
                  className="flex-1 bg-[#A82B2B] hover:bg-[#8b2323] text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm"
                >
                  Resume Lesson
                </button>
                <button className="w-12 h-11 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center justify-center rounded-xl transition-colors">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECOMMENDED DECKS ================= */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recommended Decks</h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-10">
              <div className="w-10 h-10 bg-orange-50 text-[#9A5A20] flex items-center justify-center rounded-xl font-bold">食</div>
              <span className="bg-orange-50 text-[#9A5A20] text-[9px] font-bold px-2 py-1 rounded">Food</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Restaurant Essentials</h3>
            <p className="text-xs text-gray-500 mb-4">50 words</p>
            <div className="w-full h-1 bg-gray-100 rounded-full"><div className="w-[15%] h-full bg-[#9A5A20] rounded-full"></div></div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-10">
              <div className="w-10 h-10 bg-pink-50 text-pink-600 flex items-center justify-center rounded-xl font-bold">行</div>
              <span className="bg-pink-50 text-pink-600 text-[9px] font-bold px-2 py-1 rounded">Travel</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Navigating the City</h3>
            <p className="text-xs text-gray-500 mb-4">120 words</p>
            <div className="w-full h-1 bg-gray-100 rounded-full"></div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-10">
              <div className="w-10 h-10 bg-[#F4F1E1] text-[#9A8C46] flex items-center justify-center rounded-xl font-bold">商</div>
              <span className="bg-[#F4F1E1] text-[#9A8C46] text-[9px] font-bold px-2 py-1 rounded">Business</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Office Small Talk</h3>
            <p className="text-xs text-gray-500 mb-4">85 words</p>
            <div className="w-full h-1 bg-gray-100 rounded-full"><div className="w-[70%] h-full bg-[#9A8C46] rounded-full"></div></div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 opacity-60">
            <div className="flex justify-between items-start mb-10">
              <div className="w-10 h-10 bg-gray-100 text-gray-400 flex items-center justify-center rounded-xl"><Lock className="w-4 h-4" /></div>
              <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-1 rounded">HSK 5</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Advanced Idioms</h3>
            <p className="text-xs text-gray-500 mb-4">Unlock at Level 5</p>
            <div className="w-full h-1 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* ================= WEEKLY ACTIVITY HEATMAP ================= */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Weekly Activity</h2>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
              <div className="w-3 h-3 rounded-sm bg-red-100"></div>
              <div className="w-3 h-3 rounded-sm bg-red-300"></div>
              <div className="w-3 h-3 rounded-sm bg-red-500"></div>
              <div className="w-3 h-3 rounded-sm bg-[#A82B2B]"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="flex gap-3 items-start overflow-x-auto custom-scrollbar pb-2">
          <div className="flex flex-col justify-between gap-[9px] text-[10px] text-gray-400 font-bold py-[2px]">
            <span className="h-4 flex items-center">Mon</span>
            <span className="h-4 flex items-center">Tue</span>
            <span className="h-4 flex items-center">Wed</span>
            <span className="h-4 flex items-center">Thu</span>
            <span className="h-4 flex items-center">Fri</span>
            <span className="h-4 flex items-center">Sat</span>
            <span className="h-4 flex items-center">Sun</span>
          </div>

          <div className="grid grid-rows-7 gap-y-1.5 gap-x-1 grid-flow-col flex-1">
            {activityData.map((level, i) => {
              const bgColors = ['bg-gray-100', 'bg-red-100', 'bg-red-300', 'bg-red-500', 'bg-[#A82B2B]'];
              return (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm ${bgColors[level]} hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer`}
                ></div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
import { useState, useEffect } from 'react';
import { Flame, FileQuestion, BadgeCheck, Play, Loader2 } from 'lucide-react';
import axiosClient from '../shared/api/axiosClient';

interface DashboardData {
  userName: string;
  dailyGoal: {
    current: number;
    target: number;
  };
  streak: number;
  flashcard: {
    simplified: string;
    pinyin: string;
    meaning: string;
    partOfSpeech: string;
  };
  nextQuiz: {
    date: string;
    title: string;
  };
  mastered: {
    count: number;
    percentage: number;
  };
  weeklyProgress: {
    day: string;
    percentage: number;
    isPeak: boolean;
  }[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosClient.get('/dashboard');
        setData(response.data.data); 
      } catch (err: any) {
        console.error("Lỗi lấy dữ liệu:", err);
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
        <p className="text-gray-500 font-medium animate-pulse">Đang tải dữ liệu từ Vault...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium">
        {error || 'Không có dữ liệu.'}
      </div>
    );
  }

  const circleCircumference = 283;
  const progressRatio = Math.min(data.dailyGoal.current / data.dailyGoal.target, 1);
  const strokeDashoffset = circleCircumference - (circleCircumference * progressRatio);

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          {getGreeting()}, {data.userName || 'Learner'}!
        </h1>
        <p className="text-gray-600 text-lg">
          You're {data.dailyGoal.target - data.dailyGoal.current} words away from today's target. Stay consistent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Goal Card */}
        <div className="lg:col-span-8 bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10 hover:shadow-md transition-shadow">
          <div className="relative w-44 h-44 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F5E6E6" strokeWidth="6" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#D26045" strokeWidth="6" 
                strokeDasharray={circleCircumference} 
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">{data.dailyGoal.current}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                / {data.dailyGoal.target} Words
              </span>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Daily Goal</h2>
            <p className="text-gray-500 mb-8 leading-relaxed max-w-sm">
              You're almost there! Just {data.dailyGoal.target - data.dailyGoal.current} more words to reach your target for today.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#A82B2B] hover:bg-[#8b2323] text-white font-semibold py-3 px-6 rounded-full text-sm transition-colors shadow-sm">
                Start Daily Review
              </button>
              <button className="bg-[#FDF5F5] hover:bg-red-50 text-[#A82B2B] font-semibold py-3 px-6 rounded-full text-sm transition-colors border border-red-100">
                Practice HSK 3
              </button>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="lg:col-span-4 bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
          <Flame className="w-12 h-12 text-[#9A5A20] mb-4" strokeWidth={1.5} />
          <div className="relative">
            <h2 className="text-7xl font-bold text-gray-900 tracking-tighter">{data.streak}</h2>
            <div className="h-1 w-12 bg-gray-900 mx-auto rounded-full mt-2 mb-2"></div>
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-6">Day Streak</span>
          <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed">
            Top 5% of learners this month. Keep the fire burning!
          </p>
        </div>

        {/* Flashcard (Dữ liệu động map từ vocabularies) */}
        <div className="lg:col-span-4 bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px] hover:shadow-md transition-shadow">
          <h1 className="text-7xl font-semibold text-[#A82B2B] mb-4">{data.flashcard.simplified}</h1>
          <p className="text-lg text-gray-600 mb-8 tracking-wide">{data.flashcard.pinyin}</p>
          <div className="w-16 h-[1px] bg-gray-200 mb-8"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.flashcard.meaning}</h2>
          <p className="text-gray-400 italic text-sm">{data.flashcard.partOfSpeech}</p>
        </div>

        {/* Right Column Wrapper */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-1/2">
            <div className="bg-[#FDF7F7] rounded-[32px] p-8 relative flex flex-col justify-end min-h-[180px]">
              <div className="absolute top-8 left-8 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <FileQuestion className="w-5 h-5 text-[#A82B2B]" />
              </div>
              <div className="absolute top-8 right-8 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                {data.nextQuiz.date}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-12">Next Quiz</h3>
              <p className="text-gray-600 text-sm">{data.nextQuiz.title}</p>
            </div>

            <div className="bg-[#FDF7F7] rounded-[32px] p-8 relative flex flex-col justify-end min-h-[180px]">
              <div className="absolute top-8 left-8 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <BadgeCheck className="w-5 h-5 text-[#A82B2B]" />
              </div>
              <div className="absolute top-8 right-8 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                +{data.mastered.percentage}%
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-12">Mastered</h3>
              <p className="text-gray-600 text-sm">{data.mastered.count} new characters learned</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 h-1/2 relative flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900">Weekly Progress</h3>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#A82B2B]"></div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Words Learned</span>
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 md:gap-6 mt-4">
              {data.weeklyProgress.map((bar, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full max-w-[40px] rounded-t-lg transition-all duration-1000 ease-out 
                      ${bar.isPeak ? 'bg-[#A82B2B]' : bar.percentage > 30 ? 'bg-[#DDA3A3]' : 'bg-red-50'}`} 
                    style={{ height: `${bar.percentage}%` }}
                  ></div>
                  <span className="text-[10px] font-bold text-gray-400 mt-4 uppercase">{bar.day}</span>
                </div>
              ))}
            </div>

            <button className="absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#A82B2B] hover:bg-[#8b2323] rounded-full flex items-center justify-center text-white shadow-xl shadow-red-900/30 transition-transform hover:scale-105 z-10 cursor-pointer">
              <Play fill="currentColor" className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
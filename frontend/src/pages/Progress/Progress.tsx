import { useState } from 'react';
import { Trophy, Clock, Target, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import type { ProgressProps } from './types';
import StatCard from './components/StatCard';
import ProgressHero from './components/ProgressHero';
import ProgressChart from './components/ProgressChart';
import AchievementSection from './components/AchievementSection';
import LearningInsights from './components/LearningInsights';
import RecentActivity from './components/RecentActivity';

export default function Progress({ data, isLoading = false }: ProgressProps) {
  const [activeTab, setActiveTab] = useState<'learning' | 'flashcards'>('learning');
  const [learningTimeframe, setLearningTimeframe] = useState('30D');
  const [reviewTimeframe, setReviewTimeframe] = useState('7D');

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh] text-sub font-medium animate-pulse">Đang tải dữ liệu học tập...</div>;
  }

  const totalDistribution = data?.flashcards?.distribution?.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-36 px-4 md:px-8 pt-8 font-sans animate-fade-in bg-app text-main transition-colors">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-main mb-2 tracking-tight">Your Progress</h1>
          <p className="text-sub text-sm md:text-base">Track your journey and memory retention over time.</p>
        </div>
        <div className="flex bg-line/30 p-1.5 rounded-2xl w-fit border border-line">
          <button 
            onClick={() => setActiveTab('learning')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'learning' ? 'bg-surface text-main shadow-sm' : 'text-sub hover:text-main'}`}
          >
            Learning
          </button>
          <button 
            onClick={() => setActiveTab('flashcards')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'flashcards' ? 'bg-surface text-main shadow-sm' : 'text-sub hover:text-main'}`}
          >
            Flashcards
          </button>
        </div>
      </div>

      {/* DYNAMIC VIEWS */}
      {activeTab === 'learning' ? (
        <div className="space-y-8 animate-fade-in">
          {/* Hero & Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <ProgressHero data={data?.learning} />
            </div>
            <div className="lg:col-span-4 bg-surface rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line flex flex-col justify-center">
              <h3 className="text-lg font-bold text-main mb-6">Learning Goals</h3>
              <div className="space-y-6">
                {[
                  { label: 'Daily Goal', goal: data?.learning?.dailyGoal, suffix: 'mins', color: 'bg-brand' },
                  { label: 'Weekly Goal', goal: data?.learning?.weeklyGoal, suffix: 'days', color: 'bg-orange-500' },
                  { label: 'Monthly Goal', goal: data?.learning?.monthlyGoal, suffix: 'days', color: 'bg-yellow-500' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-sub">{item.label}</span>
                      <span className="text-sm font-bold text-main">{item.goal?.current || 0} / {item.goal?.total || 0} {item.suffix}</span>
                    </div>
                    <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.min(((item.goal?.current || 0) / (item.goal?.total || 1)) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Words Learned" value={data?.learning?.wordsLearned || 0} icon={BookOpen} colorClass="text-blue-500" bgClass="bg-blue-500/10" />
            <StatCard label="Mastered Words" value={data?.learning?.masteredWords || 0} icon={Trophy} colorClass="text-brand" bgClass="bg-brand/10" />
            <StatCard label="Learning Words" value={data?.learning?.learningWords || 0} icon={Clock} colorClass="text-yellow-500" bgClass="bg-yellow-500/10" />
            <StatCard label="Remaining Words" value={data?.learning?.remainingWords || 0} icon={Target} colorClass="text-sub" bgClass="bg-line" />
          </div>

          {/* HSK Progress & Growth & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-surface rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line">
              <h3 className="text-lg font-bold text-main mb-8">Progress by HSK Level</h3>
              <div className="space-y-7">
                {(data?.learning?.hskProgress || []).map((hsk) => (
                  <div key={hsk.level} className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-16 shrink-0">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg border ${hsk.progress > 0 ? 'bg-brand/10 text-brand border-brand/20' : 'bg-line/50 text-sub border-line'}`}>HSK {hsk.level}</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2.5">
                      <div className="flex justify-between items-end text-xs">
                        <span className="font-medium text-sub"><span className="font-bold text-main text-sm">{hsk.learned}</span> / {hsk.total} words</span>
                        <span className="font-bold text-main">{hsk.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${hsk.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-8">
              <ProgressChart 
                title="Vocabulary Growth" 
                data={data?.learning?.growthData || []} 
                colorClass="bg-brand" hoverClass="bg-brand-hover" 
                timeframe={learningTimeframe} onTimeframeChange={setLearningTimeframe} 
              />
              <AchievementSection achievements={data?.learning?.achievements} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Flashcard Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Reviews" value={data?.flashcards?.totalReviews || 0} />
            <StatCard label="Due Today" value={data?.flashcards?.dueToday || 0} isHighlighted />
            <StatCard label="Review Accuracy" value={`${data?.flashcards?.reviewAccuracy || 0}%`} />
            <StatCard label="Current Streak" value={`${data?.flashcards?.currentStreak || 0} days`} />
          </div>

          {/* Activity & Retention */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <RecentActivity heatmapData={data?.flashcards?.heatmapData} />
            </div>
            <div className="lg:col-span-4 bg-surface rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line flex flex-col justify-center">
              <h3 className="text-lg font-bold text-main mb-6">Memory Retention</h3>
              <div className="space-y-4">
                {[
                  { label: 'Today', value: data?.flashcards?.retention?.today, color: 'text-emerald-500' },
                  { label: 'This Week', value: data?.flashcards?.retention?.thisWeek, color: 'text-main' },
                  { label: 'This Month', value: data?.flashcards?.retention?.thisMonth, color: 'text-main' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-app border border-line rounded-2xl p-4 flex justify-between items-center shadow-sm">
                    <span className="text-sm font-bold text-sub">{item.label}</span>
                    <span className={`text-xl font-bold ${item.color}`}>{item.value || 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Distribution, Trend & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-surface rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line">
              <h3 className="text-lg font-bold text-main mb-6">Card Distribution</h3>
              <div className="w-full h-8 rounded-xl flex overflow-hidden mb-8 bg-line shadow-inner">
                {(data?.flashcards?.distribution || []).map((item, idx) => (
                  <div key={idx} style={{ width: `${(item.value / totalDistribution) * 100}%`, backgroundColor: item.color }} className="h-full transition-all duration-700 hover:brightness-110" />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                {(data?.flashcards?.distribution || []).map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-sub uppercase tracking-widest">{item.name}</span>
                      <span className="text-sm font-bold text-main">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <ProgressChart 
                title="Review Trend" 
                data={data?.flashcards?.reviewTrendData || []} 
                colorClass="bg-orange-500" hoverClass="bg-orange-600" 
                timeframe={reviewTimeframe} onTimeframeChange={setReviewTimeframe} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Rate', value: `${data?.flashcards?.accuracyStats?.rate || 0}%`, icon: Target, color: 'text-brand' },
                    { label: 'Avg Time', value: `${data?.flashcards?.accuracyStats?.avgTime || 0}s`, icon: Clock, color: 'text-blue-500' },
                    { label: 'Correct', value: data?.flashcards?.accuracyStats?.correct || 0, icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'Incorrect', value: data?.flashcards?.accuracyStats?.incorrect || 0, icon: XCircle, color: 'text-red-500' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-surface p-5 rounded-[20px] border border-line shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-[10px] font-bold text-sub uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className="text-xl font-bold text-main">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <LearningInsights insights={data?.flashcards?.insights} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
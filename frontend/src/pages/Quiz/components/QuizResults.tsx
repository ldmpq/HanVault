import { Clock, CheckCircle2, XCircle, Flame, Award, BookOpen, RotateCw } from 'lucide-react';

interface QuizResultsProps {
  results: any;
  onRetry: () => void;
}

export default function QuizResults({ results, onRetry }: QuizResultsProps) {
  if (!results) return null;
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full max-w-[800px] mx-auto pb-24 px-4 md:px-8 pt-10 animate-fade-in">
      
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-brand/30 flex items-center justify-center bg-brand/5 mb-6 p-2 relative">
          <img 
            src="/assets/panda-celebrate.png" 
            alt="Panda Celebrate" 
            className="w-full h-full object-contain"
            onError={(e) => { e.currentTarget.src = "https://api.dicebear.com/7.x/bottts/svg?seed=panda&backgroundColor=transparent"; }}
          />
          <div className="absolute -top-2 -right-2 text-xl">✨</div>
        </div>
        <h1 className="text-4xl font-bold text-brand mb-4">Quiz Mastered!</h1>
        <p className="text-sub max-w-md leading-relaxed">
          Excellent work! You're making significant progress in your vocabulary mastery.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="col-span-2 bg-surface border border-line rounded-[1.5rem] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-main mb-2">Total Score</h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-bold text-brand leading-none">{results.score}</span>
            <span className="text-2xl font-bold text-sub pb-1">%</span>
          </div>
          <div className="w-full h-2 bg-line rounded-full overflow-hidden flex">
            <div className="h-full bg-gradient-to-r from-orange-400 to-brand rounded-full transition-all duration-1000" style={{ width: `${results.score}%` }}></div>
          </div>
        </div>

        <div className="col-span-2 bg-surface border border-line rounded-[1.5rem] p-6 shadow-sm flex flex-col items-center justify-center">
          <Clock className="w-6 h-6 text-orange-500 mb-2" />
          <span className="text-[10px] font-bold text-sub uppercase tracking-widest mb-1">Time Spent</span>
          <span className="text-2xl font-bold text-main">{formatTime(results.timeSpent)}</span>
        </div>

        <div className="col-span-1 md:col-span-2 bg-surface border border-line rounded-[1.5rem] p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5" /></div>
          <div>
            <div className="text-xl font-bold text-main">{results.correct}</div>
            <div className="text-[10px] font-bold text-sub uppercase">Correct</div>
          </div>
        </div>

        <div className="col-span-1 bg-surface border border-line rounded-[1.5rem] p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0"><XCircle className="w-5 h-5" /></div>
          <div>
            <div className="text-xl font-bold text-main">{results.incorrect}</div>
            <div className="text-[10px] font-bold text-sub uppercase">Incorrect</div>
          </div>
        </div>

        <div className="col-span-1 bg-surface border border-line rounded-[1.5rem] p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0"><Flame className="w-5 h-5 fill-current" /></div>
          <div>
            <div className="text-xl font-bold text-main">{results.streak || 0}</div>
            <div className="text-[10px] font-bold text-sub uppercase">Streak Days</div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-sm font-bold text-emerald-600 flex items-center gap-2 mb-4"><Award className="w-4 h-4" /> Strong Topics</h3>
          <div className="space-y-3">
            {results.strongTopics?.length > 0 ? (
              results.strongTopics.map((topic: any, idx: number) => (
                <div key={idx} className="bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-xl p-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-main">{topic.name}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">{topic.accuracy}%</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-sub italic">Chưa có đủ dữ liệu đánh giá</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-brand flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4" /> To Review</h3>
          <div className="space-y-3">
            {results.reviewTopics?.length > 0 ? (
              results.reviewTopics.map((topic: any, idx: number) => (
                <div key={idx} className="bg-brand/5 border-l-4 border-brand rounded-r-xl p-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-main">{topic.name}</span>
                  <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-1 rounded">{topic.accuracy}%</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-sub italic">Bạn đã nắm vững toàn bộ bài thi!</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {results.incorrect > 0 && (
          <button className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 shadow-md shadow-brand/20">
            <BookOpen className="w-4 h-4" /> Review Incorrect Words
          </button>
        )}
        <button 
          onClick={onRetry}
          className="w-full sm:w-auto border border-line bg-surface hover:bg-line/50 text-main px-8 py-3.5 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2"
        >
          <RotateCw className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}
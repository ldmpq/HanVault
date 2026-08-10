import { Clock, BookOpen, Loader2 } from 'lucide-react';

interface QuizDashboardProps {
  quizzes: any[];
  isLoading: boolean;
  onStart: (quizId: number) => void;
}

export default function QuizDashboard({ quizzes, isLoading, onStart }: QuizDashboardProps) {
  // Biến an toàn để kiểm tra mảng
  const hasQuizzes = Array.isArray(quizzes) && quizzes.length > 0;

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 pt-6 animate-fade-in">
      {/* HERO BANNER */}
      <div className="bg-surface rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center mb-10 shadow-sm border border-line overflow-hidden">
        <div className="max-w-md z-10 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-main mb-4 tracking-tight">Quiz Arena</h1>
          <p className="text-sub leading-relaxed text-sm md:text-base mb-8">
            Test your mastery. Challenge yourself with curated HSK quizzes, grammar tests, and reading comprehensions designed to accelerate your learning journey.
          </p>
          {hasQuizzes && (
            <button 
              onClick={() => onStart(quizzes[0].id)}
              className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold text-sm transition-transform hover:-translate-y-1 shadow-md shadow-brand/20"
            >
              Take Placement Test
            </button>
          )}
        </div>
        
        {/* FIX LỖI ẢNH: Đã thêm lại onError để load ảnh mạng nếu chưa có ảnh ở ổ cứng */}
        <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-sm border border-line/50 bg-app flex items-center justify-center">
          <img 
            src="/assets/panda-studying.png" 
            alt="Panda studying" 
            className="w-full h-48 md:h-64 object-cover mix-blend-multiply dark:mix-blend-overlay opacity-90"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1564349683136-5c565fb7107c?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-main">Recommended Quizzes</h2>
        <button className="text-brand text-sm font-bold hover:underline">View All</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Render danh sách an toàn */}
          {hasQuizzes ? (
            quizzes.map((quiz, index) => (
              <div key={quiz.id} className="bg-surface border border-line rounded-[1.5rem] p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${index % 2 === 0 ? 'bg-brand/10 text-brand' : 'bg-orange-500/10 text-orange-600 dark:text-orange-500'}`}>
                    {quiz.focus}
                  </span>
                  <div className="flex items-center gap-1 text-sub text-xs font-medium"><Clock className="w-3.5 h-3.5" /> {quiz.duration}m</div>
                </div>
                <h3 className="text-xl font-bold text-main mb-2">{quiz.title}</h3>
                <p className="text-sub text-sm mb-6 line-clamp-2">{quiz.description}</p>
                <div className="flex justify-between items-center border-t border-line pt-4">
                  <div className="flex items-center gap-2 text-sm text-sub font-medium">
                    <BookOpen className="w-4 h-4" /> {quiz.questionCount} Questions
                  </div>
                  <button onClick={() => onStart(quiz.id)} className="text-brand border border-brand/30 hover:bg-brand/5 px-4 py-1.5 rounded-full text-sm font-bold transition-colors">
                    Start Quiz
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center text-sub py-10 bg-surface rounded-2xl border border-dashed border-line">
              Chưa có bài kiểm tra nào được tìm thấy.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
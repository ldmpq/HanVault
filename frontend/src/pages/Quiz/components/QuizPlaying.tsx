import { useState} from 'react';
import { GraduationCap, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface QuizPlayingProps {
  questions: any[];
  isLoading: boolean;
  onFinish: (answers: Record<number, string>, timeSpent: number) => void;
}

export default function QuizPlaying({ questions, isLoading, onFinish }: QuizPlayingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime] = useState(Date.now());

  if (isLoading || questions.length === 0) {
    return <div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>;
  }

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentQ.id]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onFinish(answers, timeSpent);
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto pb-24 px-4 pt-6 animate-fade-in flex flex-col min-h-[80vh]">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2 text-xs font-bold text-sub tracking-wider uppercase">
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full h-2 bg-line rounded-full overflow-hidden flex">
          <div className="h-full bg-gradient-to-r from-orange-400 to-brand rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-sm relative mb-6 flex-1">
        <div className="absolute top-6 right-6 bg-app border border-line text-sub text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5" /> HSK {currentQ.hskLevel || 1}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-main mb-8">Nghĩa của từ này là gì?</h2>
        <div className="text-7xl md:text-8xl font-bold text-brand mb-6 leading-none">{currentQ.character}</div>
        <div className="text-lg text-sub italic font-medium">{currentQ.pinyin}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {currentQ.options?.map((opt: string, i: number) => {
          const isSelected = answers[currentQ.id] === opt;
          return (
            <button 
              key={i} 
              onClick={() => handleSelect(opt)}
              className={`border rounded-2xl p-5 flex items-center justify-between group transition-all text-left ${isSelected ? 'border-brand bg-brand/5' : 'bg-surface border-line hover:border-brand/50'}`}
            >
              <span className={`font-medium transition-colors ${isSelected ? 'text-brand' : 'text-main'}`}>{opt}</span>
              <div className={`w-5 h-5 rounded-full border-2 transition-colors ${isSelected ? 'border-brand bg-brand' : 'border-line group-hover:border-brand'}`}></div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between items-center mt-auto pt-6 border-t border-line">
        <button 
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 text-sub hover:text-main font-bold text-sm transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <button 
          onClick={handleNext}
          className="bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
        >
          {currentIndex === questions.length - 1 ? 'Submit' : 'Next'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
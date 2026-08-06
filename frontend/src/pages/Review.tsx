import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, Star, Pause, AlertTriangle, Clock } from 'lucide-react';
import { useReviewSession } from '../shared/hooks/useReviewSession';
import { useTextToSpeech } from '../shared/hooks/useTextToSpeech';
import StudyComplete from '../components/StudyComplete'; 

export default function Review() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  
  const { 
    session, currentIndex, isFlipped, setIsFlipped, isFinished, 
    isLoading, error, handleRate, restartSession, isPaused, setIsPaused 
  } = useReviewSession(deckId);
  
  const { playAudio } = useTextToSpeech();

  const [reviewStats, setReviewStats] = useState({ correct: 0, dueNext: 0 });
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isLoading || error || isFinished || isPaused) return;
    
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, error, isFinished, isPaused]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const onRateCard = (rating: number) => {
    const currentCard = session?.cards?.[currentIndex];
    
    if (currentCard?.nextIntervals) {
      const interval = 
        rating === 1 ? currentCard.nextIntervals.again :
        rating === 3 ? currentCard.nextIntervals.hard :
        rating === 4 ? currentCard.nextIntervals.good :
        currentCard.nextIntervals.easy;

      setReviewStats(prev => ({
        correct: prev.correct + (rating > 1 ? 1 : 0), 
        dueNext: prev.dueNext + ((interval !== undefined && interval <= 1) ? 1 : 0) 
      }));
    }
    handleRate(rating);
  };

  const handleRestartDeck = () => {
    setReviewStats({ correct: 0, dueNext: 0 });
    setElapsedTime(0);
    restartSession();
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500 font-medium animate-pulse">Đang khởi tạo phiên học...</div>;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in px-4 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Đã xảy ra lỗi</h2>
        <p className="text-gray-600 mb-8 max-w-md">{error}</p>
        <button onClick={() => navigate(`/deck/${deckId}`)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3.5 rounded-xl font-bold transition-colors">
          Quay lại Bộ thẻ
        </button>
      </div>
    );
  }
  if (!deckId) return <div className="flex flex-col items-center justify-center py-32"><h2 className="text-3xl font-bold">Vui lòng chọn một bộ bài để ôn tập</h2></div>;

  if (isFinished) {
    return (
      <StudyComplete 
        totalWords={session?.cards?.length || 0}
        correctWords={reviewStats.correct}
        dueNext={reviewStats.dueNext}
        elapsedTime={elapsedTime}
        onRestart={handleRestartDeck}
      />
    );
  }

  // FLASHCARD REVIEWING
  const card = session?.cards?.[currentIndex];
  if (!card) return <div>Lỗi hiển thị thẻ</div>;

  const totalCards = session?.cards?.length || 1;
  const currentCardNumber = currentIndex + 1;
  const displayMeaning = card.meanings?.[0]?.meaning || card.meaning || 'Đang cập nhật nghĩa...';

  const formatTimeInterval = (days?: number) => {
    if (days === undefined || days < 1) return '< 10m';
    if (days < 30) return `${days}d`;
    if (days < 365) return `${Math.round(days / 30)}mo`;
    return `${(days / 365).toFixed(1)}y`;
  };

  return (
    <div className="relative w-full min-h-[85vh] bg-[#FCFAF8] flex flex-col items-center py-10 px-4 font-sans animate-fade-in overflow-hidden">
      
      {/* OVERLAY KHI TẠM DỪNG */}
      {isPaused && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-fade-in max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-50 text-[#A82B2B] rounded-full flex items-center justify-center mb-4">
              <Pause className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã tạm dừng</h2>
            <p className="text-gray-500 mb-8 text-sm">Bạn có thể nghỉ ngơi một chút. Tiến trình học và đồng hồ đếm giờ đã được lưu lại.</p>
            <button 
              onClick={() => setIsPaused(false)}
              className="w-full py-3.5 bg-[#A82B2B] text-white font-bold rounded-xl hover:bg-[#8b2323] transition-colors shadow-sm"
            >
              Tiếp tục học (Enter)
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-3 px-1">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Vocabulary Review</h2>
              <p className="text-xs font-medium text-gray-600 flex items-center gap-2">
                <span>{currentCardNumber} / {totalCards} Cards</span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 text-[#A82B2B] bg-red-50 px-2 py-0.5 rounded-md font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTimer(elapsedTime)}
                </span>
              </p>
            </div>
            <button onClick={() => setIsPaused(true)} className="text-gray-500 hover:text-[#A82B2B] transition-colors">
              <Pause className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-[#A82B2B] transition-all duration-300" style={{ width: `${(currentCardNumber / totalCards) * 100}%` }}></div>
          </div>
        </div>

        {/* 3D Flashcard */}
        <div className="w-full aspect-[4/3] md:aspect-video cursor-pointer mb-6 select-none" style={{ perspective: '1200px' }} onClick={() => setIsFlipped(prev => !prev)}>
          <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform duration-700" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            
            <div className="absolute inset-0 w-full h-full bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 flex flex-col items-center border border-gray-100" style={{ backfaceVisibility: 'hidden' }}>
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-[100px] md:text-[140px] font-normal text-gray-900 leading-none">{card.simplified}</h1>
              </div>
              <span className="text-gray-400 text-base md:text-lg font-medium mb-4">Tap to reveal</span>
            </div>

            <div className="absolute inset-0 w-full h-full bg-white rounded-[1.5rem] md:rounded-[2rem] p-10 flex flex-col border border-gray-100 overflow-y-auto custom-scrollbar" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-5xl font-medium text-gray-900 mb-2">{card.simplified}</h1>
                  <p className="text-2xl text-[#A82B2B] font-medium">{card.pinyin}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={(e) => {e.stopPropagation(); playAudio(e, card.simplified);}} className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"><Volume2 className="w-5 h-5" /></button>
                  <button onClick={(e) => e.stopPropagation()} className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"><Star className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">{card.partOfSpeech || 'Vocabulary'}</p>
                <h2 className="text-2xl font-medium text-gray-800 mb-8">{displayMeaning}</h2>

                {card.examples && card.examples?.length > 0 && (
                  <div className="bg-[#FCFAF8] rounded-2xl p-6 border border-gray-100">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-3">Example</span>
                    <p className="text-lg text-gray-900 mb-1">{card.examples[0]?.ch}</p>
                    <p className="text-gray-500 text-sm mb-2">{card.examples[0]?.py}</p>
                    <p className="text-gray-700 text-sm">{card.examples[0]?.en || 'Chưa cập nhật bản dịch'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nút Đánh Giá */}
        <div className={`w-full transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="grid grid-cols-4 gap-3 md:gap-5">
            <button onClick={() => onRateCard(1)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FFF1F0] text-[#E09090] hover:brightness-95 transition-all">
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Again</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.again)}</span>
            </button>
            <button onClick={() => onRateCard(3)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FCE4CD] text-[#D4A373] hover:brightness-95 transition-all">
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Hard</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.hard)}</span>
            </button>
            <button onClick={() => onRateCard(4)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#EBE2AB] text-[#B0A775] hover:brightness-95 transition-all">
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Good</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.good)}</span>
            </button>
            <button onClick={() => onRateCard(5)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FFF0F2] text-[#DB9AA9] hover:brightness-95 transition-all">
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Easy</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTimeInterval(card.nextIntervals?.easy)}</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center hidden md:block">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Press <span className="text-gray-500">ENTER</span> to pause • Press <span className="text-gray-500">SPACE</span> to flip • Press <span className="text-gray-500">1-4</span> to rate
          </p>
        </div>
      </div>
    </div>
  );
}
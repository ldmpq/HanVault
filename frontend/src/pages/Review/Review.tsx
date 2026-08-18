import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useReviewSession } from './hooks/useReviewSession';
import { useTextToSpeech } from '../../shared/hooks/useTextToSpeech';
import { useReviewTimer } from './hooks/useReviewTimer';

import PauseOverlay from './components/PauseOverlay';
import ReviewHeader from './components/ReviewHeader';
import Flashcard3D from './components/Flashcard3D';
import RatingControls from './components/RatingControls';
import StudyComplete from './components/StudyComplete'; 
import ReviewDeckSelector from './components/ReviewDeckSelector'; 

export default function Review() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  if (!deckId) {
    return <ReviewDeckSelector />;
  }

  const { 
    session, currentIndex, isFlipped, setIsFlipped, isFinished, 
    isLoading, error, handleRate, restartSession, isPaused, setIsPaused 
  } = useReviewSession(deckId);
  
  const { playAudio } = useTextToSpeech();
  
  const { reviewStats, setReviewStats, elapsedTime, setElapsedTime } = useReviewTimer(
    isLoading, error, isFinished, isPaused
  );

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

  const card = session?.cards?.[currentIndex];
  if (!card) return <div>Lỗi hiển thị thẻ</div>;

  const totalCards = session?.cards?.length || 1;
  const currentCardNumber = currentIndex + 1;
  const displayMeaning = card.meanings?.[0]?.meaning || card.meaning || 'Đang cập nhật nghĩa...';

  if (isLoading) return <div className="text-center py-20 text-sub font-medium animate-pulse">Đang khởi tạo phiên học...</div>;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in px-4 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-3xl font-bold text-main mb-4">Oops! Đã xảy ra lỗi</h2>
        <p className="text-sub mb-8 max-w-md">{error}</p>
        <button onClick={() => navigate(`/deck/${deckId}`)} className="bg-line/50 hover:bg-line text-main px-8 py-3.5 rounded-xl font-bold transition-colors">
          Quay lại Bộ thẻ
        </button>
      </div>
    );
  }

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

  return (
    <div className="relative w-full min-h-[85vh] bg-app text-main flex flex-col items-center py-10 px-4 font-sans animate-fade-in overflow-hidden transition-colors">
      
      <PauseOverlay isPaused={isPaused} setIsPaused={setIsPaused} />

      <div className="w-full max-w-3xl">
        <ReviewHeader 
          currentCardNumber={currentCardNumber} totalCards={totalCards} 
          elapsedTime={elapsedTime} setIsPaused={setIsPaused} 
        />

        <Flashcard3D 
          card={card} isFlipped={isFlipped} setIsFlipped={setIsFlipped} 
          playAudio={playAudio} displayMeaning={displayMeaning} 
        />

        <RatingControls 
          isFlipped={isFlipped} onRateCard={onRateCard} card={card} 
        />
      </div>
    </div>
  );
}
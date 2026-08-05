import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, Star, Pause, AlertTriangle, Award, Flame, GraduationCap, Target, CalendarClock, ArrowLeft, ArrowRight} from 'lucide-react';
import { useReviewSession } from '../shared/hooks/useReviewSession';
import { useTextToSpeech } from '../shared/hooks/useTextToSpeech';

export default function Review() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  
  const { session, currentIndex, isFlipped, setIsFlipped, isFinished, isLoading, error, handleRate } = useReviewSession(deckId);
  const { playAudio } = useTextToSpeech();

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
  if (!deckId) return <div className="flex flex-col items-center justify-center py-32"><h2 className="text-3xl font-bold">Chưa chọn bộ bài</h2></div>;
  
  // ==========================================
  // MÀN HÌNH HOÀN THÀNH (COMPLETION SCREEN)
  // ==========================================
  if (isFinished) {
    const totalWords = session?.cards?.length || 0;
    // Tạm thời dùng dữ liệu giả lập cho UI, bạn có thể map dữ liệu thật từ session hook sau
    const accuracyRate = 94; 
    const dueNext = 12;

    return (
      <div className="w-full min-h-[85vh] bg-[#FCFAF8] flex flex-col items-center justify-center py-10 px-4 font-sans animate-fade-in relative overflow-hidden">
        
        {/* Hiệu ứng ánh sáng nền (Background Glow) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-96 h-96 bg-red-50 rounded-full blur-[100px] opacity-80"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-3xl w-full">
          
          {/* Cụm Icon Huy hiệu */}
          <div className="relative flex justify-center mb-8">
            <div className="absolute top-10 -left-6 w-8 h-8 bg-[#FCE8B2] rounded-full flex items-center justify-center shadow-sm z-20">
              <Flame className="w-4 h-4 text-[#E37400] fill-current" />
            </div>
            <div className="absolute -top-2 -right-6 w-10 h-10 bg-[#FFEFE5] rounded-full flex items-center justify-center shadow-sm z-20">
              <Star className="w-5 h-5 text-[#E07A5F] fill-current" />
            </div>
            
            <div className="w-28 h-28 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center relative z-10">
              <Award className="w-12 h-12 text-[#A82B2B]" strokeWidth={2.5} />
            </div>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#A82B2B] mb-4 text-center tracking-tight">
            Study Session Complete!
          </h1>
          <p className="text-gray-600 text-center max-w-md mb-12 text-sm md:text-base leading-relaxed">
            Outstanding work. You've reinforced your memory and moved closer to your HSK goals.
          </p>

          {/* 3 Thẻ Thống Kê */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mb-12 w-full max-w-2xl justify-center">
            
            {/* Card 1: Words Reviewed */}
            <div className="flex-1 bg-white rounded-[1rem] p-6 flex flex-col items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5 text-[#A82B2B]" />
              </div>
              <span className="text-3xl font-bold text-gray-900 mb-1">{totalWords}</span>
              <span className="text-xs font-medium text-gray-500">Words Reviewed</span>
            </div>

            {/* Card 2: Accuracy Rate (Nổi bật) */}
            <div className="flex-1 bg-white rounded-[1rem] p-6 flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(168,43,43,0.08)] border-[1.5px] border-[#A82B2B] relative overflow-hidden scale-105 z-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full opacity-50 -z-0"></div>
              <div className="w-10 h-10 bg-[#FCE8B2] rounded-full flex items-center justify-center mb-4 relative z-10">
                <Target className="w-5 h-5 text-[#D97706]" />
              </div>
              <span className="text-3xl font-bold text-[#A82B2B] mb-1 relative z-10">{accuracyRate}%</span>
              <span className="text-xs font-medium text-gray-500 relative z-10">Accuracy Rate</span>
            </div>

            {/* Card 3: Due Next 24h */}
            <div className="flex-1 bg-white rounded-[1rem] p-6 flex flex-col items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                <CalendarClock className="w-5 h-5 text-[#CA8A04]" />
              </div>
              <span className="text-3xl font-bold text-gray-900 mb-1">+{dueNext}</span>
              <span className="text-xs font-medium text-gray-500">Due Next 24h</span>
            </div>
          </div>

          {/* Các nút điều hướng */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/library')} 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#A82B2B] px-8 py-3.5 rounded-xl font-medium hover:bg-gray-50 hover:border-[#A82B2B] transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Dashboard
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#A82B2B] text-white px-8 py-3.5 rounded-xl font-medium hover:bg-[#8b2323] transition-colors shadow-sm"
            >
              Continue Learning <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // MÀN HÌNH LẬT THẺ FLASHCARD
  // ==========================================
  const card = session?.cards?.[currentIndex];
  if (!card) return <div>Lỗi hiển thị thẻ</div>;

  const totalCards = session?.cards?.length || 1;
  const currentCardNumber = currentIndex + 1;
  const remainingMins = Math.ceil((totalCards - currentIndex) * 0.5);
  const displayMeaning = card.meanings?.[0]?.meaning || card.meaning || 'Đang cập nhật nghĩa...';

  const formatTime = (days?: number) => {
    if (days === undefined || days < 1) return '< 10m';
    if (days < 30) return `${days}d`;
    if (days < 365) return `${Math.round(days / 30)}mo`;
    return `${(days / 365).toFixed(1)}y`;
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#FCFAF8] flex flex-col items-center py-10 px-4 font-sans animate-fade-in">
      <div className="w-full max-w-3xl">
        
        {/* Tiến trình */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-3 px-1">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Vocabulary Review</h2>
              <p className="text-xs font-medium text-gray-800">{currentCardNumber} / {totalCards} Cards • ~{remainingMins} mins remaining</p>
            </div>
            <button className="text-gray-500 hover:text-gray-800 transition-colors"><Pause className="w-5 h-5" /></button>
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
            <button onClick={() => handleRate(1)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FFF1F0] text-[#E09090] hover:brightness-95 transition-all">
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Again</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTime(card.nextIntervals?.again)}</span>
            </button>
            <button onClick={() => handleRate(3)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FCE4CD] text-[#D4A373] hover:brightness-95 transition-all">
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Hard</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTime(card.nextIntervals?.hard)}</span>
            </button>
            <button onClick={() => handleRate(4)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#EBE2AB] text-[#B0A775] hover:brightness-95 transition-all">
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Good</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTime(card.nextIntervals?.good)}</span>
            </button>
            <button onClick={() => handleRate(5)} className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FFF0F2] text-[#DB9AA9] hover:brightness-95 transition-all">
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Easy</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">{formatTime(card.nextIntervals?.easy)}</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center hidden md:block">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Press <span className="text-gray-500">SPACE</span> to flip • Press <span className="text-gray-500">1-4</span> to rate
          </p>
        </div>
      </div>
    </div>
  );
}
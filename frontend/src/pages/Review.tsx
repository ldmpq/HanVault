import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, Star, CheckCircle2, Pause, AlertTriangle } from 'lucide-react';
import axiosClient from '../shared/api/axiosClient';

interface Card {
  id: number;
  simplified: string;
  pinyin: string;
  isNew: boolean;
  meanings?: { meaning: string }[];
  meaning?: string;                 
  partOfSpeech?: string;
  examples?: { ch: string; py: string; en: string }[];
}

export default function Review() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<{ sessionId: number; cards: Card[] } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  const logsRef = useRef<any[]>([]);

  // 1. Tải phiên học
  useEffect(() => {
    if (!deckId) {
      setIsLoading(false);
      return;
    }

    const startStudy = async () => {
      try {
        setError(null);
        const response = await axiosClient.get(`/srs/decks/${deckId}/study`);
        
        if (response.data.success && response.data.data?.totalCards > 0) {
          setSession(response.data.data);
          logsRef.current = [];
        } else {
          setIsFinished(true);
        }
      } catch (err: any) {
        console.error('Lỗi khi tải phiên học:', err);
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi kết nối API tải thẻ bài.');
      } finally {
        setIsLoading(false);
      }
    };
    startStudy();
  }, [deckId]);

  // 2. Chấm điểm SRS 
  const handleRate = useCallback(async (quality: number) => {
    if (!session || isFinished) return;
    
    const currentCard = session.cards[currentIndex];
    const isCorrect = quality >= 3;

    try {
      await axiosClient.post('/srs/review', {
        vocabularyId: currentCard.id,
        quality: quality
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật thuật toán SRS:', error);
    }

    logsRef.current.push({
      vocabularyId: currentCard.id,
      isCorrect,
      responseQuality: quality,
      responseTimeMs: 0
    });

    setIsFlipped(false);

    setTimeout(async () => {
      if (currentIndex < session.cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        await endStudySession(session.sessionId, session.cards.length, logsRef.current);
      }
    }, 200);

  }, [session, currentIndex, isFinished]);

  // 3. Kết thúc phiên học
  const endStudySession = async (sessionId: number, totalCards: number, finalLogs: any[]) => {
    try {
      const correctWords = finalLogs.filter(l => l.isCorrect).length;
      await axiosClient.post(`/srs/sessions/${sessionId}/end`, {
        totalWords: totalCards,
        correctWords,
        logs: finalLogs
      });
      setIsFinished(true);
    } catch (error) {
      console.error('Lỗi khi kết thúc phiên:', error);
    }
  };

  // 4. Hàm phát âm thanh (Web Speech API)
  const handlePlayAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Ngăn sự kiện click làm lật thẻ
    if (!text) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; 
      utterance.rate = 0.9;     
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Lỗi phát âm thanh:", error);
    }
  };

  // 5. Lắng nghe phím tắt Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || !deckId || error) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
      
      if (isFlipped) {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(3);
        if (e.key === '3') handleRate(4);
        if (e.key === '4') handleRate(5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isFinished, handleRate, deckId, error]);

  // ================= UI STATES =================
  if (isLoading) return <div className="text-center py-20 text-gray-500">Đang khởi tạo phiên học...</div>;

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

  if (!deckId) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Chưa chọn bộ bài</h2>
        <p className="text-gray-600 mb-8">Vui lòng vào Thư viện và chọn một bộ từ vựng để bắt đầu ôn tập.</p>
        <button onClick={() => navigate('/library')} className="bg-[#A82B2B] hover:bg-[#8b2323] text-white px-8 py-3.5 rounded-full font-bold transition-colors">
          Đi tới Thư viện
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in px-4 text-center">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">You're all caught up!</h2>
        <p className="text-gray-600 mb-8">Bạn đã hoàn thành tất cả thẻ cần ôn tập hôm nay.</p>
        <button onClick={() => navigate('/library')} className="bg-[#A82B2B] hover:bg-[#8b2323] text-white px-8 py-3.5 rounded-full font-bold transition-colors">
          Quay lại Thư viện
        </button>
      </div>
    );
  }

  const card = session?.cards?.[currentIndex];
  
  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lỗi hiển thị thẻ</h2>
        <p className="text-gray-600 mb-8">Không tìm thấy dữ liệu cho thẻ vựng này.</p>
        <button onClick={() => navigate('/library')} className="bg-[#A82B2B] text-white px-8 py-3.5 rounded-full font-bold transition-colors">
          Quay lại Thư viện
        </button>
      </div>
    );
  }

  const totalCards = session?.cards?.length || 1;
  const currentCardNumber = currentIndex + 1;
  const remainingMins = Math.ceil((totalCards - currentIndex) * 0.5);
  const displayMeaning = card.meanings?.[0]?.meaning || card.meaning || 'Đang cập nhật nghĩa...';

  return (
    <div className="w-full min-h-[85vh] bg-[#FCFAF8] flex flex-col items-center py-10 px-4 font-sans animate-fade-in">
      
      <div className="w-full max-w-3xl">
        
        {/* ================= HEADER & PROGRESS BAR ================= */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-3 px-1">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Vocabulary Review</h2>
              <p className="text-xs font-medium text-gray-800">
                {currentCardNumber} / {totalCards} Cards • ~{remainingMins} mins remaining
              </p>
            </div>
            <button className="text-gray-500 hover:text-gray-800 transition-colors">
              <Pause className="w-5 h-5" />
            </button>
          </div>
          
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-[#A82B2B] transition-all duration-300"
              style={{ width: `${(currentCardNumber / totalCards) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* ================= KHUNG LẬT THẺ 3D ================= */}
        <div 
          className="w-full aspect-[4/3] md:aspect-video cursor-pointer mb-6 select-none"
          style={{ perspective: '1200px' }}
          onClick={() => setIsFlipped(prev => !prev)}
        >
          <div 
            className="relative w-full h-full rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform duration-700"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* MẶT TRƯỚC: TỐI GIẢN THEO ẢNH */}
            <div 
              className="absolute inset-0 w-full h-full bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 flex flex-col items-center border border-gray-100"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-[100px] md:text-[140px] font-normal text-gray-900 leading-none">
                  {card.simplified}
                </h1>
              </div>
              <span className="text-gray-400 text-base md:text-lg font-medium mb-4">
                Tap to reveal
              </span>
            </div>

            {/* MẶT SAU: HIỂN THỊ NGHĨA */}
            <div 
              className="absolute inset-0 w-full h-full bg-white rounded-[1.5rem] md:rounded-[2rem] p-10 flex flex-col border border-gray-100 overflow-y-auto custom-scrollbar"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-5xl font-medium text-gray-900 mb-2">{card.simplified}</h1>
                  <p className="text-2xl text-[#A82B2B] font-medium">{card.pinyin}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={(e) => handlePlayAudio(e, card.simplified)} 
                    className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()} 
                    className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">{card.partOfSpeech || 'Vocabulary'}</p>
                <h2 className="text-2xl font-medium text-gray-800 mb-8">
                  {displayMeaning}
                </h2>

                {card.examples && card.examples?.length > 0 && (
                  <div className="bg-[#FCFAF8] rounded-2xl p-6 border border-gray-100">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-3">
                      Example
                    </span>
                    <p className="text-lg text-gray-900 mb-1">{card.examples[0]?.ch}</p>
                    <p className="text-gray-500 text-sm mb-2">{card.examples[0]?.py}</p>
                    <p className="text-gray-700 text-sm">{card.examples[0]?.en || 'Chưa cập nhật bản dịch'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= NÚT ĐÁNH GIÁ PASTEL ================= */}
        <div className={`w-full transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="grid grid-cols-4 gap-3 md:gap-5">
            <button 
              onClick={() => handleRate(1)} 
              className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FFF1F0] text-[#E09090] hover:brightness-95 transition-all"
            >
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Again</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">&lt; 1m</span>
            </button>
            <button 
              onClick={() => handleRate(3)} 
              className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FCE4CD] text-[#D4A373] hover:brightness-95 transition-all"
            >
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Hard</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">6m</span>
            </button>
            <button 
              onClick={() => handleRate(4)} 
              className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#EBE2AB] text-[#B0A775] hover:brightness-95 transition-all"
            >
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Good</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">10m</span>
            </button>
            <button 
              onClick={() => handleRate(5)} 
              className="flex flex-col items-center justify-center py-4 md:py-5 rounded-2xl bg-[#FFF0F2] text-[#DB9AA9] hover:brightness-95 transition-all"
            >
              <span className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Easy</span>
              <span className="text-[10px] md:text-xs font-medium opacity-80">4d</span>
            </button>
          </div>
        </div>

        {/* Chú thích bàn phím (Ẩn trên mobile) */}
        <div className="mt-8 text-center hidden md:block">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Press <span className="text-gray-500">SPACE</span> to flip • Press <span className="text-gray-500">1-4</span> to rate
          </p>
        </div>

      </div>
    </div>
  );
}
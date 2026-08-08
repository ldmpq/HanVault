import { Book, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeaturedDecksProps {
  carouselDecks: any[];
  dailyDeck: any;
  currentSlide: number;
  setCurrentSlide: (idx: number) => void;
  CAROUSEL_IMAGES: string[];
  DAILY_IMAGES: string[];
}

export default function FeaturedDecks({
  carouselDecks, dailyDeck, currentSlide, setCurrentSlide, CAROUSEL_IMAGES, DAILY_IMAGES
}: FeaturedDecksProps) {
  const navigate = useNavigate();
  
  if (carouselDecks.length === 0) return null;

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-main mb-6">Bộ sưu tập nổi bật</h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <div className="md:col-span-8 relative rounded-[2rem] overflow-hidden shadow-sm h-[280px] bg-black group border border-line/50">
          {carouselDecks.map((deck, idx) => {
            const isActive = idx === currentSlide;
            const bgImg = CAROUSEL_IMAGES[idx % CAROUSEL_IMAGES.length];
            return (
              <div 
                key={deck.id} 
                onClick={() => navigate(`/deck/${deck.id}`)} 
                className={`absolute inset-0 transition-opacity duration-1000 cursor-pointer ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img src={bgImg} alt={deck.title} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ${isActive ? 'scale-110' : 'scale-100'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                {deck.level && <div className="absolute top-6 right-6 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">HSK {deck.level}</div>}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1 block">{deck.tag || 'Bộ thẻ Nổi bật'}</span>
                  <h3 className="text-3xl font-bold text-white mb-2 truncate">{deck.title}</h3>
                  <div className="flex gap-4 text-xs font-medium text-white/90">
                    <span className="flex items-center gap-1"><Book className="w-3.5 h-3.5" /> {deck.words} Từ vựng</span>
                    <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Bắt đầu học</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            {carouselDecks.map((_, idx) => (
              <button 
                key={idx} 
                onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-brand' : 'w-2 bg-white/50 hover:bg-white/80'}`} 
              />
            ))}
          </div>
        </div>

        {dailyDeck && (
          <div onClick={() => navigate(`/deck/${dailyDeck.id}`)} className="md:col-span-4 bg-surface rounded-[2rem] overflow-hidden shadow-sm border border-line flex flex-col group cursor-pointer hover:shadow-md hover:border-brand/30 transition-all">
            <div className="relative h-32 overflow-hidden bg-line/50">
              <img src={DAILY_IMAGES[dailyDeck.id % DAILY_IMAGES.length]} alt={dailyDeck.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <span className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1 block">Gợi ý hôm nay</span>
              <h3 className="text-lg font-bold text-main mb-2 line-clamp-1" title={dailyDeck.title}>{dailyDeck.title}</h3>
              <p className="text-xs text-sub mb-6 flex-1 line-clamp-2 leading-relaxed">{dailyDeck.description || 'Khám phá bộ thẻ từ vựng thú vị dành riêng cho ngày hôm nay để mở rộng vốn từ của bạn.'}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-sub flex items-center gap-1"><Book className="w-3.5 h-3.5" /> {dailyDeck.words} từ</span>
                <button className="bg-line/50 group-hover:bg-brand group-hover:text-white text-main text-xs font-bold px-5 py-2 rounded-lg transition-colors">Khám phá</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
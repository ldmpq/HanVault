import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface ProfileFavoriteDecksProps {
  favoriteDecks: any[];
}

export default function ProfileFavoriteDecks({ favoriteDecks }: ProfileFavoriteDecksProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-line">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-main">Bộ thẻ yêu thích</h3>
        {favoriteDecks.length > 0 && (
          <button onClick={() => navigate('/library')} className="text-sm font-bold text-brand hover:underline">
            View All
          </button>
        )}
      </div>

      {favoriteDecks.length === 0 ? (
        <div className="bg-app rounded-2xl p-8 border border-line text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-line rounded-full flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-sub" />
          </div>
          <h4 className="text-main font-bold mb-1">Chưa có bộ thẻ yêu thích</h4>
          <p className="text-sub text-sm mb-4">Hãy khám phá thư viện và lưu lại những bộ thẻ bạn quan tâm.</p>
          <button 
            onClick={() => navigate('/library')}
            className="bg-brand text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-brand-hover transition-colors"
          >
            Đến thư viện
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {favoriteDecks.map(deck => (
            <div key={deck.id} onClick={() => navigate(`/deck/${deck.id}`)} className="bg-app rounded-2xl p-5 border border-line hover:border-brand/30 cursor-pointer transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-main line-clamp-2 pr-2">{deck.title || deck.name}</h4>
                {deck.level && <span className="bg-brand/10 text-brand text-[10px] font-bold px-2 py-1 rounded border border-brand/20">H{deck.level}</span>}
              </div>
              <p className="text-xs text-sub mb-6 font-medium">{deck.words || 0} Cards</p>
              <div className="flex justify-between text-[10px] font-bold text-sub mb-2">
                <span>Progress</span><span>{deck.progress || 0}%</span>
              </div>
              <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full" style={{ width: `${deck.progress || 0}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
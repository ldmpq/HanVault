import { useNavigate } from 'react-router-dom';

interface ProfileFavoriteDecksProps {
  favoriteDecks: any[];
}

export default function ProfileFavoriteDecks({ favoriteDecks }: ProfileFavoriteDecksProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-line">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-main">Favorite Decks</h3>
        <button onClick={() => navigate('/library')} className="text-sm font-bold text-brand hover:underline">View All</button>
      </div>

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
    </div>
  );
}
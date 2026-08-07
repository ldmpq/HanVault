import { useNavigate } from 'react-router-dom';

interface ProfileFavoriteDecksProps {
  favoriteDecks: any[];
}

export default function ProfileFavoriteDecks({ favoriteDecks }: ProfileFavoriteDecksProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Favorite Decks</h3>
        <button onClick={() => navigate('/library')} className="text-sm font-bold text-[#A82B2B] hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {favoriteDecks.map(deck => (
          <div key={deck.id} onClick={() => navigate(`/deck/${deck.id}`)} className="bg-[#FCFAF8] rounded-2xl p-5 border border-gray-100 hover:border-red-200 cursor-pointer transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-gray-900 line-clamp-2 pr-2">{deck.title || deck.name}</h4>
              {deck.level && <span className="bg-red-50 text-[#A82B2B] text-[10px] font-bold px-2 py-1 rounded">H{deck.level}</span>}
            </div>
            <p className="text-xs text-gray-500 mb-6 font-medium">{deck.words || 0} Cards</p>
            <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-2">
              <span>Progress</span><span>{deck.progress || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#A82B2B] rounded-full" style={{ width: `${deck.progress || 0}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
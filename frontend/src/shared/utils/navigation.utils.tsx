import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const renderBreadcrumbs = (
  locationState: any, 
  deckId: string, 
  deckName: string, 
  character: string | undefined
) => {
  if (!character) return null;

  if (locationState?.from === 'dictionary') {
    return (
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8 tracking-wide">
        <Link to="/dictionary" className="hover:text-gray-900 transition-colors">Từ điển</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900">{character}</span>
      </div>
    );
  }
  if (deckId) {
    return (
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8 tracking-wide">
        <Link to="/library" className="hover:text-gray-900 transition-colors">Bộ thẻ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/deck/${deckId}`} className="hover:text-gray-900 transition-colors">{deckName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900">{character}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8 tracking-wide">
      <Link to="/" className="hover:text-gray-900 transition-colors">Trang chủ</Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <span className="text-gray-900">{character}</span>
    </div>
  );
};
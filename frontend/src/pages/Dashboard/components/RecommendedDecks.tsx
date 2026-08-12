import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';

// Dữ liệu mẫu bám sát thiết kế (Sau này bạn có thể thay bằng dữ liệu fetch từ API)
const MOCK_DECKS = [
  {
    id: 1,
    icon: '食',
    tag: 'Food',
    title: 'Restaurant Essentials',
    words: 50,
    progress: 30, // Phần trăm hoàn thành
    isLocked: false,
    iconColor: 'text-orange-700',
    iconBg: 'bg-orange-100',
    tagColor: 'text-orange-700 bg-orange-50',
  },
  {
    id: 2,
    icon: '行',
    tag: 'Travel',
    title: 'Navigating the City',
    words: 120,
    progress: 0,
    isLocked: false,
    iconColor: 'text-pink-700',
    iconBg: 'bg-pink-100',
    tagColor: 'text-pink-700 bg-pink-50',
  },
  {
    id: 3,
    icon: '商',
    tag: 'Business',
    title: 'Office Small Talk',
    words: 85,
    progress: 60,
    isLocked: false,
    iconColor: 'text-amber-700',
    iconBg: 'bg-amber-100',
    tagColor: 'text-amber-700 bg-amber-50',
  },
  {
    id: 4,
    icon: <Lock className="w-5 h-5 text-neutral-400" />,
    tag: 'HSK 5',
    title: 'Advanced Idioms',
    words: 'Unlock at Level 5', // Trạng thái khóa hiển thị text khác
    progress: 0,
    isLocked: true,
    iconColor: 'text-neutral-500',
    iconBg: 'bg-neutral-100',
    tagColor: 'text-neutral-500 bg-neutral-100',
  },
];

export default function RecommendedDecks() {
  return (
    <section className="w-full mt-10">
      {/* Header & Điều hướng */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-main">Recommended Decks</h2>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-full border border-line text-sub hover:text-brand hover:border-brand transition-colors bg-surface">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1.5 rounded-full border border-line text-sub hover:text-brand hover:border-brand transition-colors bg-surface">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lưới danh sách các Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {MOCK_DECKS.map((deck) => (
          <div 
            key={deck.id} 
            className={`bg-surface p-6 rounded-2xl border border-line shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-44 ${
              deck.isLocked ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {/* Top row: Icon & Tag */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${deck.iconBg} ${deck.iconColor}`}>
                {deck.icon}
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${deck.tagColor}`}>
                {deck.tag}
              </span>
            </div>

            {/* Middle row: Info */}
            <div>
              <h3 className={`font-bold mb-1 line-clamp-1 ${deck.isLocked ? 'text-sub' : 'text-main'}`}>
                {deck.title}
              </h3>
              <p className="text-sm text-sub font-medium">
                {typeof deck.words === 'number' ? `${deck.words} words` : deck.words}
              </p>
            </div>

            {/* Bottom row: Progress Bar (Chỉ hiện khi chưa khóa) */}
            {!deck.isLocked && (
              <div className="w-full h-1 bg-line rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-amber-700 rounded-full" 
                  style={{ width: `${deck.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
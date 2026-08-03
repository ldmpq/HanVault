import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, GraduationCap, Clock } from 'lucide-react';
import axiosClient from '../shared/lib/axiosClient';
import type { Deck } from '../shared/types/deck.types';
import { getUIConfigForLevel } from '../shared/utils/hsk.utils';

const TABS = ['All Levels', 'HSK 1-2', 'HSK 3-4', 'HSK 5-6', 'Topics', 'My list'] as const;

function filterDecksByTab(decks: Deck[], tab: string): Deck[] {
  const level = (deck: Deck) => Number(deck.level);
  switch (tab) {
    case 'HSK 1-2': return decks.filter((d) => [1, 2].includes(level(d)));
    case 'HSK 3-4': return decks.filter((d) => [3, 4].includes(level(d)));
    case 'HSK 5-6': return decks.filter((d) => [5, 6].includes(level(d)));
    case 'My list': return decks.filter((d) => d.progress > 0);
    default: return decks;
  }
}

export default function Library() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('All Levels');
  const [searchTerm, setSearchTerm] = useState('');
  const [hskDecks, setHskDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axiosClient.get('/library/decks');
        if (response.data.success) {
          const formattedDecks = response.data.data.map((dbDeck: any) => ({
            ...dbDeck,
            ...getUIConfigForLevel(dbDeck.level),
          }));
          setHskDecks(formattedDecks);
        }
      } catch (error) {
        console.error('Lỗi khi tải thư viện:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDecks();
  }, []);

  const visibleDecks = useMemo(() => {
    const byTab = filterDecksByTab(hskDecks, activeTab);
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return byTab;
    return byTab.filter((deck) => deck.title?.toLowerCase().includes(keyword));
  }, [hskDecks, activeTab, searchTerm]);

  return (
    <div className="animate-fade-in pb-20 w-full max-w-[1200px] mx-auto">
      
      <div className="bg-[#F8F9FA] rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center mb-10 shadow-sm border border-gray-100 overflow-hidden">
        <div className="max-w-md z-10 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Bộ thẻ</h1>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Ôn tập từ vựng theo các bộ thẻ được thiết kế sẵn, phù hợp với từng trình độ HSK và chủ đề học tập.
            Chọn bộ thẻ bạn muốn học và bắt đầu hành trình nâng cao vốn từ vựng của mình ngay hôm nay!
          </p>
        </div>
        <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-sm">
          <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80" alt="Study Desk Illustration" className="w-full h-48 md:h-64 object-cover" />
        </div>
      </div>

      {/* FEATURED COLLECTIONS (Khôi phục toàn bộ) */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 relative rounded-[2rem] overflow-hidden shadow-sm h-[280px] group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80" alt="Great Wall" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute top-6 right-6 bg-[#A82B2B] text-white text-[10px] font-bold px-3 py-1 rounded-full">HSK 3</div>

            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1 block">Chinese Mandarin Great Wall Adventure</span>
              <h3 className="text-3xl font-bold text-white mb-2">Essential Daily Life</h3>
              <div className="flex gap-4 text-xs font-medium text-white/90">
                <span className="flex items-center gap-1"><Book className="w-3.5 h-3.5" /> 600 Words</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> 12.5k Learners</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
            <div className="relative h-32 overflow-hidden bg-gray-100">
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80" alt="Office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
              <div className="absolute top-4 right-4 bg-[#9A5A20] text-white text-[10px] font-bold px-3 py-1 rounded-full">Business</div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Business Etiquette</h3>
              <p className="text-xs text-gray-500 mb-6 flex-1">Master the terminology needed for successful meetings and negotiations.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 15 hrs</span>
                <button className="bg-[#A82B2B] hover:bg-[#8b2323] text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors">Start</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Library</h2>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeTab === tab ? 'bg-red-50 text-[#A82B2B] border border-red-100' : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400 font-medium">Đang tải thư viện...</div>
        ) : hskDecks.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">Chưa có bộ từ vựng nào trong hệ thống.</div>
        ) : visibleDecks.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            Không có bộ thẻ nào khớp với "{activeTab}"{searchTerm ? ` và từ khoá "${searchTerm}"` : ''}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleDecks.map((deck) => (
              <div key={deck.id} onClick={() => navigate(`/deck/${deck.id}`)} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 ${deck.bgColor} ${deck.iconColor} rounded-xl flex items-center justify-center border border-current/10`}><span className="font-bold text-lg leading-none">{deck.icon}</span></div>
                  <span className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full border border-gray-100">{deck.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{deck.title}</h3>
                <p className="text-xs text-gray-500 mb-6 flex-1 leading-relaxed">{deck.description || 'Bộ từ vựng cơ bản để bắt đầu hành trình học tập.'}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-3"><span className="text-sm font-bold text-[#A82B2B] leading-none">字</span>{deck.words || 150} từ</div>

                {deck.progress > 0 ? (
                  <>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4"><div className="h-full bg-[#A82B2B] rounded-full" style={{ width: `${deck.progress}%` }}></div></div>
                    <button className="w-full py-2.5 rounded-xl border border-[#A82B2B] text-[#A82B2B] font-bold text-xs hover:bg-red-50 transition-colors">Continue</button>
                  </>
                ) : (
                  <>
                    <div className="w-full h-1.5 bg-transparent mb-4"></div>
                    <button className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-500 font-bold text-xs hover:bg-gray-100 transition-colors">Start Deck</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
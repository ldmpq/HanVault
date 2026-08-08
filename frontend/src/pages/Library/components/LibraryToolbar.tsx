import { Search } from 'lucide-react';

interface LibraryToolbarProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
}

export default function LibraryToolbar({ 
  tabs, activeTab, setActiveTab, searchQuery, setSearchQuery, setCurrentPage 
}: LibraryToolbarProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-main">Thư viện</h2>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                activeTab === tab 
                  ? 'bg-brand/10 text-brand border-brand/20' 
                  : 'bg-surface text-sub border-line hover:bg-line/50 hover:text-main'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-sub" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm bộ thẻ theo tên..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="block w-full pl-11 pr-4 py-3 bg-surface border border-line text-main rounded-2xl text-sm placeholder-sub focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all shadow-sm"
        />
      </div>
    </>
  );
}
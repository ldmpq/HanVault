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
        <h2 className="text-3xl font-bold text-gray-900">Thư viện</h2>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeTab === tab ? 'bg-red-50 text-[#A82B2B] border border-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm bộ thẻ theo tên..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A82B2B]/20 focus:border-[#A82B2B] transition-all shadow-sm"
        />
      </div>
    </>
  );
}
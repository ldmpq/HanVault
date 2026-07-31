import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFilterBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  filterLabel?: string;
}

export default function SearchFilterBar({
  value,
  onChange,
  onFilterClick,
  placeholder = 'Bạn muốn tìm gì?',
  filterLabel = 'Bộ lọc nâng cao',
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-14 pr-6 py-4 bg-white rounded-full text-base focus:outline-none focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-400 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
        />
      </div>
      <button
        onClick={onFilterClick}
        className="w-full sm:w-auto bg-red-50 text-[#A82B2B] px-8 py-4 rounded-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" /> {filterLabel}
      </button>
    </div>
  );
}
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { generatePagination } from '../shared/utils/pagination.utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-16">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1} 
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#A82B2B] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {generatePagination(currentPage, totalPages).map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="w-8 h-10 flex items-end justify-center pb-2 text-gray-500 tracking-widest font-medium">...</span>
        ) : (
          <button 
            key={page} 
            onClick={() => onPageChange(page as number)} 
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${
              currentPage === page 
                ? 'bg-[#A82B2B] text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {page}
          </button>
        )
      ))}
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
        disabled={currentPage === totalPages} 
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#A82B2B] disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
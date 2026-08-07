import type { ElementType } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ElementType;
  colorClass?: string;
  bgClass?: string;
  isHighlighted?: boolean;
}

export default function StatCard({ label, value, icon: Icon, colorClass, bgClass, isHighlighted = false }: StatCardProps) {
  return (
    <div className={`bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] ${isHighlighted ? 'border-2 border-red-50 shadow-[0_8px_30px_rgb(168,43,43,0.06)]' : 'border border-[#ECE7E3]'}`}>
      {Icon && (
        <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center mb-5`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      {!Icon && isHighlighted && (
         <span className="text-xs font-bold text-[#A82B2B] uppercase tracking-widest block mb-2">{label}</span>
      )}
      {!Icon && !isHighlighted && (
         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">{label}</span>
      )}
      <span className="block text-3xl font-bold text-gray-900 mb-1">{value}</span>
      {Icon && <span className="text-xs font-bold text-gray-500">{label}</span>}
    </div>
  );
}
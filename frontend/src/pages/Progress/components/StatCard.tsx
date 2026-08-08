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
    <div className={`bg-surface rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all ${isHighlighted ? 'border-2 border-brand/30 shadow-[0_8px_30px_var(--color-brand)]/10' : 'border border-line'}`}>
      {Icon && (
        <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center mb-5`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      {!Icon && isHighlighted && (
         <span className="text-xs font-bold text-brand uppercase tracking-widest block mb-2">{label}</span>
      )}
      {!Icon && !isHighlighted && (
         <span className="text-xs font-bold text-sub uppercase tracking-widest block mb-2">{label}</span>
      )}
      <span className="block text-3xl font-bold text-main mb-1">{value}</span>
      {Icon && <span className="text-xs font-bold text-sub">{label}</span>}
    </div>
  );
}
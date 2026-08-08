interface RecentActivityProps {
  heatmapData?: Array<Array<number>>;
}

export default function RecentActivity({ heatmapData = [] }: RecentActivityProps) {
  return (
    <div className="bg-surface rounded-[24px] p-8 shadow-sm border border-line h-full">
      <h3 className="text-lg font-bold text-main mb-8">Review Activity</h3>
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-4">
        {heatmapData.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-2 shrink-0">
            {col.map((intensity, rowIdx) => {
              let bg = 'bg-line/50';
              if (intensity > 0.8) bg = 'bg-brand';
              else if (intensity > 0.6) bg = 'bg-brand/80';
              else if (intensity > 0.4) bg = 'bg-brand/50';
              else if (intensity > 0.2) bg = 'bg-brand/20';
              
              return <div key={`${colIdx}-${rowIdx}`} className={`w-4 h-4 rounded-[4px] ${bg} hover:ring-2 hover:ring-sub/30 transition-all cursor-pointer`} />
            })}
          </div>
        ))}
        {heatmapData.length === 0 && (
           <div className="text-sm text-sub w-full text-center py-6">Chưa có dữ liệu hoạt động.</div>
        )}
      </div>
      <div className="flex justify-end items-center text-[10px] text-sub font-bold uppercase tracking-widest mt-4 gap-2">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-line/50"></div>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-brand/20"></div>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-brand/50"></div>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-brand/80"></div>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-brand"></div>
        <span>More</span>
      </div>
    </div>
  );
}
interface RecentActivityProps {
  heatmapData?: Array<Array<number>>;
}

export default function RecentActivity({ heatmapData = [] }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3] h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-8">Review Activity</h3>
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-4">
        {heatmapData.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-2 shrink-0">
            {col.map((intensity, rowIdx) => {
              let bg = 'bg-gray-100';
              if (intensity > 0.8) bg = 'bg-[#A82B2B]';
              else if (intensity > 0.6) bg = 'bg-red-500/80';
              else if (intensity > 0.4) bg = 'bg-red-300/80';
              else if (intensity > 0.2) bg = 'bg-red-100';
              return <div key={`${colIdx}-${rowIdx}`} className={`w-4 h-4 rounded-[4px] ${bg} hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer`} />
            })}
          </div>
        ))}
        {heatmapData.length === 0 && (
           <div className="text-sm text-gray-400 w-full text-center py-6">Chưa có dữ liệu hoạt động.</div>
        )}
      </div>
      <div className="flex justify-end items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4 gap-2">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-gray-100"></div>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-red-100"></div>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-red-300/80"></div>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-red-500/80"></div>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-[#A82B2B]"></div>
        <span>More</span>
      </div>
    </div>
  );
}
interface ActivityHeatmapProps {
  weeklyProgress?: number[];
}

export default function ActivityHeatmap({ weeklyProgress = [] }: ActivityHeatmapProps) {
  let activityData = weeklyProgress;

  if (weeklyProgress.length < 365) {
    activityData = [...Array(365 - weeklyProgress.length).fill(0), ...weeklyProgress];
  } else if (weeklyProgress.length > 365) {
    activityData = weeklyProgress.slice(-365);
  }
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 364);
  const paddingDays = startDate.getDay();
  
  const paddedActivityData = [...Array(paddingDays).fill(-1), ...activityData];

  const monthLabels: { label: string; col: number }[] = [];
  let currentMonth = startDate.getMonth();
  monthLabels.push({ label: startDate.toLocaleString('en-US', { month: 'short' }), col: 0 });

  for (let col = 1; col < Math.ceil(paddedActivityData.length / 7); col++) {
    const dayIndex = col * 7;
    if (dayIndex >= paddedActivityData.length) break;
    
    const daysAgo = 364 - (dayIndex - paddingDays);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    
    if (d.getMonth() !== currentMonth) {
      monthLabels.push({ label: d.toLocaleString('en-US', { month: 'short' }), col });
      currentMonth = d.getMonth();
    }
  }

  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-line">
      <h2 className="text-xl font-bold text-main mb-6">Hoạt động học tập</h2>

      <div className="flex flex-col overflow-x-auto custom-scrollbar pb-4">
        <div className="min-w-max mx-auto">
          <div className="relative h-5 mb-2 ml-[40px] text-xs text-sub font-medium">
            {monthLabels.map((m, idx) => (
              <span key={idx} className="absolute" style={{ left: `${m.col * 20}px` }}>
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="grid grid-rows-7 gap-1 text-xs text-sub font-medium pr-2 w-10">
              <span className="h-4 flex items-center justify-end"></span>
              <span className="h-4 flex items-center justify-end">Mon</span>
              <span className="h-4 flex items-center justify-end"></span>
              <span className="h-4 flex items-center justify-end">Wed</span>
              <span className="h-4 flex items-center justify-end"></span>
              <span className="h-4 flex items-center justify-end">Fri</span>
              <span className="h-4 flex items-center justify-end"></span>
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-1">
              {paddedActivityData.map((level, i) => {
                if (level === -1) return <div key={`pad-${i}`} className="w-4 h-4"></div>;
                
                // Mảng màu động thích ứng Dark/Light Mode
                const bgColors = ['bg-line', 'bg-brand/20', 'bg-brand/50', 'bg-brand/80', 'bg-brand'];
                return (
                  <div 
                    key={`day-${i}`} 
                    className={`w-4 h-4 rounded-sm ${bgColors[level]} hover:ring-2 hover:ring-sub/30 transition-all cursor-pointer`}
                    title={`Mức độ hoạt động: ${level}`}
                  ></div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-sub font-medium mt-5 ml-[40px]">
            <span>Hoạt động học tập trong 365 ngày qua</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-4 h-4 rounded-sm bg-line"></div>
              <div className="w-4 h-4 rounded-sm bg-brand/20"></div>
              <div className="w-4 h-4 rounded-sm bg-brand/50"></div>
              <div className="w-4 h-4 rounded-sm bg-brand/80"></div>
              <div className="w-4 h-4 rounded-sm bg-brand"></div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
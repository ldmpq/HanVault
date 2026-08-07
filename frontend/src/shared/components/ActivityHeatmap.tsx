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
  
  // 1. Tìm Thứ của ngày bắt đầu
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 364);
  const paddingDays = startDate.getDay();
  
  const paddedActivityData = [...Array(paddingDays).fill(-1), ...activityData];

  // 2. Tự động tính toán vị trí hiển thị nhãn Tháng
  const monthLabels: { label: string; col: number }[] = [];
  let currentMonth = startDate.getMonth();
  monthLabels.push({ label: startDate.toLocaleString('en-US', { month: 'short' }), col: 0 });

  for (let col = 1; col < Math.ceil(paddedActivityData.length / 7); col++) {
    const dayIndex = col * 7;
    if (dayIndex >= paddedActivityData.length) break;
    
    // Tìm ngày thực tế của ô đầu tiên trong cột này
    const daysAgo = 364 - (dayIndex - paddingDays);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    
    // Nếu chuyển sang tháng mới, lưu lại vị trí cột để render Label
    if (d.getMonth() !== currentMonth) {
      monthLabels.push({ label: d.toLocaleString('en-US', { month: 'short' }), col });
      currentMonth = d.getMonth();
    }
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Hoạt động học tập</h2>

      <div className="flex flex-col overflow-x-auto custom-scrollbar pb-4">
        <div className="min-w-max mx-auto">
          <div className="relative h-5 mb-2 ml-[40px] text-xs text-gray-400 font-medium">
            {monthLabels.map((m, idx) => (
              <span key={idx} className="absolute" style={{ left: `${m.col * 20}px` }}>
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="grid grid-rows-7 gap-1 text-xs text-gray-400 font-medium pr-2 w-10">
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
                if (level === -1) return <div key={`pad-${i}`} className="w-4 h-4"></div>; // Ô padding ẩn
                
                const bgColors = ['bg-gray-100', 'bg-red-100', 'bg-red-300', 'bg-red-500', 'bg-[#A82B2B]'];
                return (
                  <div 
                    key={`day-${i}`} 
                    className={`w-4 h-4 rounded-sm ${bgColors[level]} hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer`}
                    title={`Mức độ hoạt động: ${level}`}
                  ></div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400 font-medium mt-5 ml-[40px]">
            <span>Hoạt động học tập trong 365 ngày qua</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-4 h-4 rounded-sm bg-gray-100"></div>
              <div className="w-4 h-4 rounded-sm bg-red-100"></div>
              <div className="w-4 h-4 rounded-sm bg-red-300"></div>
              <div className="w-4 h-4 rounded-sm bg-red-500"></div>
              <div className="w-4 h-4 rounded-sm bg-[#A82B2B]"></div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
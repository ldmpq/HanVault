import { TIMEFRAMES } from '../../../shared/constants/app.constants';

interface ProgressChartProps {
  title: string;
  data: Array<{label: string, value: number}>;
  colorClass: string;
  hoverClass: string;
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
}

export default function ProgressChart({ title, data, colorClass, hoverClass, timeframe, onTimeframeChange }: ProgressChartProps) {
  const maxVal = Math.max(...(data.map(d => d.value)), 1);

  return (
    <div className="bg-surface rounded-[24px] p-8 shadow-sm border border-line flex flex-col h-[340px]">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h3 className="text-lg font-bold text-main">{title}</h3>
        <div className="flex bg-line/30 p-1 rounded-lg border border-line">
          {TIMEFRAMES.map(tf => (
            <button 
              key={tf} 
              onClick={() => onTimeframeChange(tf)} 
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${timeframe === tf ? 'bg-surface shadow-sm text-main' : 'text-sub hover:text-main'}`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      {(!data || data.length === 0) ? (
        <div className="w-full text-center text-sm text-sub flex-1 flex items-center justify-center">Chưa có dữ liệu biểu đồ.</div>
      ) : (
        <div className="flex items-end justify-between flex-1 gap-2 sm:gap-4 mt-auto">
          {data.map((item, idx) => {
            const heightPercent = (item.value / maxVal) * 100;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                <div className="w-full max-w-[32px] bg-line/50 rounded-t-lg relative h-full flex items-end">
                    <div 
                      className={`w-full ${colorClass} rounded-t-lg transition-all duration-700 ease-out group-hover:${hoverClass}`} 
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                </div>
                <span className="text-[10px] font-bold text-sub mt-3 uppercase tracking-wider">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
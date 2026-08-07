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
    <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3] flex flex-col h-[340px]">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
          {TIMEFRAMES.map(tf => (
            <button 
              key={tf} 
              onClick={() => onTimeframeChange(tf)} 
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${timeframe === tf ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      {(!data || data.length === 0) ? (
        <div className="w-full text-center text-sm text-gray-400 flex-1 flex items-center justify-center">Chưa có dữ liệu biểu đồ.</div>
      ) : (
        <div className="flex items-end justify-between flex-1 gap-2 sm:gap-4 mt-auto">
          {data.map((item, idx) => {
            const heightPercent = (item.value / maxVal) * 100;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                <div className="w-full max-w-[32px] bg-gray-50 rounded-t-lg relative h-full flex items-end">
                    <div 
                      className={`w-full ${colorClass} rounded-t-lg transition-all duration-700 ease-out group-hover:${hoverClass}`} 
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-wider">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
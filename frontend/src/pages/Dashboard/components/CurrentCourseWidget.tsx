import { List } from 'lucide-react';

interface CurrentCourseWidgetProps {
  mastered?: { percentage?: number };
  onExplore: () => void;
}

export default function CurrentCourseWidget({ mastered, onExplore }: CurrentCourseWidgetProps) {
  const realPercentage = Math.round(mastered?.percentage || 0);

  return (
    <div className="lg:col-span-8 bg-surface rounded-[2rem] p-8 shadow-sm border border-line flex flex-col justify-between">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-main">Đang học</h2>
        <button onClick={onExplore} className="text-[10px] font-bold text-brand uppercase tracking-wider hover:underline">Xem tất cả</button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 items-center h-full">
        <div className="w-full md:w-1/3 h-full min-h-[220px] bg-line rounded-2xl overflow-hidden relative shadow-sm">
          <img src="https://images.unsplash.com/photo-1541959833400-049d37f98ccd?w=400&q=80" alt="HSK Book" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
          <div className="absolute bottom-3 left-3 bg-brand text-white text-[10px] font-bold px-2.5 py-1 rounded">Mới cập nhật</div>
        </div>

        <div className="flex-1 w-full flex flex-col justify-center py-2">
          <h3 className="text-2xl font-bold text-main mb-2">Tiến trình học tập</h3>
          <p className="text-sub mb-8 text-sm">Tiếp tục ôn tập các bộ thẻ để hoàn thành mục tiêu chinh phục chứng chỉ HSK của bạn.</p>
          
          <div className="mb-8 w-full">
            <div className="flex justify-between text-[11px] font-bold text-main mb-2">
              <span>Tiến độ hiện tại</span><span>{realPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-line rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${realPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={onExplore} className="flex-1 bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm">
              Khám phá ngay
            </button>
            <button className="w-12 h-11 bg-surface border border-line hover:bg-line/50 text-main flex items-center justify-center rounded-xl transition-colors">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Volume2, ChevronDown } from 'lucide-react';

interface LearningPrefsProps {
  dailyGoal: string; setDailyGoal: (val: string) => void;
  reviewPace: number; setReviewPace: (val: number) => void;
  audioAutoplay: boolean; setAudioAutoplay: (val: boolean) => void;
  playbackSpeed: string; setPlaybackSpeed: (val: string) => void;
}

export default function LearningPreferencesSection({
  dailyGoal, setDailyGoal, reviewPace, setReviewPace,
  audioAutoplay, setAudioAutoplay, playbackSpeed, setPlaybackSpeed
}: LearningPrefsProps) {
  return (
    <div className="bg-surface rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line space-y-6">
      <h2 className="text-lg font-bold text-main mb-2">Thiết lập học tập</h2>

      {/* Daily Goal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-line gap-2">
        <div>
          <h3 className="text-sm font-bold text-main">Mục tiêu hàng ngày</h3>
          <p className="text-xs text-sub">Mục tiêu học mỗi ngày</p>
        </div>
        <div className="relative">
          <select value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} className="appearance-none bg-app border border-line text-main text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all cursor-pointer">
            <option value="casual">Casual (10 min)</option>
            <option value="steady">Steady (30 min)</option>
            <option value="intensive">Intensive (60 min)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub pointer-events-none" />
        </div>
      </div>

      {/* Review Pace */}
      <div className="py-3 border-b border-line space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-main">Tốc độ ôn tập</h3>
            <p className="text-xs text-sub">Điều chỉnh mức độ agressive của khoảng thời gian SRS</p>
          </div>
          <span className="text-xs font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-md">
            {reviewPace < 33 ? 'Thư giãn' : reviewPace < 66 ? 'Cân bằng' : 'Nghiêm ngặt'}
          </span>
        </div>
        <div className="pt-2">
          <input type="range" min="0" max="100" value={reviewPace} onChange={(e) => setReviewPace(Number(e.target.value))} className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-brand" />
          <div className="flex justify-between text-[11px] font-medium text-sub mt-1">
            <span>Thư giãn</span><span>Nghiêm ngặt</span>
          </div>
        </div>
      </div>

      {/* Audio Config */}
      <div className="space-y-4 pt-1">
        <h3 className="text-sm font-bold text-main flex items-center gap-2"><Volume2 className="w-4 h-4 text-brand" />Cài đặt âm thanh</h3>
        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-sm font-medium text-main">Tự động phát âm thanh</span>
            <p className="text-xs text-sub">Tự động phát âm thanh khi lật thẻ từ</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={audioAutoplay} onChange={(e) => setAudioAutoplay(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-line after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
          </label>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-sm font-medium text-main">Tốc độ phát lại</span>
            <p className="text-xs text-sub">Tốc độ phát âm khi học thẻ từ</p>
          </div>
          <div className="relative">
            <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(e.target.value)} className="appearance-none bg-app border border-line text-main text-sm font-medium rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all cursor-pointer">
              <option value="0.5x">0.5x</option>
              <option value="0.75x">0.75x</option>
              <option value="1x">1x (Mặc định)</option>
              <option value="1.25x">1.25x</option>
              <option value="1.5x">1.5x</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
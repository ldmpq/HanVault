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
    <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3] space-y-6">
      <h2 className="text-lg font-bold text-gray-900 mb-2">Thiết lập học tập</h2>

      {/* Daily Goal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#ECE7E3] gap-2">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Mục tiêu hàng ngày</h3>
          <p className="text-xs text-gray-500">Mục tiêu học mỗi ngày</p>
        </div>
        <div className="relative">
          <select value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} className="appearance-none bg-[#FCFAF8] border border-[#ECE7E3] text-gray-800 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#A82B2B] transition-all cursor-pointer">
            <option value="casual">Casual (10 min)</option>
            <option value="steady">Steady (30 min)</option>
            <option value="intensive">Intensive (60 min)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Review Pace */}
      <div className="py-3 border-b border-[#ECE7E3] space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Tốc độ ôn tập</h3>
            <p className="text-xs text-gray-500">Điều chỉnh mức độ agressive của khoảng thời gian SRS</p>
          </div>
          <span className="text-xs font-bold text-[#A82B2B] bg-red-50 px-2.5 py-1 rounded-md">
            {reviewPace < 33 ? 'Thư giãn' : reviewPace < 66 ? 'Cân bằng' : 'Nghiêm ngặt'}
          </span>
        </div>
        <div className="pt-2">
          <input type="range" min="0" max="100" value={reviewPace} onChange={(e) => setReviewPace(Number(e.target.value))} className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#A82B2B]" />
          <div className="flex justify-between text-[11px] font-medium text-gray-400 mt-1">
            <span>Thư giãn</span><span>Nghiêm ngặt</span>
          </div>
        </div>
      </div>

      {/* Audio Config */}
      <div className="space-y-4 pt-1">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Volume2 className="w-4 h-4 text-[#A82B2B]" />Cài đặt âm thanh</h3>
        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Tự động phát âm thanh</span>
            <p className="text-xs text-gray-400">Tự động phát âm thanh khi lật thẻ từ</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={audioAutoplay} onChange={(e) => setAudioAutoplay(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A82B2B]"></div>
          </label>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Tốc độ phát lại</span>
            <p className="text-xs text-gray-400">Tốc độ phát âm khi học thẻ từ</p>
          </div>
          <div className="relative">
            <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(e.target.value)} className="appearance-none bg-[#FCFAF8] border border-[#ECE7E3] text-gray-800 text-sm font-medium rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#A82B2B] transition-all cursor-pointer">
              <option value="0.5x">0.5x</option>
              <option value="0.75x">0.75x</option>
              <option value="1x">1x (Mặc định)</option>
              <option value="1.25x">1.25x</option>
              <option value="1.5x">1.5x</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
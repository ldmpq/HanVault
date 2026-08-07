import { Pause } from 'lucide-react';

interface PauseOverlayProps {
  isPaused: boolean;
  setIsPaused: (val: boolean) => void;
}

export default function PauseOverlay({ isPaused, setIsPaused }: PauseOverlayProps) {
  if (!isPaused) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-fade-in max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-red-50 text-[#A82B2B] rounded-full flex items-center justify-center mb-4">
          <Pause className="w-8 h-8 fill-current" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã tạm dừng</h2>
        <p className="text-gray-500 mb-8 text-sm">Bạn có thể nghỉ ngơi một chút. Tiến trình học và đồng hồ đếm giờ đã được lưu lại.</p>
        <button 
          onClick={() => setIsPaused(false)}
          className="w-full py-3.5 bg-[#A82B2B] text-white font-bold rounded-xl hover:bg-[#8b2323] transition-colors shadow-sm"
        >
          Tiếp tục học (Enter)
        </button>
      </div>
    </div>
  );
}
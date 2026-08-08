import { RotateCw, Clock, PlusSquare, GraduationCap } from 'lucide-react';

interface ReviewWidgetProps {
  flashcard?: { ready?: number; overdue?: number; new?: number };
  onStartReview: () => void;
}

export default function ReviewWidget({ flashcard, onStartReview }: ReviewWidgetProps) {
  return (
    <div className="lg:col-span-4 bg-surface rounded-[2rem] p-8 shadow-sm border border-line flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-main">Ôn tập</h2>
        <button className="text-brand hover:rotate-180 transition-transform duration-500">
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4 mb-8 flex-1">
        <div className="flex justify-between items-center bg-app p-4 rounded-2xl border border-line">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center shadow-sm text-brand"><GraduationCap className="w-4 h-4" /></div>
            <span className="text-sm font-medium text-main">Ready</span>
          </div>
          <span className="text-xl font-bold text-brand">{flashcard?.ready || 0}</span>
        </div>
        
        <div className="flex justify-between items-center bg-app p-4 rounded-2xl border border-line">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center shadow-sm text-red-500"><Clock className="w-4 h-4" /></div>
            <span className="text-sm font-medium text-main">Overdue</span>
          </div>
          <span className="text-xl font-bold text-red-500">{flashcard?.overdue || 0}</span>
        </div>

        <div className="flex justify-between items-center bg-app p-4 rounded-2xl border border-line">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center shadow-sm text-orange-500"><PlusSquare className="w-4 h-4" /></div>
            <span className="text-sm font-medium text-main">New</span>
          </div>
          <span className="text-xl font-bold text-orange-500">{flashcard?.new || 0}</span>
        </div>
      </div>

      <button onClick={onStartReview} className="w-full bg-line/50 hover:bg-line text-main font-bold py-3.5 rounded-xl transition-colors text-sm">
        Bắt đầu phiên ôn tập
      </button>
    </div>
  );
}
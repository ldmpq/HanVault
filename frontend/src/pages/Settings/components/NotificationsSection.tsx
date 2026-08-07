import { Bell } from 'lucide-react';

interface NotificationsSectionProps {
  notifications: Array<{ id: number; title: string; desc: string; time: string; unread: boolean; icon: string }>;
  markAllAsRead: () => void;
}

export default function NotificationsSection({ notifications, markAllAsRead }: NotificationsSectionProps) {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#A82B2B]" />Thông báo
        </h2>
        <button onClick={markAllAsRead} className="text-xs font-bold text-[#A82B2B] hover:underline">
          Đánh dấu tất cả là đã đọc
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className={`p-4 rounded-2xl border transition-all flex items-start gap-3 relative ${item.unread ? 'bg-red-50/20 border-red-100' : 'bg-[#FCFAF8] border-[#ECE7E3]'}`}>
            {item.unread && <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#A82B2B]"></span>}
            <div className="text-2xl shrink-0 bg-white p-2 rounded-xl shadow-sm border border-[#ECE7E3]">{item.icon}</div>
            <div className="flex-1 min-w-0 pr-3">
              <h4 className="text-xs font-bold text-gray-900 mb-1 truncate">{item.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">{item.desc}</p>
              <span className="text-[10px] font-medium text-gray-400">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-[#ECE7E3] text-center">
        <button className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
          Hiển thị tất cả thông báo
        </button>
      </div>
    </div>
  );
}
import { Bell } from 'lucide-react';

interface NotificationsSectionProps {
  notifications: Array<{ id: number; title: string; desc: string; time: string; unread: boolean; icon: string }>;
  markAllAsRead: () => void;
}

export default function NotificationsSection({ notifications, markAllAsRead }: NotificationsSectionProps) {
  return (
    <div className="bg-surface rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-main flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand" />Thông báo
        </h2>
        <button onClick={markAllAsRead} className="text-xs font-bold text-brand hover:underline">
          Đánh dấu tất cả là đã đọc
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className={`p-4 rounded-2xl border transition-all flex items-start gap-3 relative ${item.unread ? 'bg-brand/5 border-brand/20' : 'bg-app border-line'}`}>
            {item.unread && <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand"></span>}
            <div className="text-2xl shrink-0 bg-surface p-2 rounded-xl shadow-sm border border-line">{item.icon}</div>
            <div className="flex-1 min-w-0 pr-3">
              <h4 className="text-xs font-bold text-main mb-1 truncate">{item.title}</h4>
              <p className="text-xs text-sub leading-relaxed mb-2">{item.desc}</p>
              <span className="text-[10px] font-medium text-sub">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-line text-center">
        <button className="text-xs font-bold text-sub hover:text-main transition-colors">
          Hiển thị tất cả thông báo
        </button>
      </div>
    </div>
  );
}
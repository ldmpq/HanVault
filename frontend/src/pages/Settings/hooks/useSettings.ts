import { useState, useEffect } from 'react';

export const useSettings = () => {
  // 1. Đọc giá trị mặc định từ localStorage (nếu có), nếu không dùng 'system'
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('hanvault-theme') as 'light' | 'dark' | 'system') || 'system';
  });

  const [dailyGoal, setDailyGoal] = useState('steady');
  const [reviewPace, setReviewPace] = useState(50);
  const [audioAutoplay, setAudioAutoplay] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Streak Milestone!', desc: 'You reached a 12-day study streak. Keep it up!', time: '10m ago', unread: true, icon: '🔥' },
  ]);

  // 2. Logic xử lý Theme chuyên sâu
  useEffect(() => {
    const root = window.document.documentElement;
    // Lưu lựa chọn vào bộ nhớ
    localStorage.setItem('hanvault-theme', theme);
    
    // Hàm áp dụng theme
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      // Đọc cài đặt hệ thống hiện tại
      const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(systemQuery.matches);

      // Lắng nghe sự thay đổi của hệ thống (ví dụ: máy tính tự chuyển Dark mode khi trời tối)
      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      systemQuery.addEventListener('change', listener);
      return () => systemQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return {
    theme, setTheme,
    dailyGoal, setDailyGoal,
    reviewPace, setReviewPace,
    audioAutoplay, setAudioAutoplay,
    playbackSpeed, setPlaybackSpeed,
    notifications, markAllAsRead
  };
};
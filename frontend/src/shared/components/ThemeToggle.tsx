import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; 
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-xl bg-surface border border-line text-sub transition-all duration-200 hover:text-brand hover:border-brand/30 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
      aria-label="Chuyển đổi chế độ Giao diện"
    >
      {theme === 'dark' ? (
        // Đang ở chế độ Tối -> Hiện icon Mặt trời (gợi ý chuyển sang Sáng)
        <Sun className="w-5 h-5" />
      ) : (
        // Đang ở chế độ Sáng -> Hiện icon Mặt trăng (gợi ý chuyển sang Tối)
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
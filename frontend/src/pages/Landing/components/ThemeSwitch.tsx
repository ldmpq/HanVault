import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-14 h-7" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 border-2 focus:outline-none hover:border-brand/50 ${
        isDark 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-neutral-200 border-neutral-300'
      }`}
      aria-label="Chuyển đổi giao diện Sáng/Tối"
    >
      <span 
        className={`inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-app shadow-sm border border-line transition-transform duration-300 ${
          isDark ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-brand" /> 
        ) : (
          <Sun className="w-3 h-3 text-brand" />
        )}
      </span>
    </button>
  );
}
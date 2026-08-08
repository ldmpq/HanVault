import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AppearanceSectionProps {
  theme: 'light' | 'dark' | 'system' | string;
  setTheme: (theme: string) => void;
}

export default function AppearanceSection({ theme, setTheme }: AppearanceSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { id: 'light', label: 'Sáng', icon: Sun },
    { id: 'dark', label: 'Tối', icon: Moon },
    { id: 'system', label: 'Hệ thống', icon: Laptop },
  ] as const;

  return (
    <div className="bg-surface rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-line">
      <h2 className="text-lg font-bold text-main mb-4">Giao diện</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map(({ id, label, icon: Icon }) => {

          const isActive = mounted && theme === id;
          
          return (
            <div 
              key={id}
              onClick={() => setTheme(id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isActive 
                  ? 'border-brand bg-brand/10 text-brand' 
                  : 'border-line bg-app text-main hover:border-brand/30'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <Icon className={`w-6 h-6 ${isActive ? 'text-brand' : 'text-sub'}`} />
                {isActive && (
                  <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
              <span className="font-bold text-sm">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
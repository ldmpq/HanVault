import { Sun, Moon, Laptop, Check } from 'lucide-react';

interface AppearanceSectionProps {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export default function AppearanceSection({ theme, setTheme }: AppearanceSectionProps) {
  const themes = [
    { id: 'light', label: 'Sáng', icon: Sun },
    { id: 'dark', label: 'Tối', icon: Moon },
    { id: 'system', label: 'Hệ thống', icon: Laptop },
  ] as const;

  return (
    <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3]">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Giao diện</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map(({ id, label, icon: Icon }) => (
          <div 
            key={id}
            onClick={() => setTheme(id)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              theme === id 
                ? 'border-[#A82B2B] bg-red-50/40 text-[#A82B2B]' 
                : 'border-[#ECE7E3] bg-[#FCFAF8] text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <Icon className={`w-6 h-6 ${theme === id ? 'text-[#A82B2B]' : 'text-gray-500'}`} />
              {theme === id && (
                <div className="w-5 h-5 rounded-full bg-[#A82B2B] flex items-center justify-center text-white">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
            <span className="font-bold text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
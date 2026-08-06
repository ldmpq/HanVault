import { useState } from 'react';
import { Sun, Moon, Laptop, Volume2, Mail, Lock, Shield, Bell, Check, ChevronDown } from 'lucide-react';

export default function Settings() {
  // Quản lý state cho các cài đặt giao diện và học tập
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [dailyGoal, setDailyGoal] = useState('steady');
  const [reviewPace, setReviewPace] = useState(50); // Slider từ 0 - 100
  const [audioAutoplay, setAudioAutoplay] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');

  // Danh sách thông báo mẫu (có thể thay thế bằng dữ liệu từ API)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Streak Milestone!', desc: 'You reached a 12-day study streak. Keep it up!', time: '10m ago', unread: true, icon: '🔥' },
    { id: 2, title: 'New Deck Available', desc: 'HSK 4 Business Vocabulary deck has been added.', time: '2h ago', unread: true, icon: '📚' },
    { id: 3, title: 'Review Reminder', desc: 'You have 15 words due for review today.', time: '1d ago', unread: false, icon: '⏰' },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 px-4 md:px-8 pt-6 font-sans animate-fade-in bg-[#FCFAF8] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500 text-sm md:text-base">Manage your learning experience and account preferences.</p>
      </div>

      {/* MAIN LAYOUT: 2 CỘT TRÊN DESKTOP, STACK TRÊN TABLET/MOBILE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= CỘT TRÁI (~65% -> col-span-8) ================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. APPEARANCE */}
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3]">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Appearance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Light Option */}
              <div 
                onClick={() => setTheme('light')}
                className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  theme === 'light' 
                    ? 'border-[#A82B2B] bg-red-50/40 text-[#A82B2B]' 
                    : 'border-[#ECE7E3] bg-[#FCFAF8] text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-[#A82B2B]' : 'text-gray-500'}`} />
                  {theme === 'light' && (
                    <div className="w-5 h-5 rounded-full bg-[#A82B2B] flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="font-bold text-sm">Light</span>
              </div>

              {/* Dark Option */}
              <div 
                onClick={() => setTheme('dark')}
                className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  theme === 'dark' 
                    ? 'border-[#A82B2B] bg-red-50/40 text-[#A82B2B]' 
                    : 'border-[#ECE7E3] bg-[#FCFAF8] text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-[#A82B2B]' : 'text-gray-500'}`} />
                  {theme === 'dark' && (
                    <div className="w-5 h-5 rounded-full bg-[#A82B2B] flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="font-bold text-sm">Dark</span>
              </div>

              {/* System Option */}
              <div 
                onClick={() => setTheme('system')}
                className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  theme === 'system' 
                    ? 'border-[#A82B2B] bg-red-50/40 text-[#A82B2B]' 
                    : 'border-[#ECE7E3] bg-[#FCFAF8] text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <Laptop className={`w-6 h-6 ${theme === 'system' ? 'text-[#A82B2B]' : 'text-gray-500'}`} />
                  {theme === 'system' && (
                    <div className="w-5 h-5 rounded-full bg-[#A82B2B] flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="font-bold text-sm">System</span>
              </div>

            </div>
          </div>

          {/* 2. LEARNING PREFERENCES */}
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3] space-y-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Learning Preferences</h2>

            {/* Daily Goal Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#ECE7E3] gap-2">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Daily Goal</h3>
                <p className="text-xs text-gray-500">Target study time per day</p>
              </div>
              <div className="relative">
                <select
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                  className="appearance-none bg-[#FCFAF8] border border-[#ECE7E3] text-gray-800 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#A82B2B] transition-all cursor-pointer"
                >
                  <option value="casual">Casual (10 min)</option>
                  <option value="steady">Steady (30 min)</option>
                  <option value="intensive">Intensive (60 min)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Review Pace Slider */}
            <div className="py-3 border-b border-[#ECE7E3] space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Review Pace</h3>
                  <p className="text-xs text-gray-500">Adjust the SRS interval aggressiveness</p>
                </div>
                <span className="text-xs font-bold text-[#A82B2B] bg-red-50 px-2.5 py-1 rounded-md">
                  {reviewPace < 33 ? 'Relaxed' : reviewPace < 66 ? 'Balanced' : 'Strict'}
                </span>
              </div>
              <div className="pt-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={reviewPace}
                  onChange={(e) => setReviewPace(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#A82B2B]"
                />
                <div className="flex justify-between text-[11px] font-medium text-gray-400 mt-1">
                  <span>Relaxed</span>
                  <span>Strict</span>
                </div>
              </div>
            </div>

            {/* Audio Configuration */}
            <div className="space-y-4 pt-1">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#A82B2B]" /> Audio Configuration
              </h3>

              {/* Audio Autoplay Switch */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Audio Autoplay</span>
                  <p className="text-xs text-gray-400">Automatically play audio when flipping flashcards</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={audioAutoplay} 
                    onChange={(e) => setAudioAutoplay(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A82B2B]"></div>
                </label>
              </div>

              {/* Playback Speed Dropdown */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Playback Speed</span>
                  <p className="text-xs text-gray-400">Pronunciation speed when studying flashcards</p>
                </div>
                <div className="relative">
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(e.target.value)}
                    className="appearance-none bg-[#FCFAF8] border border-[#ECE7E3] text-gray-800 text-sm font-medium rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#A82B2B] transition-all cursor-pointer"
                  >
                    <option value="0.5x">0.5x</option>
                    <option value="0.75x">0.75x</option>
                    <option value="1x">1x (Default)</option>
                    <option value="1.25x">1.25x</option>
                    <option value="1.5x">1.5x</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

          {/* 3. ACCOUNT SECURITY */}
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3] space-y-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Account Security</h2>

            {/* Email Address Item */}
            <div className="flex items-center justify-between py-3 border-b border-[#ECE7E3]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Email Address</h3>
                  <p className="text-xs text-gray-500">user@example.com</p>
                </div>
              </div>
              <button className="text-xs font-bold text-[#A82B2B] bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors">
                Update
              </button>
            </div>

            {/* Password Item */}
            <div className="flex items-center justify-between py-3 border-b border-[#ECE7E3]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Password</h3>
                  <p className="text-xs text-gray-500 tracking-widest">••••••••••••</p>
                </div>
              </div>
              <button className="text-xs font-bold text-[#A82B2B] bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors">
                Change
              </button>
            </div>

            {/* Future expansions placeholder (2FA / Login Sessions) */}
            <div className="pt-2 space-y-3 opacity-60">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Two-factor Authentication</h3>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">Soon</span>
              </div>
            </div>

          </div>

        </div>

        {/* ================= CỘT PHẢI (~35% -> col-span-4) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[#ECE7E3]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#A82B2B]" /> Notifications
              </h2>
              <button 
                onClick={markAllAsRead}
                className="text-xs font-bold text-[#A82B2B] hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-4">
              {notifications.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3 relative ${
                    item.unread ? 'bg-red-50/20 border-red-100' : 'bg-[#FCFAF8] border-[#ECE7E3]'
                  }`}
                >
                  {item.unread && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#A82B2B]"></span>
                  )}
                  <div className="text-2xl shrink-0 bg-white p-2 rounded-xl shadow-sm border border-[#ECE7E3]">
                    {item.icon}
                  </div>
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
                View older notifications
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
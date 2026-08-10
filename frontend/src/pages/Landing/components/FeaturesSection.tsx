import { BookOpen, RefreshCw, TrendingUp, GraduationCap } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="flex flex-col items-center scroll-mt-28">
      <div className="text-center max-w-2xl mb-16">
        <h2 className="text-4xl font-bold text-main mb-4 tracking-tight transition-colors duration-300">Everything you need to succeed</h2>
        <p className="text-sub transition-colors duration-300">
          Our tools are designed to reduce cognitive load and enhance retention during intensive study sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {/* Card 1 */}
        <div className="md:col-span-7 bg-surface rounded-[2rem] p-10 border border-line shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:shadow-md transition-all duration-300">
          <div className="flex-1">
            <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6 border border-brand/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-main mb-3">Tactile Flashcards</h3>
            <p className="text-sub leading-relaxed">
              Experience high-quality physical cards in a digital format. Large, centered Hanzi with intuitive checking mechanisms.
            </p>
          </div>
          <div className="flex-1 w-full bg-brand/5 rounded-2xl p-6 flex items-center justify-center border border-line group-hover:scale-105 transition-transform">
            <div className="bg-surface w-32 h-40 rounded-xl shadow-sm flex flex-col items-center justify-center border border-line relative">
              <span className="text-5xl font-medium text-main">学</span>
              <span className="absolute bottom-3 text-[10px] text-sub font-bold uppercase tracking-widest">HSK 1</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="md:col-span-5 bg-surface rounded-[2rem] p-10 border border-line shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-main mb-3">Smart SRS</h3>
          <p className="text-sub leading-relaxed mb-6">
            Optimized spaced repetition ensures you review at exactly the right time.
          </p>
          <div className="w-full h-24 bg-gradient-to-r from-orange-500/10 to-transparent rounded-xl border border-line relative overflow-hidden flex items-end">
             <svg className="w-full h-16 text-orange-400 opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,100 L0,50 Q25,20 50,60 T100,10 L100,100 Z" fill="currentColor" />
             </svg>
             <svg className="absolute w-full h-16 text-orange-500" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M0,50 Q25,20 50,60 T100,10" />
             </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="md:col-span-5 bg-surface rounded-[2rem] p-10 border border-line shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-main mb-3">Momentum Tracking</h3>
            <p className="text-sub leading-relaxed">
              Visualize your progress with satisfying gradient rings and daily streaks.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-line border-t-brand border-r-brand flex items-center justify-center transform -rotate-45">
              <span className="text-lg font-bold text-main transform rotate-45">85%</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div id="hsk" className="md:col-span-7 bg-surface rounded-[2rem] p-10 border border-line shadow-sm flex flex-col-reverse md:flex-row items-center gap-8 hover:shadow-md transition-all duration-300 scroll-mt-28">
          <div className="flex-1 w-full bg-gradient-to-br from-pink-500/10 to-brand/10 rounded-2xl p-6 flex flex-col gap-2 border border-line">
            <div className="bg-surface p-3 rounded-lg text-xs font-bold text-sub border border-line">HSK 1 - Beginner</div>
            <div className="bg-surface p-3 rounded-lg text-xs font-bold text-sub border border-line">HSK 2 - Elementary</div>
            <div className="bg-surface p-3 rounded-lg text-xs font-bold text-sub border border-line">HSK 3 - Intermediate</div>
            <div className="bg-brand p-3 rounded-lg text-xs font-bold text-white shadow-sm border border-brand">HSK 4 - Upper-Int</div>
          </div>
          <div className="flex-1">
            <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-main mb-3">Structured HSK 1–9 Path</h3>
            <p className="text-sub leading-relaxed">
              Follow a comprehensive learning path from absolute beginner to advanced proficiency with our meticulously structured vocabulary decks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Play } from 'lucide-react';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';
import { useHanziWriter } from '../../../shared/hooks/useHanziWriter';

interface HanziBoardProps {
  activeStrokeChar: string;
  chars: string[];
  setActiveStrokeChar: (char: string) => void;
  word: Vocabulary;
}

export default function HanziBoard({ activeStrokeChar, chars, setActiveStrokeChar, word }: HanziBoardProps) {
  const { writerRef, activeDetails, animateCharacter } = useHanziWriter(activeStrokeChar, word);

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#0D1B2A]">Thứ tự nét bút</h2>
        <div className="flex bg-gray-50/80 rounded-lg p-1 border border-gray-100">
          {chars.map((char, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveStrokeChar(char)} 
              className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${activeStrokeChar === char ? 'bg-white text-[#A82B2B] shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full aspect-square bg-[#FDFBF9] rounded-2xl relative border border-gray-100 overflow-hidden flex items-center justify-center group mb-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="black" strokeWidth="2" strokeDasharray="5,5"/>
          </svg>
        </div>
        <div ref={writerRef} className="z-10 cursor-crosshair"></div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-20">
          <button 
            onClick={animateCharacter} 
            className="w-14 h-14 bg-[#A82B2B] rounded-full flex items-center justify-center text-white shadow-lg shadow-red-900/20 hover:bg-[#8b2323] transition-colors"
          >
            <Play className="w-6 h-6 fill-current ml-1" />
          </button>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 pt-8">
        <h2 className="text-xl font-bold text-[#0D1B2A] mb-6">Chi tiết ký tự</h2>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 bg-[#FDFBF9] rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-gray-50">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Số nét</span>
              <span className="text-3xl font-bold text-[#A82B2B]">{activeDetails.strokes}</span>
            </div>
            <div className="flex-1 bg-[#FDFBF9] rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-gray-50">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Bộ</span>
              {activeDetails.radical.includes('(') ? (
                <div className="flex flex-col items-center mt-1">
                  <span className="text-2xl font-bold text-[#0D1B2A]">{activeDetails.radical.split(' (')[0]}</span>
                  <span className="text-[13px] font-medium text-gray-500 mt-1 capitalize">{activeDetails.radical.split(' (')[1].replace(')', '')}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-[#0D1B2A] mt-1">{activeDetails.radical}</span>
              )}
            </div>
          </div>
          
          <div className="w-full bg-[#FDFBF9] rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-gray-50">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Hình thái</span>
            <span className="text-xl font-bold text-[#0D1B2A] mt-1 tracking-widest">
              {activeDetails.decomposition === 'Nguyên thể' ? activeDetails.decomposition : activeDetails.decomposition.split('').join(' + ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
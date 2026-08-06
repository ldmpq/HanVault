import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import HanziWriter from 'hanzi-writer';
import type { Vocabulary } from '../shared/types/vocabulary.types';

interface HanziBoardProps {
  activeStrokeChar: string;
  chars: string[];
  setActiveStrokeChar: (char: string) => void;
  word: Vocabulary;
}

export default function HanziBoard({ activeStrokeChar, chars, setActiveStrokeChar, word }: HanziBoardProps) {
  const writerRef = useRef<HTMLDivElement>(null);
  const [writerInstance, setWriterInstance] = useState<HanziWriter | null>(null);
  const [activeDetails, setActiveDetails] = useState({ strokes: 0, radical: '...', decomposition: '...' });

  // Khởi tạo HanziWriter
  useEffect(() => {
    if (!writerRef.current || !activeStrokeChar) return;
    
    writerRef.current.innerHTML = '';
    const writer = HanziWriter.create(writerRef.current, activeStrokeChar, {
      width: 240, height: 240, padding: 15, strokeAnimationSpeed: 1.5, delayBetweenStrokes: 150,
      strokeColor: '#A82B2B', radicalColor: '#E09353', showOutline: true, outlineColor: '#E5E7EB',
      charDataLoader: (char, onComplete) => {
        fetch(`/hanzi-writer-data/${char}.json`)
          .then(res => res.json()).then(onComplete).catch(() => {
            fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`)
              .then(res => res.json()).then(onComplete);
          });
      }
    });
    setWriterInstance(writer);
  }, [activeStrokeChar]);

  // Fetch dữ liệu động cho bộ thủ và nét bút
  useEffect(() => {
    if (!activeStrokeChar) return;
    
    const fetchDynamicCharData = async () => {
      let strokesCount = 0;
      try { 
        strokesCount = (await (await fetch(`/hanzi-writer-data/${activeStrokeChar}.json`)).json()).strokes?.length || 0; 
      } catch (err) { 
        try { 
          strokesCount = (await (await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${activeStrokeChar}.json`)).json()).strokes?.length || 0; 
        } catch (e) {} 
      }
      
      const component = word?.components?.find((c: any) => c.ch === activeStrokeChar);
      let radicalText = 'Chưa rõ', decompositionText = 'Chưa rõ';
      
      if (component) {
        const isValidMeaning = component.meaning && component.meaning !== 'null' && component.meaning !== 'N/A' && component.meaning !== 'Bộ thủ/Thành phần' && component.meaning !== 'Bộ thủ / Thành phần';
        const validRadical = component.radical && component.radical !== 'N/A' ? component.radical : component.ch;
        radicalText = isValidMeaning ? `${validRadical} (${component.meaning})` : validRadical;
        const rawDecomp = component.decomposition || (component as any).morphology;
        decompositionText = (rawDecomp && rawDecomp !== 'null' && rawDecomp !== 'N/A') ? rawDecomp : 'Nguyên thể';
      }
      setActiveDetails({ strokes: strokesCount, radical: radicalText, decomposition: decompositionText });
    };
    fetchDynamicCharData();
  }, [activeStrokeChar, word]);

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
            onClick={() => writerInstance?.animateCharacter()} 
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

        <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-200">
          <span className="text-sm font-medium text-gray-600">Độ phổ biến</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className="w-4 h-4 text-[#A82B2B]" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"></polygon>
    </svg>
  );
}
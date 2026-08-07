import { Volume2, Edit3, FolderPlus } from 'lucide-react';
import type { Vocabulary } from '../../../shared/types/vocabulary.types';

interface WordHeroProps {
  word: Vocabulary;
  hskLevel: number;
  playAudio: (e: React.MouseEvent, text: string) => void;
  onOpenDeckModal: () => void;
}

const getDisplayPos = (word: Vocabulary | null) => {
  if (!word) return 'Từ vựng';
  const rawPos = word.partOfSpeech || (word as any).part_of_speech || (word as any).pos;
  if (!rawPos) return 'Từ vựng';
  const posMap: Record<string, string> = {
    'v': 'Động từ', 'n': 'Danh từ', 'adj': 'Tính từ', 'adv': 'Phó từ',
    'pron': 'Đại từ', 'num': 'Số từ', 'm': 'Lượng từ', 'conj': 'Liên từ',
    'prep': 'Giới từ', 'part': 'Trợ từ', 'int': 'Thán từ', 'idiom': 'Thành ngữ'
  };
  return posMap[rawPos.toLowerCase()] || rawPos;
};

export default function WordHero({ word, hskLevel, playAudio, onOpenDeckModal }: WordHeroProps) {
  return (
    <div className="bg-gradient-to-br from-white to-red-50/40 rounded-[2rem] p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-red-50 flex flex-col md:flex-row justify-between relative overflow-hidden">
      <div>
        <div className="flex items-center gap-3 mb-6">
          {hskLevel > 0 ? (
            <span className="bg-[#A82B2B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">HSK {hskLevel}</span>
          ) : (
            <span className="bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Ngoài HSK</span>
          )}
          <span className="text-gray-500 text-sm font-medium capitalize">{getDisplayPos(word)}</span>
        </div>

        <div className="flex items-end gap-6 mb-4">
          <h1 className="text-8xl md:text-9xl font-medium text-[#A82B2B] leading-none tracking-tight">{word.character}</h1>
          <button onClick={(e) => playAudio(e, word.character || '')} className="w-12 h-12 bg-gray-100 hover:bg-red-100 text-[#A82B2B] rounded-full flex items-center justify-center transition-colors mb-4"><Volume2 className="w-6 h-6" /></button>
        </div>

        <div className="mb-8 pl-1">
          <p className="text-2xl text-gray-800 font-medium">{word.pinyin}</p>
          {word.sinoVietnamese && (
            <div className="mt-2"><span className="bg-[#FDFBF9] text-[#E09353] border border-[#E09353]/30 px-3 py-1 rounded-md text-sm font-bold tracking-wide uppercase">{word.sinoVietnamese}</span></div>
          )}
        </div>
        
        <div className="border-l-[5px] border-[#A82B2B] pl-4">
          <p className="text-3xl text-gray-900 font-bold tracking-tight">{word.meaning}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8 md:mt-0 justify-center min-w-[200px] z-10">
        <button 
          onClick={onOpenDeckModal} 
          className="w-full bg-[#A82B2B] hover:bg-[#8b2323] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <FolderPlus className="w-5 h-5" /> Thêm vào thẻ
        </button>
        
        <button className="w-full bg-white border border-[#A82B2B] text-[#A82B2B] hover:bg-red-50 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm">
          <Edit3 className="w-5 h-5" /> Luyện viết
        </button>
      </div>
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-100/50 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
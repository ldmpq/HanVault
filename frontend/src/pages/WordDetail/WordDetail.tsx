import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTextToSpeech } from '../../shared/hooks/useTextToSpeech';
import { renderBreadcrumbs } from '../../shared/utils/navigation.utils';
import AddToDeckModal from '../../shared/components/AddToDeckModal';
import { useWordDetail } from './hooks/useWordDetail';
import HanziBoard from './components/HanziBoard';

import WordHero from './components/WordHero';
import WordExamples from './components/WordExamples';
import WordRelations from './components/WordRelations';

export default function WordDetail() {
  const { id } = useParams();
  const location = useLocation(); 
  const deckId = location.state?.deckId || '';
  const deckName = location.state?.deckName || 'Chi tiết bộ thẻ';

  const { word, isLoading, activeStrokeChar, setActiveStrokeChar } = useWordDetail(id);
  const { playAudio } = useTextToSpeech();

  const [activeTab, setActiveTab] = useState<'examples' | 'relations'>('examples');
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);

  if (isLoading) return <div className="text-center py-20 text-sub font-medium">Đang tải chi tiết từ vựng...</div>;
  if (!word || !word.character) return <div className="text-center py-20 text-brand font-medium">Không tìm thấy từ vựng này!</div>;

  const chars = word.character.split('');
  const hskLevel = word.hskLevel || (word as any).hsk_level || (word as any).level || 0;

  return (
    <div className="max-w-[1300px] mx-auto pb-24 animate-fade-in relative text-main transition-colors">
      {renderBreadcrumbs(location.state, deckId, deckName, word.character)}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <WordHero 
            word={word} hskLevel={hskLevel} 
            playAudio={playAudio} onOpenDeckModal={() => setIsDeckModalOpen(true)} 
          />

          <div className="mt-8">
            <div className="flex gap-8 border-b border-line mb-6 px-2">
              <button
                onClick={() => setActiveTab('examples')}
                className={`pb-4 text-lg font-bold transition-all border-b-[3px] ${
                  activeTab === 'examples' ? 'border-brand text-brand' : 'border-transparent text-sub hover:text-main'
                }`}
              >
                Câu ví dụ
              </button>
              <button
                onClick={() => setActiveTab('relations')}
                className={`pb-4 text-lg font-bold transition-all border-b-[3px] ${
                  activeTab === 'relations' ? 'border-brand text-brand' : 'border-transparent text-sub hover:text-main'
                }`}
              >
                Từ liên quan
              </button>
            </div>

            {activeTab === 'examples' ? (
              <WordExamples word={word} playAudio={playAudio} />
            ) : (
              <WordRelations word={word} />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <HanziBoard 
            activeStrokeChar={activeStrokeChar}
            setActiveStrokeChar={setActiveStrokeChar}
            chars={chars}
            word={word}
          />
        </div>
      </div>

      <AddToDeckModal 
        isOpen={isDeckModalOpen} 
        onClose={() => setIsDeckModalOpen(false)} 
        wordId={word.id} 
        wordCharacter={word.character} 
      />
    </div>
  );
}
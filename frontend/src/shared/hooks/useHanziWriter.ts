import { useState, useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';
import type { Vocabulary } from '../types/vocabulary.types';

export function useHanziWriter(activeStrokeChar: string, word: Vocabulary) {
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
        const isValidMeaning = component.meaning && component.meaning !== 'null' && component.meaning !== 'N/A' && !component.meaning.includes('Bộ thủ');
        const validRadical = component.radical && component.radical !== 'N/A' ? component.radical : component.ch;
        radicalText = isValidMeaning ? `${validRadical} (${component.meaning})` : validRadical;
        const rawDecomp = component.decomposition || (component as any).morphology;
        decompositionText = (rawDecomp && rawDecomp !== 'null' && rawDecomp !== 'N/A') ? rawDecomp : 'Nguyên thể';
      }
      setActiveDetails({ strokes: strokesCount, radical: radicalText, decomposition: decompositionText });
    };
    fetchDynamicCharData();
  }, [activeStrokeChar, word]);

  const animateCharacter = () => {
    writerInstance?.animateCharacter();
  };

  return { writerRef, activeDetails, animateCharacter };
}
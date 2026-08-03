import { useCallback } from 'react';

export const useTextToSpeech = () => {
  const playAudio = useCallback((e: React.MouseEvent | null, text: string) => {
    if (e) e.stopPropagation(); 
    if (!text) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; 
      utterance.rate = 0.9;     
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Lỗi phát âm thanh:", error);
    }
  }, []);

  return { playAudio };
};
export interface Vocabulary {
  id: number;
  simplified: string;
  traditional?: string; // WordDetail
  character?: string; // WordDetail
  pinyin: string;
  sinoVietnamese?: string; // WordDetail
  meaning: string;
  meanings?: { meaning: string; languageCode?: string }[];
  hskLevel?: number;
  partOfSpeech?: string;
  synonyms?: { id: number; character: string; pinyin: string }[];
  antonyms?: { id: number; character: string; pinyin: string }[];
  isNew?: boolean; // SRS
  isFavorite?: boolean; // Dictionary
  examples?: { ch: string; py: string; en: string }[];
  components?: { ch: string; py: string; meaning: string }[];
  mastery?: number;
  lastReviewed?: string;
  mnemonic?: string;
  nextIntervals?: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}
// AddtoDeckModal.tsx
export const HSK_FORM_OPTIONS = [
  { label: 'Any', value: null },
  { label: 'HSK 1', value: 1 },
  { label: 'HSK 2', value: 2 },
  { label: 'HSK 3', value: 3 },
  { label: 'HSK 4', value: 4 },
  { label: 'HSK 5', value: 5 },
  { label: 'HSK 6', value: 6 },
  { label: 'HSK 7-8-9', value: 7}
];

// SearchFilterBar.tsx
export const HSK_FILTER_OPTIONS = [
  { label: 'HSK 1', value: '1' },
  { label: 'HSK 2', value: '2' },
  { label: 'HSK 3', value: '3' },
  { label: 'HSK 4', value: '4' },
  { label: 'HSK 5', value: '5' },
  { label: 'HSK 6', value: '6' },
  { label: 'HSK 7-8-9', value: '7,8,9' }
];

// WordDetail.tsx
export const PART_OF_SPEECH_MAP: Record<string, string> = {
  'v': 'Động từ', 'n': 'Danh từ', 'adj': 'Tính từ', 'adv': 'Phó từ',
  'pron': 'Đại từ', 'num': 'Số từ', 'm': 'Lượng từ', 'conj': 'Liên từ',
  'prep': 'Giới từ', 'part': 'Trợ từ', 'int': 'Thán từ', 'idiom': 'Thành ngữ'
};

// Library.tsx
export const LIBRARY_TABS = ['All', 'HSK 1-2', 'HSK 3-4', 'HSK 5-6', 'HSK 7-9', 'Topics', 'My list'];

// Progress.tsx
export const TIMEFRAMES = ['7D', '30D', '12M'];
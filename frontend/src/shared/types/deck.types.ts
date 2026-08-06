export interface Deck {
  id: number;
  name?: string; 
  title?: string;
  description?: string;
  coverUrl?: string;
  level: number | string;
  hskLevel?: number;
  progress: number;
  words?: number;
  tag?: string;
  bgColor?: string;
  iconColor?: string;
  icon?: string;
}
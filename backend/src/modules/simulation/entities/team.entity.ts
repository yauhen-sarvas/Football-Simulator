export interface Team {
  id: string;
  name: string;
  flagEmoji: string;
  score: number;
}

export const PREDEFINED_TEAMS: Team[] = [
  { id: 'germany', name: 'Germany', flagEmoji: '🇩🇪', score: 0 },
  { id: 'poland', name: 'Poland', flagEmoji: '🇵🇱', score: 0 },
  { id: 'brazil', name: 'Brazil', flagEmoji: '🇧🇷', score: 0 },
  { id: 'mexico', name: 'Mexico', flagEmoji: '🇲🇽', score: 0 },
  { id: 'argentina', name: 'Argentina', flagEmoji: '🇦🇷', score: 0 },
  { id: 'uruguay', name: 'Uruguay', flagEmoji: '🇺🇾', score: 0 },
];

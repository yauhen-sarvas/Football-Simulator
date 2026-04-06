import { Team } from './team.entity';

export interface Match {
  id: string;
  name: string;
  homeTeam: Team;
  awayTeam: Team;
}

export const PREDEFINED_MATCHES: Match[] = [
  {
    id: 'match-1',
    name: 'Germany vs Poland',
    homeTeam: { id: 'germany', name: 'Germany', flagEmoji: '🇩🇪', score: 0 },
    awayTeam: { id: 'poland', name: 'Poland', flagEmoji: '🇵🇱', score: 0 },
  },
  {
    id: 'match-2',
    name: 'Brazil vs Mexico',
    homeTeam: { id: 'brazil', name: 'Brazil', flagEmoji: '🇧🇷', score: 0 },
    awayTeam: { id: 'mexico', name: 'Mexico', flagEmoji: '🇲🇽', score: 0 },
  },
  {
    id: 'match-3',
    name: 'Argentina vs Uruguay',
    homeTeam: { id: 'argentina', name: 'Argentina', flagEmoji: '🇦🇷', score: 0 },
    awayTeam: { id: 'uruguay', name: 'Uruguay', flagEmoji: '🇺🇾', score: 0 },
  },
];

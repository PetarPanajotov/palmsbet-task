export interface Game {
  id: number;
  name: string;
  provider: string;
  image: string;
  lines: string;
  volatility: string;
}

export interface GamesResponse {
  games: Game[];
  providers: string[];
}

export interface FilterOptions {
  provider?: string;
  search?: string;
}

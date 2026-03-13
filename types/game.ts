export interface ExternalGame {
  active_image: string | null;
  betMin: string;
  betMax: string;
  bigIco: string;
  categories: string;
  category: string;
  demo_launch_url: string;
  description: string;
  game_id: string;
  game_type_code: string;
  has_demo: number;
  has_real: number;
  id: number;
  img_primary: string;
  img_secondary: string;
  img_url: string;
  inserted_at_epoch: string;
  jp_url: string | null;
  launch_url: string;
  lines: string;
  mainCategory: string;
  name: string;
  orderNewest: string;
  orderPromo: string;
  orderRec: string;
  orderTour: string;
  orderVal: string;
  server_code: string;
  sub_category: string;
  supports_desktop: boolean;
  supports_flash: boolean;
  supports_html: boolean;
  supports_mobile: boolean;
  vendor_code: string;
  volatility: string;
  wallpaper: string;
  leo_vs_leo: string;
}

export interface ExternalGamesResponse {
  game_list: Record<string, ExternalGame>;
}

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

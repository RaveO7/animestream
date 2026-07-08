export interface ScrapedPlayerLink {
  playerIndex: number;
  playerName: string;
  url: string;
}

export interface ScrapedEpisode {
  episodeNumber: number;
  players: ScrapedPlayerLink[];
}

export interface ScrapedSeason {
  name: string;
  path: string;
  url: string;
  episodes: ScrapedEpisode[];
}

export interface ScrapedAnime {
  title: string;
  slug: string;
  url: string;
  thumbnail: string;
  description: string;
  genres: string[];
  studio?: string;
  year?: string;
  episodeCount?: string;
  seasons: ScrapedSeason[];
}

export interface ScrapeCatalogOptions {
  catalogUrl?: string;
  limit?: number;
  delayMs?: number;
  onProgress?: (message: string) => void;
}

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { ScrapedAnime } from '@/lib/scraper/anime-sama-types';
import { calculatePagination } from '@/lib/query-helpers';

export interface VideoRecord {
  id: number;
  title: string;
  description: string | null;
  imgUrl: string | null;
  videoUrl: string;
  time: string | null;
  actors: string | null;
  channels: string | null;
  categories: string | null;
  like: number;
  dislike: number;
  view: number;
  repport: number;
  createdAt: Date;
}

const DATA_FILE = join(process.cwd(), 'data', 'scraped-anime.json');

let cachedVideos: VideoRecord[] | null = null;
let cachedAnimes: ScrapedAnime[] | null = null;

const SCRAPED_ANIME_BLOB_URL = process.env.SCRAPED_ANIME_BLOB_URL || '';
const SCRAPED_ANIME_BLOB_TOKEN = process.env.SCRAPED_ANIME_BLOB_TOKEN || '';

let storeInitPromise: Promise<void> | null = null;

function buildVideosFromAnimes(animes: ScrapedAnime[]): VideoRecord[] {
  const videos: VideoRecord[] = [];
  let id = 1;

  for (const anime of animes) {
    const categories = unique(anime.genres).join(',');
    const channels = anime.studio ?? '';

    for (const season of anime.seasons) {
      for (const episode of season.episodes) {
        const playerUrls = episode.players.map((p) => p.url).filter(Boolean);
        if (!playerUrls.length) continue;

        videos.push({
          id: id++,
          title: `${anime.title} - ${season.name} - Épisode ${episode.episodeNumber}`,
          description: anime.description,
          imgUrl: anime.thumbnail,
          videoUrl: playerUrls.join(','),
          time: null,
          actors: '',
          channels,
          categories,
          like: 0,
          dislike: 0,
          view: 0,
          repport: 0,
          createdAt: new Date(),
        });
      }
    }
  }

  return videos;
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))];
}

async function loadAnimesFromBlob(): Promise<ScrapedAnime[]> {
  if (!SCRAPED_ANIME_BLOB_URL) return [];

  const headers: Record<string, string> = {};
  if (SCRAPED_ANIME_BLOB_TOKEN) {
    headers.Authorization = `Bearer ${SCRAPED_ANIME_BLOB_TOKEN}`;
  }

  const resp = await fetch(SCRAPED_ANIME_BLOB_URL, {
    headers,
  });
  if (!resp.ok) {
    throw new Error(`Impossible de charger SCRAPED_ANIME_BLOB_URL: HTTP ${resp.status}`);
  }

  // Attendu: JSON = ScrapedAnime[] (tableau). Si ton blob stocke { data: [...] }, adapte ici.
  const json = (await resp.json()) as unknown;
  if (Array.isArray(json)) return json as ScrapedAnime[];
  if (typeof json === 'object' && json && 'data' in json && Array.isArray((json as any).data)) {
    return (json as any).data as ScrapedAnime[];
  }
  return [];
}

async function ensureLoaded() {
  if (cachedVideos && cachedAnimes) return;
  if (storeInitPromise) return storeInitPromise;

  storeInitPromise = (async () => {
    // 1) Local (dev / si le fichier est embarqué)
    if (existsSync(DATA_FILE)) {
      const raw = readFileSync(DATA_FILE, 'utf-8');
      cachedAnimes = JSON.parse(raw) as ScrapedAnime[];
      cachedVideos = buildVideosFromAnimes(cachedAnimes);
      return;
    }

    // 2) Blob (Vercel)
    const animes = await loadAnimesFromBlob();
    cachedAnimes = animes;
    cachedVideos = buildVideosFromAnimes(animes);
  })();

  await storeInitPromise;
}

export async function ensureVideoStoreLoaded(): Promise<void> {
  await ensureLoaded();
}

function getScrapedAnimes(): ScrapedAnime[] {
  return cachedAnimes ?? [];
}

export function getVideos(): VideoRecord[] {
  return cachedVideos ?? [];
}

export function reloadVideos(): VideoRecord[] {
  cachedVideos = null;
  cachedAnimes = null;
  return cachedVideos;
}

function sortByName<T extends { name: string }>(entries: T[], order: string): T[] {
  const sorted = [...entries];
  if (order === 'Z->A') {
    return sorted.sort((a, b) => b.name.localeCompare(a.name));
  }
  return sorted.sort((a, b) => a.name.localeCompare(b.name));
}

function sortVideos(videos: VideoRecord[], order: string): VideoRecord[] {
  const sorted = [...videos];

  switch (order) {
    case 'More View':
      return sorted.sort((a, b) => b.view - a.view);
    case 'Most Popular':
      return sorted.sort((a, b) => b.like - a.like);
    case 'A->Z':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'Z->A':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'Latest':
    default:
      return sorted.sort((a, b) => b.id - a.id);
  }
}

function paginate<T>(items: T[], pageNbr: number, pageSize: number) {
  const { startSearchVideo } = calculatePagination(pageNbr, pageSize);
  return items.slice(startSearchVideo, startSearchVideo + pageSize);
}

export function getHomeVideos(order: string, pageNbr: number, pageSize: number) {
  const all = sortVideos(getVideos(), order);
  const total = all.length;
  const page = paginate(all, pageNbr, pageSize);

  return page.map((video) => ({
    id: video.id,
    title: video.title,
    imgUrl: video.imgUrl ?? '',
    time: video.time ?? '',
    like: video.like,
    dislike: video.dislike,
    view: video.view,
    nbr: Math.ceil(total / pageSize) || 1,
  }));
}

export function getVideoById(id: number): VideoRecord | undefined {
  return getVideos().find((video) => video.id === id);
}

export function getVideoDetail(id: number) {
  const video = getVideoById(id);
  if (!video) return null;

  const channel = video.channels?.split(',')[0]?.trim() ?? '';
  const sameChannel = getVideos().filter(
    (v) => v.id !== id && channel && v.channels?.includes(channel)
  );
  const others = getVideos().filter((v) => v.id !== id);

  const related = [...sameChannel, ...others].slice(0, 9).map((v) => ({
    id: v.id,
    title: v.title,
    imgUrl: v.imgUrl,
    view: v.view,
    like: v.like,
    dislike: v.dislike,
    time: v.time,
  }));

  return {
    channelCount: channel ? sameChannel.length + 1 : getVideos().length,
    video: {
      title: video.title,
      imgUrl: video.imgUrl,
      videoUrl: video.videoUrl,
      actors: video.actors,
      channels: video.channels,
      categories: video.categories,
      like: video.like,
      dislike: video.dislike,
      view: video.view,
      createdAt: video.createdAt,
    },
    related,
  };
}

export function getDataVideo(id: number) {
  const video = getVideoById(id);
  if (!video) return null;

  return {
    title: video.title,
    description: video.description,
    imgUrl: video.imgUrl,
    createdAt: video.createdAt,
    videoUrl: video.videoUrl,
  };
}

export function incrementView(id: number): boolean {
  const video = getVideoById(id);
  if (!video) return false;
  video.view += 1;
  return true;
}

export function incrementVal(id: number, cookie: 'l' | 'd' | 'r'): boolean {
  const video = getVideoById(id);
  if (!video) return false;

  if (cookie === 'l') video.like += 1;
  else if (cookie === 'd') video.dislike += 1;
  else video.repport += 1;

  return true;
}

type TypeKind = 'Channel' | 'Actor' | 'Categorie';

function getFieldForTable(table: TypeKind): keyof Pick<VideoRecord, 'channels' | 'actors' | 'categories'> {
  if (table === 'Actor') return 'actors';
  if (table === 'Categorie') return 'categories';
  return 'channels';
}

function getTypeEntries(table: TypeKind) {
  const field = getFieldForTable(table);
  const map = new Map<string, { name: string; imgUrl: string; count: number }>();

  for (const video of getVideos()) {
    const raw = video[field];
    if (!raw) continue;

    for (const name of raw.split(',').map((v) => v.trim()).filter(Boolean)) {
      const existing = map.get(name);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(name, { name, imgUrl: video.imgUrl ?? '', count: 1 });
      }
    }
  }

  return [...map.values()].filter((entry) => entry.count >= 1);
}

export function getAnimes(order: string, pageNbr: number, pageSize: number) {
  const entries = getScrapedAnimes().map((anime) => ({
    name: anime.title,
    imgUrl: anime.thumbnail,
    nbr: anime.seasons.reduce((sum, season) => sum + season.episodes.length, 0),
  }));

  const sorted = sortByName(entries, order);
  const total = sorted.length;
  const page = paginate(sorted, pageNbr, pageSize);

  return page.map((entry) => ({
    name: entry.name,
    imgUrl: entry.imgUrl,
    nbr: entry.nbr,
    nbrPages: Math.ceil(total / pageSize) || 1,
    nbrTt: total,
  }));
}

export function getAnimeVideos(
  animeName: string,
  order: string,
  pageNbr: number,
  pageSize: number
) {
  const prefix = `${animeName} - Saison`;
  const filtered = getVideos().filter((video) => video.title.startsWith(prefix));
  const sorted = sortVideos(filtered, order);
  const total = sorted.length;
  const page = paginate(sorted, pageNbr, pageSize);

  return page.map((video) => ({
    id: video.id,
    title: video.title,
    imgUrl: video.imgUrl ?? '',
    time: video.time ?? '',
    like: video.like,
    dislike: video.dislike,
    view: video.view,
    nbr: total,
    page: Math.ceil(total / pageSize) || 1,
  }));
}

export function getTypes(table: TypeKind, order: string, pageNbr: number, pageSize: number) {
  let entries = getTypeEntries(table);
  entries = sortByName(entries, order);

  const total = entries.length;
  const page = paginate(entries, pageNbr, pageSize);

  return page.map((entry) => ({
    name: entry.name,
    imgUrl: entry.imgUrl,
    nbr: entry.count,
    nbrPages: Math.ceil(total / pageSize) || 1,
    nbrTt: total,
  }));
}

export function getTypeVideos(
  table: TypeKind,
  name: string,
  order: string,
  pageNbr: number,
  pageSize: number
) {
  const field = getFieldForTable(table);
  const filtered = getVideos().filter((video) =>
    video[field]?.split(',').map((v) => v.trim()).includes(name)
  );
  const sorted = sortVideos(filtered, order);
  const total = sorted.length;
  const page = paginate(sorted, pageNbr, pageSize);

  return page.map((video) => ({
    id: video.id,
    title: video.title,
    imgUrl: video.imgUrl ?? '',
    time: video.time ?? '',
    like: video.like,
    dislike: video.dislike,
    view: video.view,
    nbr: total,
    page: Math.ceil(total / pageSize) || 1,
  }));
}

export function searchVideos(
  search: string,
  type: 'videos' | 'animes' | 'studios' | 'genres',
  order: string,
  pageNbr: number,
  pageSize: number
) {
  const query = search.toLowerCase();

  if (type === 'videos') {
    const filtered = getVideos().filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        (video.description ?? '').toLowerCase().includes(query)
    );
    const sorted = sortVideos(filtered, order);
    const total = sorted.length;
    const page = paginate(sorted, pageNbr, pageSize);

    return page.map((video) => ({
      id: video.id,
      title: video.title,
      imgUrl: video.imgUrl ?? '',
      like: video.like,
      dislike: video.dislike,
      view: video.view,
      time: video.time ?? '',
      nbrPage: Math.ceil(total / pageSize) || 1,
      nbr: total,
    }));
  }

  if (type === 'animes') {
    let entries = getScrapedAnimes()
      .filter((anime) => anime.title.toLowerCase().includes(query))
      .map((anime) => ({
        name: anime.title,
        imgUrl: anime.thumbnail,
        count: anime.seasons.reduce((sum, season) => sum + season.episodes.length, 0),
      }));

    entries = sortByName(entries, order);
    const total = entries.length;
    const page = paginate(entries, pageNbr, pageSize);

    return page.map((entry) => ({
      name: entry.name,
      imgUrl: entry.imgUrl,
      nbrPage: Math.ceil(total / pageSize) || 1,
      nbr: total,
    }));
  }

  const table = type === 'genres' ? 'Categorie' : 'Channel';
  const field = getFieldForTable(table as TypeKind);

  const entries = getTypeEntries(table as TypeKind).filter((entry) =>
    entry.name.toLowerCase().includes(query)
  );

  const total = entries.length;
  const page = paginate(entries, pageNbr, pageSize);

  return page.map((entry) => ({
    name: entry.name,
    imgUrl: entry.imgUrl,
    nbrPage: Math.ceil(total / pageSize) || 1,
    nbr: total,
  }));
}

export function getTableNames(table: TypeKind): Array<{ name: string }> {
  return getTypeEntries(table).map((entry) => ({ name: entry.name }));
}

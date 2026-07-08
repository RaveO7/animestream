import { existsSync, readFileSync } from 'fs';
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
const SCRAPED_ANIME_JSON_URL = process.env.SCRAPED_ANIME_JSON_URL;

let cachedVideos: VideoRecord[] | null = null;
let cachedAnimes: ScrapedAnime[] | null = null;
let animesPromise: Promise<ScrapedAnime[]> | null = null;
let videosPromise: Promise<VideoRecord[]> | null = null;

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    const normalized = v.trim();
    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

async function loadScrapedAnimes(): Promise<ScrapedAnime[]> {
  if (cachedAnimes) return cachedAnimes;
  if (animesPromise) return animesPromise;

  animesPromise = (async () => {
    if (SCRAPED_ANIME_JSON_URL) {
      const res = await fetch(SCRAPED_ANIME_JSON_URL, {
        headers: { 'User-Agent': 'anime-stream/1.0' },
      });
      if (!res.ok) {
        throw new Error(`Impossible de charger SCRAPED_ANIME_JSON_URL (HTTP ${res.status})`);
      }
      const json = (await res.json()) as ScrapedAnime[];
      cachedAnimes = json;
      return json;
    }

    if (!existsSync(DATA_FILE)) {
      cachedAnimes = [];
      return cachedAnimes;
    }

    const raw = readFileSync(DATA_FILE, 'utf-8');
    cachedAnimes = JSON.parse(raw) as ScrapedAnime[];
    return cachedAnimes;
  })();

  cachedAnimes = await animesPromise;
  return cachedAnimes;
}

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

async function loadVideos(): Promise<VideoRecord[]> {
  if (cachedVideos) return cachedVideos;
  if (videosPromise) return videosPromise;

  videosPromise = (async () => {
    const animes = await loadScrapedAnimes();
    const vids = buildVideosFromAnimes(animes);
    cachedVideos = vids;
    return vids;
  })();

  cachedVideos = await videosPromise;
  return cachedVideos;
}

export async function getVideos(): Promise<VideoRecord[]> {
  return loadVideos();
}

export function reloadVideos() {
  cachedVideos = null;
  cachedAnimes = null;
  animesPromise = null;
  videosPromise = null;
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

export async function getHomeVideos(order: string, pageNbr: number, pageSize: number) {
  const all = sortVideos(await getVideos(), order);
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

export async function getVideoById(id: number): Promise<VideoRecord | undefined> {
  const videos = await getVideos();
  return videos.find((video) => video.id === id);
}

export async function getVideoDetail(id: number) {
  const video = await getVideoById(id);
  if (!video) return null;

  const channel = video.channels?.split(',')[0]?.trim() ?? '';
  const videos = await getVideos();
  const sameChannel = videos.filter(
    (v) => v.id !== id && channel && v.channels?.includes(channel)
  );
  const others = videos.filter((v) => v.id !== id);

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
    channelCount: channel ? sameChannel.length + 1 : videos.length,
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

export async function getDataVideo(id: number) {
  const video = await getVideoById(id);
  if (!video) return null;

  return {
    title: video.title,
    description: video.description,
    imgUrl: video.imgUrl,
    createdAt: video.createdAt,
    videoUrl: video.videoUrl,
  };
}

export async function incrementView(id: number): Promise<boolean> {
  const video = await getVideoById(id);
  if (!video) return false;
  video.view += 1;
  return true;
}

export async function incrementVal(id: number, cookie: 'l' | 'd' | 'r'): Promise<boolean> {
  const video = await getVideoById(id);
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

async function getTypeEntries(table: TypeKind) {
  const field = getFieldForTable(table);
  const entriesByName: Record<string, { name: string; imgUrl: string; count: number }> = {};

  const videos = await getVideos();
  for (const video of videos) {
    const raw = video[field];
    if (!raw) continue;

    for (const name of raw.split(',').map((v) => v.trim()).filter(Boolean)) {
      if (!entriesByName[name]) {
        entriesByName[name] = { name, imgUrl: video.imgUrl ?? '', count: 1 };
      } else {
        entriesByName[name].count += 1;
      }
    }
  }

  const out: Array<{ name: string; imgUrl: string; count: number }> = [];
  // for..in avoids iterating Map/iterator types (downlevelIteration issues)
  for (const key in entriesByName) {
    const entry = entriesByName[key];
    if (!entry) continue;
    if (entry.count >= 1) out.push(entry);
  }
  return out;
}

export async function getAnimes(order: string, pageNbr: number, pageSize: number) {
  const animes = await loadScrapedAnimes();
  const entries = animes.map((anime) => ({
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

export async function getAnimeVideos(
  animeName: string,
  order: string,
  pageNbr: number,
  pageSize: number
) {
  const prefix = `${animeName} - Saison`;
  const filtered = (await getVideos()).filter((video) => video.title.startsWith(prefix));
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

export async function getTypes(table: TypeKind, order: string, pageNbr: number, pageSize: number) {
  let entries = await getTypeEntries(table);
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

export async function getTypeVideos(
  table: TypeKind,
  name: string,
  order: string,
  pageNbr: number,
  pageSize: number
) {
  const field = getFieldForTable(table);
  const filtered = (await getVideos()).filter((video) =>
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

export async function searchVideos(
  search: string,
  type: 'videos' | 'animes' | 'studios' | 'genres',
  order: string,
  pageNbr: number,
  pageSize: number
) {
  const query = search.toLowerCase();

  if (type === 'videos') {
    const filtered = (await getVideos()).filter(
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
    let entries = (await loadScrapedAnimes())
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

  const entries = (await getTypeEntries(table as TypeKind)).filter((entry) =>
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

export async function getTableNames(table: TypeKind): Promise<Array<{ name: string }>> {
  const entries = await getTypeEntries(table);
  return entries.map((entry) => ({ name: entry.name }));
}

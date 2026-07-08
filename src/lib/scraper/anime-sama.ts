import * as cheerio from 'cheerio';
import type {
  ScrapeCatalogOptions,
  ScrapedAnime,
  ScrapedEpisode,
  ScrapedPlayerLink,
  ScrapedSeason,
} from './anime-sama-types';

const BASE_URL = 'https://anime-sama.to';

export const DEFAULT_CATALOG_URL =
  'https://anime-sama.to/catalogue/?type%5B%5D=Anime&langue%5B%5D=VOSTFR&annee_min=2025&annee_max=2026&episodes_min=&episodes_max=&chapitres_min=&chapitres_max=&search=';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

function animeSlugFromUrl(url: string): string {
  const match = url.match(/\/catalogue\/([^/?#]+)/i);
  return match?.[1] ?? '';
}

export async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} pour ${url}`);
  }

  return response.text();
}

export function parseCatalogAnimeUrls(html: string, limit = 5): string[] {
  const $ = cheerio.load(html);
  const urls: string[] = [];
  const seen = new Set<string>();

  $('#list_catalog a[href*="/catalogue/"]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;

    const url = absoluteUrl(href);
    const slug = animeSlugFromUrl(url);
    if (!slug || slug === 'catalogue' || seen.has(slug)) return;

    seen.add(slug);
    urls.push(url.endsWith('/') ? url : `${url}/`);
    if (urls.length >= limit) return false;
  });

  return urls;
}

export function parseSeasonLinks(html: string): Array<{ name: string; path: string }> {
  const seasons: Array<{ name: string; path: string }> = [];
  const scriptContents = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) ?? [];

  for (const scriptTag of scriptContents) {
    if (!scriptTag.includes('panneauAnime')) continue;

    const content = scriptTag
      .replace(/<script[^>]*>/i, '')
      .replace(/<\/script>/i, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    const regex = /panneauAnime\s*\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      seasons.push({ name: match[1], path: match[2] });
    }
  }

  return seasons;
}

export function parseAnimeDetails(html: string, url: string): Omit<ScrapedAnime, 'seasons'> {
  const $ = cheerio.load(html);
  const slug = animeSlugFromUrl(url);

  const title =
    $('h1').first().text().trim() ||
    $('meta[property="og:title"]').attr('content')?.trim() ||
    slug;

  const thumbnail =
    $('#coverOeuvre').attr('src') ||
    $('meta[property="og:image"]').attr('content') ||
    '';

  const description = $('#synopsisText').text().trim();

  const genres = [
    ...new Set(
      $('.genre-pill')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(Boolean)
    ),
  ];

  const studio = $('#studioText').text().trim() || undefined;
  const year = $('.info-val')
    .filter((_, el) => {
      const label = $(el).prev('.info-lbl').text();
      return label.includes('Année');
    })
    .first()
    .text()
    .trim() || undefined;

  const episodeCount = $('.info-val')
    .filter((_, el) => {
      const label = $(el).prev('.info-lbl').text();
      return label.includes('Épisodes');
    })
    .first()
    .text()
    .trim() || undefined;

  return {
    title,
    slug,
    url,
    thumbnail,
    description,
    genres,
    studio,
    year,
    episodeCount,
  };
}

export function parseEpisodesJsUrl(html: string, seasonUrl: string): string {
  const match = html.match(/<script[^>]+src=['"]([^'"]*episodes\.js[^'"]*)['"]/i);
  if (!match?.[1]) {
    throw new Error(`episodes.js introuvable sur ${seasonUrl}`);
  }

  const scriptPath = match[1].startsWith('http')
    ? match[1]
    : new URL(match[1], seasonUrl).toString();

  return scriptPath;
}

export function parseEpisodesJs(jsContent: string): ScrapedEpisode[] {
  const players: Record<string, string[]> = {};
  const regex = /var\s+(eps\d+)\s*=\s*\[([\s\S]*?)\];/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(jsContent)) !== null) {
    const playerName = match[1];
    const urls = [...match[2].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1].trim());
    players[playerName] = urls;
  }

  const playerNames = Object.keys(players).sort((a, b) => {
    const numA = Number.parseInt(a.replace('eps', ''), 10);
    const numB = Number.parseInt(b.replace('eps', ''), 10);
    return numA - numB;
  });

  if (!playerNames.length) return [];

  const episodeCount = Math.max(...playerNames.map((name) => players[name].length));
  const episodes: ScrapedEpisode[] = [];

  for (let i = 0; i < episodeCount; i++) {
    const episodePlayers: ScrapedPlayerLink[] = [];

    playerNames.forEach((playerName, index) => {
      const url = players[playerName][i];
      if (!url) return;
      episodePlayers.push({
        playerIndex: index + 1,
        playerName,
        url,
      });
    });

    episodes.push({
      episodeNumber: i + 1,
      players: episodePlayers,
    });
  }

  return episodes;
}

export async function scrapeSeason(
  animeUrl: string,
  season: { name: string; path: string }
): Promise<ScrapedSeason> {
  const seasonUrl = absoluteUrl(`${animeUrl.replace(/\/$/, '')}/${season.path}/`);
  const html = await fetchHtml(seasonUrl);
  const episodesJsUrl = parseEpisodesJsUrl(html, seasonUrl);
  const episodesJs = await fetchHtml(episodesJsUrl);
  const episodes = parseEpisodesJs(episodesJs);

  return {
    name: season.name,
    path: season.path,
    url: seasonUrl,
    episodes,
  };
}

export async function scrapeAnime(
  animeUrl: string,
  options: Pick<ScrapeCatalogOptions, 'delayMs' | 'onProgress'> = {}
): Promise<ScrapedAnime> {
  const { delayMs = 500, onProgress } = options;
  onProgress?.(`Anime : ${animeUrl}`);

  const html = await fetchHtml(animeUrl);
  const details = parseAnimeDetails(html, animeUrl);
  const seasonLinks = parseSeasonLinks(html);

  if (!seasonLinks.length) {
    throw new Error(`Aucune saison trouvée pour ${animeUrl}`);
  }

  const seasons: ScrapedSeason[] = [];

  for (const season of seasonLinks) {
    onProgress?.(`  Saison : ${season.name}`);
    if (delayMs > 0) await sleep(delayMs);
    seasons.push(await scrapeSeason(animeUrl, season));
  }

  return { ...details, seasons };
}

export async function scrapeCatalog(
  options: ScrapeCatalogOptions = {}
): Promise<ScrapedAnime[]> {
  const {
    catalogUrl = DEFAULT_CATALOG_URL,
    limit = 5,
    delayMs = 500,
    onProgress,
  } = options;

  onProgress?.(`Catalogue : ${catalogUrl}`);
  const catalogHtml = await fetchHtml(catalogUrl);
  const animeUrls = parseCatalogAnimeUrls(catalogHtml, limit);

  if (!animeUrls.length) {
    throw new Error('Aucun animé trouvé dans le catalogue');
  }

  onProgress?.(`${animeUrls.length} animé(s) trouvé(s)`);

  const results: ScrapedAnime[] = [];

  for (const animeUrl of animeUrls) {
    if (delayMs > 0) await sleep(delayMs);
    results.push(await scrapeAnime(animeUrl, { delayMs, onProgress }));
  }

  return results;
}

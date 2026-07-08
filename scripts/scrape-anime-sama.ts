import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { scrapeCatalog } from '../src/lib/scraper/anime-sama';
import { reloadVideos } from '../src/lib/data/video-store';
import { printScrapedCatalog, printScrapedSummary } from '../src/lib/scraper/display-results';

const OUTPUT_DIR = join(process.cwd(), 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'scraped-anime.json');

async function main() {
  const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
  const limit = limitArg ? Number.parseInt(limitArg.split('=')[1], 10) : 25;

  console.log(`Scraping des ${limit} premiers animés depuis Anime-Sama...`);
  console.log('(récupération en cours, affichage détaillé à la fin)\n');

  const results = await scrapeCatalog({
    limit,
    delayMs: 600,
    onProgress: (message) => console.log(`  → ${message}`),
  });

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');
  reloadVideos();

  printScrapedCatalog(results);
  printScrapedSummary(results, OUTPUT_FILE);
}

main().catch((error) => {
  console.error('Erreur de scraping :', error);
  process.exit(1);
});

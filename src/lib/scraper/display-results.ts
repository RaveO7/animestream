import type { ScrapedAnime } from './anime-sama-types';

const SEPARATOR = '═'.repeat(60);
const SUB_SEPARATOR = '─'.repeat(40);

function printLine(label: string, value: string) {
  console.log(`${label.padEnd(14)} ${value}`);
}

export function printScrapedCatalog(animes: ScrapedAnime[]) {
  console.log(`\n${SEPARATOR}`);
  console.log(' RÉSULTATS DU SCRAPING');
  console.log(SEPARATOR);

  animes.forEach((anime, index) => {
    if (index > 0) {
      console.log(`\n${SEPARATOR}\n`);
    }

    console.log(`\n[ ${index + 1} / ${animes.length} ] ${anime.title.toUpperCase()}\n`);
    printLine('Titre :', anime.title);
    printLine('URL :', anime.url);
    printLine('Image :', anime.thumbnail);
    printLine('Genres :', anime.genres.join(', ') || '—');

    if (anime.studio) printLine('Studio :', anime.studio);
    if (anime.year) printLine('Année :', anime.year);

    console.log(`\n${'Description'.padEnd(14)} ${anime.description || '—'}`);

    for (const season of anime.seasons) {
      console.log(`\n${SUB_SEPARATOR}`);
      console.log(`  ${season.name.toUpperCase()} (${season.episodes.length} épisode(s))`);
      console.log(`  ${season.url}`);
      console.log(SUB_SEPARATOR);

      for (const episode of season.episodes) {
        console.log(`\n  Épisode ${episode.episodeNumber}`);

        if (!episode.players.length) {
          console.log('    (aucun lecteur trouvé)');
          continue;
        }

        episode.players.forEach((player) => {
          console.log(`    Lecteur ${player.playerIndex} (${player.playerName}) : ${player.url}`);
        });
      }
    }
  });

  console.log(`\n${SEPARATOR}\n`);
}

export function printScrapedSummary(animes: ScrapedAnime[], outputFile: string) {
  const totalEpisodes = animes.reduce(
    (sum, anime) => sum + anime.seasons.reduce((s, season) => s + season.episodes.length, 0),
    0
  );
  const totalLinks = animes.reduce(
    (sum, anime) =>
      sum +
      anime.seasons.reduce(
        (s, season) =>
          s + season.episodes.reduce((e, ep) => e + ep.players.length, 0),
        0
      ),
    0
  );

  console.log(`Résumé : ${animes.length} animé(s) | ${totalEpisodes} épisode(s) | ${totalLinks} lien(s) lecteur`);
  console.log(`Export JSON : ${outputFile}`);
}

# AnimeStream

Plateforme de streaming d'animés — projet fullstack portfolio.

## Données

Les vidéos proviennent du fichier `data/scraped-anime.json`, généré par le scraper Anime-Sama.

```bash
npm run scrape
```


- Catalogue de vidéos avec lecteur intégré
- Navigation par studios, personnages et genres
- Recherche avancée avec filtres
- Système de likes/dislikes et compteur de vues
- SEO optimisé (sitemaps, métadonnées OpenGraph)

## Déploiement Vercel (données en Blob)

1. Lance le scrape en local (pour générer/mettre à jour `data/scraped-anime.json`) :
   ```bash
   npm run scrape
   ```
2. Uploade `data/scraped-anime.json` dans **Vercel Blob** (ou mets le JSON sur une URL publique/accessible).
3. Dans Vercel, configure les variables d’environnement :
   - `SCRAPED_ANIME_BLOB_URL` : URL du JSON
   - `SCRAPED_ANIME_BLOB_TOKEN` : optionnel (si le blob demande une auth)

## Lancement

```bash
npm install
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000).

## Auteur

Phoenix — Projet portfolio

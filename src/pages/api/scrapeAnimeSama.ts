import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeCatalog } from '@/lib/scraper/anime-sama';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const limit = Math.min(Number(req.body?.limit) || 5, 10);
    const results = await scrapeCatalog({ limit, delayMs: 600 });

    return res.status(200).json({
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Erreur interne',
    });
  }
}

import { MetadataRoute } from 'next'
import { CHUNK } from '@/lib/sitemap-config';
import { normalizeUrl } from '@/components/Utils';

export const revalidate = 3600 * 12;

export async function generateSitemaps() {
    // On évite de lire data/scraped-anime.json pendant le build.
    // sitemap vide -> limite la mémoire/CPU sur Vercel.
    return [{ id: 0 }];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    // sitemap vide
    return [];
}

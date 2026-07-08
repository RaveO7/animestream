import { MetadataRoute } from 'next'
import { CHUNK } from '@/lib/sitemap-config';
import { normalizeUrl } from '@/components/Utils';

export const revalidate = 3600 * 24;

export async function generateSitemaps() {
    // sitemap neutre (évite de charger data/scraped-anime.json pendant le build)
    return [{ id: 0 }];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    return [];
}

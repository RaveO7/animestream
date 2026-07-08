import { MetadataRoute } from 'next'
import { CHUNK } from '@/lib/sitemap-config';
import { normalizeUrl } from '@/components/Utils';
import { ensureVideoStoreLoaded, getTableNames } from '@/lib/data/video-store';

export const revalidate = 3600 * 24;

export async function generateSitemaps() {
    await ensureVideoStoreLoaded();
    const count = getTableNames('Actor').length;
    const numberOfSitemaps = Math.max(1, Math.ceil(count / CHUNK));
    return Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    await ensureVideoStoreLoaded();
    const start = id * CHUNK;
    const actors = getTableNames('Actor').slice(start, start + CHUNK);

    return actors.map(({ name }) => ({
        url: normalizeUrl(process.env.Site_URL || '', `character/${encodeURIComponent(name)}`),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.45,
    }));
}

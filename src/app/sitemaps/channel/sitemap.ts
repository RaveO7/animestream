import { MetadataRoute } from 'next'
import { CHUNK } from '@/lib/sitemap-config';
import { normalizeUrl } from '@/components/Utils';
import { getTableNames } from '@/lib/data/video-store';

export const revalidate = 3600 * 24;

export async function generateSitemaps() {
    const count = getTableNames('Channel').length;
    const numberOfSitemaps = Math.max(1, Math.ceil(count / CHUNK));
    return Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const start = id * CHUNK;
    const channels = getTableNames('Channel').slice(start, start + CHUNK);

    return channels.map(({ name }) => ({
        url: normalizeUrl(process.env.Site_URL || '', `studio/${encodeURIComponent(name)}`),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.45,
    }));
}

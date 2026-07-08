import { MetadataRoute } from 'next'
import { CHUNK } from '@/lib/sitemap-config';
import { normalizeUrl } from '@/components/Utils';
import { ensureVideoStoreLoaded, getVideos } from '@/lib/data/video-store';

export const revalidate = 3600 * 12;

export async function generateSitemaps() {
    await ensureVideoStoreLoaded();
    const totalVideos = getVideos().length;
    const numberOfSitemaps = Math.max(1, Math.ceil(totalVideos / CHUNK));
    return Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    await ensureVideoStoreLoaded();
    const skip = id * CHUNK;
    const videos = getVideos().slice(skip, skip + CHUNK);

    return videos.map(({ id, title, createdAt }) => ({
        url: normalizeUrl(process.env.Site_URL || '', `videos/${id}?name=${encodeURIComponent(title)}`),
        lastModified: createdAt || new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));
}

import { MetadataRoute } from 'next'
import { normalizeUrl } from '@/components/Utils';
import { getVideos } from '@/lib/data/video-store';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentVideos = getVideos()
        .filter((video) => video.createdAt >= sevenDaysAgo)
        .slice(0, 1000);

    return recentVideos.map(({ id, title, createdAt }) => ({
        url: normalizeUrl(process.env.Site_URL || '', `videos/${id}?name=${encodeURIComponent(title)}`),
        lastModified: createdAt || new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));
}

import { MetadataRoute } from 'next'
import { normalizeUrl } from '@/components/Utils';
import { ensureVideoStoreLoaded, getVideos } from '@/lib/data/video-store';

export const revalidate = 3600 * 24;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const urlSite: string = normalizeUrl(process.env.Site_URL || '')
    const now = new Date()
    await ensureVideoStoreLoaded()
    const videos = getVideos()
    const lastVideoDate = videos.length ? videos[videos.length - 1].createdAt : now

    return [
        {
            url: urlSite,
            lastModified: lastVideoDate,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: normalizeUrl(urlSite, 'animes'),
            lastModified: lastVideoDate,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: normalizeUrl(urlSite, 'studios'),
            lastModified: lastVideoDate,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: normalizeUrl(urlSite, 'genres'),
            lastModified: lastVideoDate,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        ...videos.map((video) => ({
            url: normalizeUrl(urlSite, `videos/${video.id}`),
            lastModified: video.createdAt,
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        })),
    ]
}

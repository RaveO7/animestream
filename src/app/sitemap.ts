import { MetadataRoute } from 'next'
import { normalizeUrl } from '@/components/Utils';

export const revalidate = 3600 * 24;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const urlSite: string = normalizeUrl(process.env.Site_URL || '')
    const now = new Date()
    const lastVideoDate = now

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
    ]
}

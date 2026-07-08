import type { MetadataRoute } from 'next'
import { normalizeUrl } from '@/components/Utils'

export default function robots(): MetadataRoute.Robots {

    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/videos', '/genre', '/anime', '/studio', '/animes', '/search'],
                disallow: '/private/',
            }
        ],
        sitemap: normalizeUrl(process.env.Site_URL || '', 'sitemap.xml'),
    }
}

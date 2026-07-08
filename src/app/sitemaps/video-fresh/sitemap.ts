import { MetadataRoute } from 'next'
import { normalizeUrl } from '@/components/Utils';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // sitemap vide pour éviter la lecture du JSON lourd pendant le build
    return [];
}

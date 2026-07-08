import { upperFirstLetter, normalizeUrl } from '@/components/Utils'

export const dynamicParams = false
export async function generateStaticParams() {
	return [
		{ type: 'animes' },
		{ type: 'studios' },
		{ type: 'genres' },
	]
}

export async function generateMetadata({ params, }: { params: { id: string, type: string }; }) {
    const { type } = params;
    const typeLabel = upperFirstLetter(type);
    const url = normalizeUrl(process.env.Site_URL || '', type);

    return {
        title: `${typeLabel} | AnimeStream`,
        description: `Découvrez tous les ${type} sur AnimeStream. Parcourez du contenu anime HD avec animés, studios et genres.`,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `${typeLabel} - AnimeStream`,
            description: `Découvrez tous les ${type} sur AnimeStream, votre plateforme de streaming d'animés.`,
            url: url,
            siteName: "AnimeStream",
            locale: "fr_FR",
            type: "website",
            images: [{
                url: '/opengraph-image.png',
                alt: `AnimeStream - ${typeLabel}`,
                width: 1200,
                height: 630,
                type: "image/png"
            }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${typeLabel} - AnimeStream`,
            description: `Découvrez tous les ${type} sur AnimeStream.`,
            images: ['/opengraph-image.png'],
        }
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }

import type { Metadata } from 'next'
import { upperFirstLetter, normalizeUrl } from '@/components/Utils'

type Props = { params: { name: string, type: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const decodedName = decodeURI(params.name);
    const typeLabel = params.type === 'videos' ? 'vidéos' : 
                     params.type === 'animes' ? 'animés' :
                     params.type === 'studios' ? 'studios' : 'genres';
    const title = `Recherche : ${decodedName} - ${upperFirstLetter(typeLabel)} | AnimeStream`;
    const description = `Résultats de recherche pour "${decodedName}" dans ${typeLabel} sur AnimeStream. Parcourez du contenu anime HD.`;
    const url = normalizeUrl(process.env.Site_URL || '', `search/${params.type}/${params.name}`);

    return {
        title: title,
        description: description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `Recherche : ${decodedName} - ${upperFirstLetter(typeLabel)}`,
            description: description,
            url: url,
            siteName: "AnimeStream",
            locale: "fr_FR",
            type: "website",
            images: [{
                url: '/opengraph-image.png',
                alt: `AnimeStream - Recherche : ${decodedName}`,
                width: 1200,
                height: 630,
                type: "image/png"
            }],
        },
        twitter: {
            card: "summary_large_image",
            title: `Recherche : ${decodedName} - ${upperFirstLetter(typeLabel)}`,
            description: description,
            images: ['/opengraph-image.png'],
        }
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }

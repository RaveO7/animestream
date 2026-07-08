import { normalizeUrl } from '@/components/Utils'

export async function generateMetadata({ params }: { params: { id: string, type: string }; }) {
    const { id, type } = params;
    const decodedId = decodeURI(id);
    const typeLabel = type === 'anime' ? 'animé' :
                     type === 'studio' ? 'studio' :
                     type === 'genre' ? 'genre' : type;
    const title = `${decodedId} - ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} | AnimeStream`;
    const description = `Découvrez ${decodedId} sur AnimeStream. Regardez des animés HD mettant en avant ${decodedId}.`;
    const url = normalizeUrl(process.env.Site_URL || '', `${type}/${id}`);

    return {
        title: title,
        description: description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `${decodedId} - ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)}`,
            description: description,
            url: url,
            siteName: "AnimeStream",
            locale: "fr_FR",
            type: "website",
            images: [{
                url: '/opengraph-image.png',
                alt: `AnimeStream - ${decodedId}`,
                width: 1200,
                height: 630,
                type: "image/png"
            }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${decodedId} - ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)}`,
            description: description,
            images: ['/opengraph-image.png'],
        }
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<>{children}</>) }

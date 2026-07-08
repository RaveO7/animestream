// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from 'next/font/google'

import './globals.css'

import Header from '../components/Header'
import WelcomeModal from '@/components/WelcomeModal'
import Footer from '@/components/Footer';
import AdsBoot from '@/components/ads/AdsBoot'
import StickyFooterAd from '@/components/ads/StickyFooterAd'
import { TopLeaderboardAd } from '@/components/ads/placements'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

import { normalizeUrl } from '@/components/Utils'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.Site_URL as string),
  title: {
    absolute: '',
    default: 'AnimeStream | Votre plateforme de streaming d\'animés',
    template: '%s | AnimeStream'
  },
  keywords: ['AnimeStream', 'anime', 'streaming anime', 'regarder anime', 'épisodes anime', 'anime HD', 'anime gratuit', 'manga', 'japonimation', 'studios anime', 'genres anime', 'personnages anime'],
  description: 'Regardez vos animés préférés en streaming HD sur AnimeStream. Épisodes, studios, personnages et genres — tout en un seul endroit.',
  applicationName: 'AnimeStream',
  authors: [{ name: "Phoenix", url: normalizeUrl(process.env.Site_URL || '') }],
  publisher: 'Phoenix',
  alternates: { canonical: normalizeUrl(process.env.Site_URL || '') },
  robots: 'max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    title: "AnimeStream - Streaming d'animés en HD",
    description: "AnimeStream - La plateforme pour regarder vos animés préférés. Streaming HD gratuit avec studios, personnages et genres.",
    url: normalizeUrl(process.env.Site_URL || ''),
    siteName: "AnimeStream",
    locale: "fr_FR",
    type: "website",
    images: [{
      url: '/opengraph-image.png',
      alt: 'AnimeStream - Plateforme de streaming d\'animés',
      width: 1200,
      height: 630,
      type: "image/png"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AnimeStream - Streaming d'animés en HD",
    description: "AnimeStream - Regardez vos animés préférés en streaming HD gratuit.",
    images: ['/opengraph-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: 'black',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Next gère automatiquement les meta tags via `export const metadata` */}
      </head>

      <body className={inter.className} suppressHydrationWarning={true}>
        <GoogleAnalytics gaId="G-BCSQYEJTZZ" />
        <SpeedInsights />
        <Analytics />

        <WelcomeModal />
        <AdsBoot />

        <main className="flex min-h-screen flex-col items-center">
          <Header />
          <section className="w-full mt-[72px] py-6 lg:px-12 min-h-[calc(100vh-92px)] ">
            <TopLeaderboardAd />
            {children}
          </section>
          <Footer />
        </main>

        <StickyFooterAd />
      </body>
    </html>
  )
}

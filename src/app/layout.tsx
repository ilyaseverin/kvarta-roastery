import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@fontsource-variable/golos-text';
import '@fontsource-variable/unbounded';
import { ATTRIBUTION_BOOTSTRAP } from '@/lib/attribution';
import './globals.css';

const site = 'https://kvarta-roastery-ilya.netlify.app';
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: 'Кварта — свежая обжарка кофе в Минске',
  description: 'В четверг обжариваем, в пятницу привозим. Кофе маленькими партиями по 5 кг. Зерно от 26 BYN, подписка 2 × 250 г — 54 BYN в месяц.',
  openGraph: { type: 'website', locale: 'ru_BY', url: site, siteName: 'Кварта', title: 'В четверг обжариваем. В пятницу привозим.', description: 'Свежий кофе из маленькой минской мастерской. Зерно, дрипы и подписка с доставкой.', images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Кварта — обжарка кофе в Минске' }] },
  twitter: { card: 'summary_large_image', title: 'Кварта — кофе из мастерской', description: 'Свежая обжарка по четвергам, доставка по Минску в пятницу.', images: ['/og.jpg'] },
  icons: { icon: '/favicon.svg' },
};
export const viewport: Viewport = { themeColor: '#241c18' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body><Script id="kvarta-attribution" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: ATTRIBUTION_BOOTSTRAP }} />{children}</body></html>;
}

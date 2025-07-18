// 100 % expanded – overwrite the file
import Script from 'next/script';
import 'src/styles/globals.css';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import LenisProvider from '@/components/LenisProvider';
import AOSWrapper from '@/components/AOSWrapper';

import {Analytics} from '@vercel/analytics/react';
import {SpeedInsights} from '@vercel/speed-insights/next';

export const metadata = {
  title: 'Green Sparrow Tattoo',
  description: 'Experience tattoo artistry and visual storytelling'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
            href="https://fonts.googleapis.com/css2?family=Sancreek&family=Lora:ital,wght@0,400;0,700;1,400&display=swap"
            rel="stylesheet"/>
      </head>

      <body className="bg-background text-foreground antialiased font-display">
      {/* Google Maps SDK */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />

      {/* ⚠️  NO jQuery / turn.js <script> tags here – they come from npm */}
        <LoadingScreen>
          <LenisProvider>
            <AOSWrapper>
              <Navbar />
              <main id="main" role="main">{children}</main>
              <Footer />
            </AOSWrapper>
          </LenisProvider>
        </LoadingScreen>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

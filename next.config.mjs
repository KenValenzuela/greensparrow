/** @type {import('next').NextConfig} */
const nextConfig = {
  /* ─────────────  Images  ───────────── */
  images: {
    formats: ['image/avif', 'image/webp'],
    // local + Unsplash
    remotePatterns: [
      {protocol: 'https', hostname: 'images.unsplash.com'},
      {protocol: 'https', hostname: 'www.greensparrowtattoocompany.com'},
    ],
  },

  /* ─────────────  Global security headers  ───────────── */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // CSP comes from middleware (adds a fresh nonce each request)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {key: 'X-Frame-Options', value: 'DENY'},
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
          {key: 'Cross-Origin-Opener-Policy', value: 'same-origin'},
        ],
      },
    ];
  },
};

export default nextConfig;

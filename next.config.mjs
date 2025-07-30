/** @type {import('next').NextConfig} */
const nextConfig = {
  // other Next.js settings …

  /* ----------  Security headers  ---------- */
  async headers() {
    const securityHeaders = [
      /* CSP – tweak sources to match your actual stack */
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' https://maps.googleapis.com",       // no  'unsafe-inline'
          "style-src  'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src    'self' data: https://images.unsplash.com",
          "font-src   'self' https://fonts.gstatic.com",
          "connect-src 'self'",
          "frame-ancestors 'none'",                              // click‑jacking
          "object-src 'none'",
          "base-uri 'self'",
        ].join('; ')
      },

      /* HSTS – forces HTTPS, 2 years + preload */
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },

      /* COOP – process isolation */
      {key: 'Cross-Origin-Opener-Policy', value: 'same-origin'},

      /* Legacy click‑jacking fallback */
      {key: 'X-Frame-Options', value: 'DENY'},

      /* Bonus: keep referrers tight */
      {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
    ];

    return [
      {
        source: '/(.*)',                 // apply to every route
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

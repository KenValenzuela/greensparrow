/** @type {import('next').NextConfig} */
const nextConfig = {
  source: '/(.*)',
  headers: [
    {
      key: 'Content-Security-Policy',
      value: "default-src 'self'; img-src 'self' https://images.unsplash.com; script-src 'self' 'unsafe-inline' https://maps.googleapis.com; frame-ancestors 'none'"
    },
    {key: 'Cross-Origin-Opener-Policy', value: 'same-origin'},
    {key: 'X-Frame-Options', value: 'DENY'}
  ]
};

export default nextConfig;

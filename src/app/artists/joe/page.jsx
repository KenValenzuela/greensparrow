'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RemovedArtist() {
  const router = useRouter();
  useEffect(() => {
    // Redirect back to artists list
    router.replace('/artists');
  }, [router]);
  return (
    <main style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#EFE7D9' }}>Artist not available. Redirecting…</p>
    </main>
  );
}

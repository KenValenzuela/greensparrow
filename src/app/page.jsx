'use client'

import { useEffect } from 'react'
import { getCLS, getFID, getLCP } from 'web-vitals'
import dynamic from 'next/dynamic'
import AboutSection from '@/components/AboutSection'

const TeamSection = dynamic(() => import('@/components/TeamSection'), { ssr: false })
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false })

// Send each metric via navigator.sendBeacon to your analytics endpoint
function sendMetric({ name, value, id }) {
  const body = JSON.stringify({
    name,                // e.g. 'LCP', 'CLS', 'FID'
    value,               // numeric metric value
    id,                  // unique for this metric instance
    url: window.location.pathname
  })
  navigator.sendBeacon('/api/analytics', body)
}

export default function HomePage() {
  useEffect(() => {
    getCLS(sendMetric)
    getFID(sendMetric)
    getLCP(sendMetric)
  }, [])

  return (
    <main>
      <AboutSection />
      <TeamSection />
      <Testimonials />
    </main>
  )
}

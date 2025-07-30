'use client'

import {useEffect} from 'react'
// FID has been replaced by INP in web-vitals; remove onFID and import onINP instead
import {onCLS, onINP, onLCP} from 'web-vitals'
import dynamic from 'next/dynamic'
import AboutSection from '@/components/AboutSection'

const TeamSection = dynamic(() => import('@/components/TeamSection'), { ssr: false })
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false })

// Send each metric via navigator.sendBeacon to your analytics endpoint
function sendMetric({ name, value, id }) {
  const body = JSON.stringify({
    name,                // e.g. 'LCP', 'CLS', 'INP'
    value,               // numeric metric value
    id,                  // unique for this metric instance
    url: window.location.pathname
  })
  navigator.sendBeacon('/api/analytics', body)
}

export default function HomePage() {
  useEffect(() => {
    onCLS(sendMetric)   // track Cumulative Layout Shift
    onLCP(sendMetric)   // track Largest Contentful Paint
    onINP(sendMetric)   // track Interaction to Next Paint (replaces FID)
  }, [])

  return (
    <main>


    <AboutSection />

      <TeamSection />

      <Testimonials />
    </main>
  )
}

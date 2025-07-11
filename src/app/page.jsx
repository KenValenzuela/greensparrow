'use client'

import dynamic from 'next/dynamic';
import AboutSection from "@/components/AboutSection";

const TeamSection = dynamic(() => import('@/components/TeamSection'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false });

export default function HomePage() {
  return (
    <main>
      <AboutSection />
      <TeamSection />
      <Testimonials />
    </main>
  );
}

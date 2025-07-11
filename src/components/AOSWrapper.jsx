// components/AOSWrapper.jsx
'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSWrapper({ children }) {
  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  return children;
}

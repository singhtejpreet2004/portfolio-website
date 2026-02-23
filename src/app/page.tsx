'use client';

import { useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Education from '@/components/sections/Education';
import Achievements from '@/components/sections/Achievements';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import PipelineSpine from '@/components/layout/PipelineSpine';
import { MouseContext } from '@/contexts/MouseContext';
import { useMouseParallax } from '@/hooks/useMouseParallax';

export default function Home() {
  const { springX, springY } = useMouseParallax();

  // Always start at the top on page load / reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <MouseContext.Provider value={{ springX, springY }}>
      <main className="relative">
        <Navigation />
        <PipelineSpine />

        <Hero />

        <div className="relative">
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Achievements />
          <Contact />
        </div>

        <Footer />
      </main>
    </MouseContext.Provider>
  );
}

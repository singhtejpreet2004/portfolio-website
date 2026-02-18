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

export default function Home() {
  return (
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
  );
}

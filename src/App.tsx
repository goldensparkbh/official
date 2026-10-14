import { lazy, Suspense, useEffect, useState } from 'react';
import './projects.css';
import './learning.css';
import LearningSection from './sections/LearningSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';

import Navigation from './components/Navigation';
import GrainOverlay from './components/GrainOverlay';
import HeroSection from './sections/HeroSection';
import AgentsSection from './sections/AgentsSection';
import WorkflowsSection from './sections/WorkflowsSection';
import VoiceSection from './sections/VoiceSection';
import MetricsSection from './sections/MetricsSection';
import ServicesSection from './sections/ServicesSection';
import TrainingSection from './sections/TrainingSection';
import IndustriesSection from './sections/IndustriesSection';
import PortfolioSection from './sections/PortfolioSection';
import ClientsSection from './sections/ClientsSection';
import ProcessSection from './sections/ProcessSection';
import ContactSection from './sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const LearningPage = lazy(() => import('./pages/LearningPage'));

function App() {
  const [route, setRoute] = useState(window.location.hash);
  const projectPage = route.startsWith('#/projects');
  const learningPage = route.startsWith('#/learn');
  useEffect(() => {
    const change = () => { setRoute(window.location.hash); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS || projectPage || learningPage) return;

    // Wait for all ScrollTriggers to be created
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);

      if (!maxScroll || pinned.length === 0) return;

      // Build pinned ranges with centers
      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center:
          (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      // Create global snap
      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (with small buffer)
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02
            );

            // If not in pinned section, allow free scroll
            if (!inPinned) return value;

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [projectPage, learningPage]);

  return (
    <div className="relative bg-luxury-black min-h-screen">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative">
        {projectPage || learningPage ? <Suspense fallback={<div className="pt-40 px-10 text-gold" role="status">Loading…</div>}>{learningPage ? <LearningPage route={route} /> : <ProjectsPage route={route} />}</Suspense> : <>
        {/* Pinned Sections (z-index stacked) */}
        <HeroSection />
        <AgentsSection />
        <WorkflowsSection />
        <VoiceSection />
        <MetricsSection />

        {/* Flowing Sections */}
        <ServicesSection />
        <TrainingSection />
        <LearningSection />
        <IndustriesSection />
        <PortfolioSection />
        <ClientsSection />
        <ProcessSection />
        <ContactSection />
        </>}
      </main>
    </div>
  );
}

export default App;

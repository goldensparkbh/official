import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

// Client logo placeholder component
const ClientLogo = ({ name, index }: { name: string; index: number }) => {
  const logoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS) return;

    const logo = logoRef.current;
    if (!logo) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        logo,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: logo,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, logo);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={logoRef}
      className="group flex items-center justify-center p-6 lg:p-8 rounded-lg bg-luxury-charcoal/20 border border-border/10 hover:border-gold/20 hover:bg-luxury-charcoal/30 transition-all duration-300 will-change-transform"
    >
      {/* Logo Placeholder - Replace with actual client logos */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg bg-luxury-ivory/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300">
          <span className="font-heading text-2xl lg:text-3xl font-black text-luxury-ivory/30 group-hover:text-gold/50 transition-colors duration-300">
            {name.charAt(0)}
          </span>
        </div>
        <span className="text-xs text-luxury-ivory/40 font-medium tracking-wide">
          {name}
        </span>
      </div>
    </div>
  );
};

const ClientsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS) return;

    const heading = headingRef.current;
    if (!heading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Client names - Replace with actual client names
  const clients = [
    'Client One',
    'Client Two',
    'Client Three',
    'Client Four',
    'Client Five',
    'Client Six',
    'Client Seven',
    'Client Eight',
  ];

  return (
    <section
      ref={sectionRef}
      className="section-flowing bg-luxury-black z-[80] py-24 lg:py-32"
      id="clients"
    >
      <div className="px-6 lg:px-[8vw]">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center max-w-2xl mx-auto mb-16 will-change-transform"
        >
          <span className="micro-label text-gold/80 mb-4 block">
            TRUSTED BY
          </span>
          <h2 className="headline-lg text-luxury-ivory mb-6">
            OUR <span className="text-gold">CLIENTS</span>
          </h2>
          <p className="body-text text-luxury-ivory/70">
            Leading organizations trust Golden Spark to deliver transformative
            AI solutions.
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {clients.map((client, index) => (
            <ClientLogo key={client} name={client} index={index} />
          ))}
        </div>

        {/* Note for adding logos */}
        <div className="mt-12 text-center">
          <p className="text-xs text-luxury-ivory/30">
            * Replace placeholder logos with actual client logos in the code
          </p>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;

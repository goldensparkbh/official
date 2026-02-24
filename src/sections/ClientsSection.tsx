import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

interface ClientItem {
  name: string;
  logo?: string;
  alt?: string;
  smallLogo?: boolean;
  mediumLogo?: boolean;
  largeLogo?: boolean;
  xLargeLogo?: boolean;
}

const ClientLogo = ({ client, index }: { client: ClientItem; index: number }) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const { name, logo, alt, smallLogo, mediumLogo, largeLogo, xLargeLogo } = client;

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
      className="group flex items-center justify-center p-3 lg:p-4 rounded-lg border border-border/10 hover:border-gold/20 transition-all duration-300 will-change-transform"
    >
      <div className="flex items-center justify-center">
        <div className="w-24 h-24 lg:w-32 lg:h-32 flex items-center justify-center">
          {logo ? (
            <img
              src={logo}
              alt={alt ?? name}
              className={`max-w-full max-h-full object-contain p-0.5 opacity-85 group-hover:opacity-100 transition-opacity duration-300 ${
                smallLogo
                  ? 'scale-75 lg:scale-70'
                  : mediumLogo
                    ? 'scale-[0.82] lg:scale-[0.78]'
                    : largeLogo
                      ? 'scale-110 lg:scale-115'
                      : xLargeLogo
                        ? 'scale-[1.65] lg:scale-[1.75]'
                      : ''
              }`}
            />
          ) : null}
        </div>
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

  const clients: ClientItem[] = [
    {
      name: 'Client One',
      logo: '/images/clients/client-one-logo.svg',
      alt: 'Client One logo',
      mediumLogo: true,
    },
    {
      name: 'Client Two',
      logo: '/images/clients/client-two-logo.svg',
      alt: 'Client Two logo',
      smallLogo: true,
    },
    {
      name: 'Client Three',
      logo: '/images/clients/client-three-logo.svg',
      alt: 'University of Technology Bahrain logo',
      largeLogo: true,
    },
    {
      name: 'Client Four',
      logo: '/images/clients/client-four-logo.svg',
      alt: 'Youth City logo',
    },
    {
      name: 'Client Five',
      logo: '/images/clients/client-five-logo.svg',
      alt: 'Kingdom University logo',
    },
    {
      name: 'Client Six',
      logo: '/images/clients/client-six-logo.svg',
      alt: 'CC WhiteButtons logo',
      xLargeLogo: true,
    },
    { name: 'Client Seven' },
    { name: 'Client Eight' },
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
          <h2 className="headline-lg text-luxury-ivory mb-6">
            OUR <span className="text-gold">CLIENTS</span>
          </h2>
          <p className="body-text text-luxury-ivory/70">
            Leading organizations trust Golden Spark to deliver transformative
            AI solutions.
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 lg:gap-2 max-w-5xl mx-auto">
          {clients.map((client, index) => (
            <ClientLogo key={client.name} client={client} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ClientsSection;

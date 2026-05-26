import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';
import {
  Globe,
  Bot,
  Lightbulb,
  Wrench,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon, title, description, index }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS) return;

    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, card);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group p-8 rounded-xl bg-luxury-charcoal/30 border border-border/20 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 will-change-transform"
    >
      <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:bg-gold/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-bold text-luxury-ivory mb-4">
        {title}
      </h3>
      <p className="text-sm text-luxury-ivory/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const ServicesSection = () => {
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

  const services = [
    {
      icon: <Globe size={28} />,
      title: 'Digital Platforms & Software',
      description:
        'Websites, web applications, dashboards, booking systems, e-commerce, and custom business software—built for usability, performance, and scale.',
    },
    {
      icon: <Bot size={28} />,
      title: 'AI & Automation',
      description:
        'Intelligent tools, chatbots, workflow automation, and document processing to streamline operations and reduce manual effort.',
    },
    {
      icon: <Lightbulb size={28} />,
      title: 'Consulting & Advisory',
      description:
        'Guidance on digital transformation, product planning, market positioning, and technology implementation for startups and SMEs.',
    },
    {
      icon: <Wrench size={28} />,
      title: 'Support & Maintenance',
      description:
        'Ongoing system care—updates, troubleshooting, hosting coordination, and operational assistance for your digital products.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-flowing bg-luxury-black z-[60] py-24 lg:py-32"
      id="services"
    >
      <div className="px-6 lg:px-[8vw]">
        {/* Heading */}
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 will-change-transform">
          <h2 className="headline-lg text-luxury-ivory mb-6">
            END-TO-END <span className="text-gold">SOLUTIONS</span>
          </h2>
          <p className="body-text text-luxury-ivory/70">
            From custom platforms and software to AI automation, consulting,
            and ongoing support—we deliver the services your project needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

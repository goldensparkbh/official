import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';
import {
  Building2,
  Radio,
  HeartPulse,
  Landmark,
  GraduationCap,
  Cpu,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface IndustryCardProps {
  icon: React.ReactNode;
  title: string;
  index: number;
}

const IndustryCard = ({ icon, title, index }: IndustryCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS) return;

    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
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
      className="group flex flex-col items-center justify-center p-8 rounded-xl bg-luxury-charcoal/20 border border-border/10 hover:border-gold/30 hover:bg-luxury-charcoal/40 transition-all duration-300 will-change-transform"
    >
      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-semibold text-luxury-ivory text-center">
        {title}
      </h3>
    </div>
  );
};

const IndustriesSection = () => {
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

  const industries = [
    { icon: <Building2 size={28} />, title: 'Government' },
    { icon: <Radio size={28} />, title: 'Telecom' },
    { icon: <HeartPulse size={28} />, title: 'Healthcare' },
    { icon: <Landmark size={28} />, title: 'Finance' },
    { icon: <GraduationCap size={28} />, title: 'Education' },
    { icon: <Cpu size={28} />, title: 'Smart Cities' },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-flowing bg-luxury-black z-[70] py-24 lg:py-32"
      id="industries"
    >
      <div className="px-6 lg:px-[8vw]">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center max-w-2xl mx-auto mb-16 will-change-transform"
        >
          <span className="micro-label text-gold/80 mb-4 block">
            WHO WE SERVE
          </span>
          <h2 className="headline-lg text-luxury-ivory mb-6">
            INDUSTRIES <span className="text-gold">WE TRANSFORM</span>
          </h2>
          <p className="body-text text-luxury-ivory/70">
            Delivering AI solutions across critical sectors that power economies
            and communities worldwide.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {industries.map((industry, index) => (
            <IndustryCard
              key={industry.title}
              icon={industry.icon}
              title={industry.title}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;

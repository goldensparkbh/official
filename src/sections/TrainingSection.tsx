import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';
import {
  Monitor,
  Bot,
  Code2,
  Briefcase,
  Users,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TrainingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const TrainingCard = ({ icon, title, description, index }: TrainingCardProps) => {
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
          delay: index * 0.08,
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

const TrainingSection = () => {
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

  const programs = [
    {
      icon: <Monitor size={28} />,
      title: 'Digital Skills',
      description:
        'Website management, productivity tools, online operations, and the everyday technical skills teams need to work confidently.',
    },
    {
      icon: <Bot size={28} />,
      title: 'AI & Automation',
      description:
        'Hands-on sessions on AI tools, workflow design, prompt engineering, chatbot setup, and automating repetitive business tasks.',
    },
    {
      icon: <Code2 size={28} />,
      title: 'Web Development',
      description:
        'Introductory and intermediate courses in application development, frontend and backend basics, and project-based learning.',
    },
    {
      icon: <Briefcase size={28} />,
      title: 'Entrepreneurship',
      description:
        'Idea validation, business models, digital marketing, customer acquisition, pricing, and operational planning for founders.',
    },
    {
      icon: <Users size={28} />,
      title: 'Corporate Workshops',
      description:
        'Tailored upskilling for organizations—department-specific automation, digital transformation awareness, and team enablement.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-flowing bg-luxury-black z-[68] py-24 lg:py-32"
      id="training"
    >
      <div className="px-6 lg:px-[8vw]">
        <div
          ref={headingRef}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 will-change-transform"
        >
          <h2 className="headline-lg text-luxury-ivory mb-6">
            PROFESSIONAL <span className="text-gold">TRAINING</span>
          </h2>
          <p className="body-text text-luxury-ivory/70">
            Practical programs that equip individuals, entrepreneurs, and teams
            with the skills to adopt new technology and grow with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {programs.map((program, index) => (
            <TrainingCard
              key={program.title}
              icon={program.icon}
              title={program.title}
              description={program.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;

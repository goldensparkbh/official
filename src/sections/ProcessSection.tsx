import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Settings, Rocket } from 'lucide-react';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  isReversed: boolean;
}

const ProcessStep = ({ number, title, description, image, icon, isReversed }: ProcessStepProps) => {
  const stepRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS) return;

    const step = stepRef.current;
    const img = imageRef.current;
    const content = contentRef.current;
    if (!step || !img || !content) return;

    const ctx = gsap.context(() => {
      // Content reveal
      gsap.fromTo(
        content,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image parallax
      gsap.fromTo(
        img,
        { y: -12 },
        {
          y: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: step,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      );
    }, step);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={stepRef}
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } gap-8 lg:gap-16 items-center`}
    >
      {/* Image */}
      <div className="w-full lg:w-1/2 overflow-hidden rounded-lg">
        <div ref={imageRef} className="will-change-transform">
          <img
            src={image}
            alt={title}
            className="w-full h-64 lg:h-80 object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="w-full lg:w-1/2 will-change-transform">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            {icon}
          </div>
          <span className="micro-label text-gold/80">{number}</span>
        </div>
        <h3 className="font-heading text-2xl lg:text-3xl font-bold text-luxury-ivory mb-4">
          {title}
        </h3>
        <p className="body-text text-luxury-ivory/70">{description}</p>
      </div>
    </div>
  );
};

const ProcessSection = () => {
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

  const steps = [
    {
      number: 'STEP 01',
      title: 'Discovery & Map',
      description:
        'We audit your workflows, define agent roles, and prioritize the highest-impact automations. This phase sets the foundation for everything that follows.',
      image: '/images/process-discovery.jpg',
      icon: <Search size={24} />,
    },
    {
      number: 'STEP 02',
      title: 'Build & Connect',
      description:
        'We configure agents, integrations, and guardrails—with weekly demos and clear milestones. You see progress at every step.',
      image: '/images/process-build.jpg',
      icon: <Settings size={24} />,
    },
    {
      number: 'STEP 03',
      title: 'Launch & Optimize',
      description:
        'We go live with monitoring, feedback loops, and continuous refinement. Your system improves over time, automatically.',
      image: '/images/process-launch.png',
      icon: <Rocket size={24} />,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-flowing bg-luxury-black z-[60] py-24 lg:py-32"
      id="process"
    >
      <div className="px-6 lg:px-[8vw]">
        {/* Heading */}
        <div ref={headingRef} className="max-w-2xl mb-16 lg:mb-24 will-change-transform">
          <h2 className="headline-lg text-luxury-ivory mb-4">
            HOW WE BUILD <span className="text-gold">YOUR AI SYSTEM</span>
          </h2>
          <p className="body-text text-luxury-ivory/70">
            A simple, senior-led process—designed to ship fast and iterate calmly.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-20 lg:space-y-32">
          {steps.map((step, index) => (
            <div key={step.number}>
              <ProcessStep
                number={step.number}
                title={step.title}
                description={step.description}
                image={step.image}
                icon={step.icon}
                isReversed={index % 2 === 1}
              />
              {index < steps.length - 1 && (
                <div className="hidden lg:block w-full h-px bg-border/20 mt-20 lg:mt-32" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

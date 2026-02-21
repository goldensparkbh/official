import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

interface MetricItemProps {
  value: string;
  label: string;
  delay: number;
}

const MetricItem = ({ value, label, delay }: MetricItemProps) => {
  const [displayValue, setDisplayValue] = useState('');
  const itemRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS) return;

    const item = itemRef.current;
    if (!item) return;

    const trigger = ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        // Animate the number
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
        const prefix = value.match(/^[^0-9]*/)?.[0] || '';
        const suffix = value.match(/[^0-9.]*$/)?.[0] || '';

        if (!isNaN(numericValue)) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: numericValue,
            duration: 2,
            delay: delay,
            ease: 'power2.out',
            onUpdate: () => {
              if (value.includes('×')) {
                setDisplayValue(`${prefix}${obj.val.toFixed(1)}${suffix}`);
              } else if (value.includes('%')) {
                setDisplayValue(`${prefix}${Math.round(obj.val)}${suffix}`);
              } else {
                setDisplayValue(`${prefix}${Math.round(obj.val)}${suffix}`);
              }
            },
          });
        } else {
          setDisplayValue(value);
        }
      },
    });

    return () => trigger.kill();
  }, [value, delay]);

  return (
    <div ref={itemRef} className="text-center lg:text-left">
      <div className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-gold mb-2">
        {displayValue || value}
      </div>
      <div className="text-sm text-luxury-ivory/60 font-medium">{label}</div>
    </div>
  );
};

const MetricsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRefs = useRef<HTMLDivElement[]>([]);
  const metricsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS) return;

    const section = sectionRef.current;
    const photo = photoRef.current;
    const hairline = hairlineRef.current;
    const headlines = headlineRefs.current;
    const metrics = metricsRef.current;
    const badge = badgeRef.current;
    const cta = ctaRef.current;

    if (!section || !photo || !hairline || !metrics || !badge || !cta) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          photo,
          { x: '-60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          hairline,
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: 'center', ease: 'none' },
          0.05
        )
        .fromTo(
          badge,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.08
        )
        .fromTo(
          headlines,
          { x: '40vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.08
        )
        .fromTo(
          metrics,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.12
        )
        .fromTo(
          cta,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.18
        );

      // SETTLE (30% - 70%): Hold positions

      // EXIT (70% - 100%)
      scrollTl
        .to(
          photo,
          { x: '-10vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to(
          hairline,
          { scaleY: 0, transformOrigin: 'top', ease: 'power2.in' },
          0.7
        )
        .to(
          headlines,
          { y: '-8vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to(
          metrics,
          { y: '6vh', opacity: 0, ease: 'power2.in' },
          0.72
        )
        .to(
          cta,
          { y: '4vh', opacity: 0, ease: 'power2.in' },
          0.74
        )
        .to(
          badge,
          { y: '-4vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const metrics = [
    { value: '24/7', label: 'AI availability across channels' },
    { value: '-40%', label: 'Avg. reduction in response time' },
    { value: '+3.2×', label: 'Typical uplift in lead conversion' },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-luxury-black z-50"
    >
      {/* Left Photo Panel */}
      <div
        ref={photoRef}
        className="absolute left-0 top-0 w-full lg:w-[52vw] h-full will-change-transform mobile-image-overlay"
      >
        <img
          src="/images/metrics-portrait.jpg"
          alt="Results and metrics"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-luxury-black/80 lg:to-luxury-black/50" />
      </div>

      {/* Vertical Hairline */}
      <div
        ref={hairlineRef}
        className="hidden lg:block absolute left-[52vw] top-[14vh] w-px h-[72vh] hairline will-change-transform"
        style={{ transformOrigin: 'center' }}
      />

      {/* Right Metrics Panel */}
      <div className="absolute inset-0 z-20 lg:left-[58vw] lg:top-[18vh] lg:w-[34vw] flex flex-col justify-center px-6 pt-24 pb-12 lg:px-0 lg:pt-0 lg:pb-0">
        {/* Micro Label */}
        <div
          ref={badgeRef}
          className="hidden"
        >
        </div>

        {/* Headline */}
        <div className="mb-10">
          <div
            ref={(el) => { if (el) headlineRefs.current[0] = el; }}
            className="headline-lg text-luxury-ivory will-change-transform"
          >
            RESULTS
          </div>
          <div
            ref={(el) => { if (el) headlineRefs.current[1] = el; }}
            className="headline-lg text-gold will-change-transform"
          >
            THAT SPEAK
          </div>
        </div>

        {/* Metrics */}
        <div
          ref={metricsRef}
          className="grid grid-cols-1 gap-8 mb-10 will-change-transform"
        >
          {metrics.map((metric, index) => (
            <MetricItem
              key={metric.label}
              value={metric.value}
              label={metric.label}
              delay={index * 0.15}
            />
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="will-change-transform">
          <button
            onClick={() => scrollToSection('#contact')}
            className="btn-secondary w-full sm:w-auto"
          >
            Request a Proposal
          </button>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;


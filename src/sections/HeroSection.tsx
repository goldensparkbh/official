import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRefs = useRef<HTMLDivElement[]>([]);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    const hairline = hairlineRef.current;
    const headlines = headlineRefs.current;
    const subhead = subheadRef.current;
    const cta = ctaRef.current;
    const badge = badgeRef.current;
    const dot = dotRef.current;

    if (!section || !photo || !hairline || !subhead || !cta || !badge || !dot) return;

    const ctx = gsap.context(() => {
      // Auto-play entrance animation on page load
      const loadTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      loadTl
        .fromTo(
          photo,
          { x: '-60vw', opacity: 0 },
          { x: 0, opacity: 1, duration: 1 }
        )
        .fromTo(
          hairline,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.8, transformOrigin: 'top' },
          0.2
        )
        .fromTo(
          badge,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.3
        )
        .fromTo(
          headlines,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.7 },
          0.35
        )
        .fromTo(
          subhead,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.5
        )
        .fromTo(
          cta,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.58
        )
        .fromTo(
          dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4 },
          0.7
        );

      if (ENABLE_SCROLL_ANIMATIONS) {
        // Scroll-driven EXIT animation (70% - 100%)
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: 0.6,
            onLeaveBack: () => {
              // Reset all elements to visible when scrolling back to top
              gsap.set([photo, hairline, badge, ...headlines, subhead, cta, dot], {
                opacity: 1,
                x: 0,
                y: 0,
                scaleY: 1,
                scale: 1,
              });
            },
          },
        });

        // ENTRANCE (0% - 30%): Hold (already visible from load animation)
        // SETTLE (30% - 70%): Hold
        // EXIT (70% - 100%): Animate out

        scrollTl
          .fromTo(
            headlines,
            { x: 0, opacity: 1 },
            { x: '18vw', opacity: 0, ease: 'power2.in' },
            0.7
          )
          .fromTo(
            subhead,
            { x: 0, opacity: 1 },
            { x: '14vw', opacity: 0, ease: 'power2.in' },
            0.72
          )
          .fromTo(
            cta,
            { x: 0, opacity: 1 },
            { x: '12vw', opacity: 0, ease: 'power2.in' },
            0.74
          )
          .fromTo(
            badge,
            { x: 0, opacity: 1 },
            { x: '10vw', opacity: 0, ease: 'power2.in' },
            0.7
          )
          .fromTo(
            photo,
            { x: 0, opacity: 1 },
            { x: '-18vw', opacity: 0, ease: 'power2.in' },
            0.7
          )
          .fromTo(
            hairline,
            { scaleY: 1, opacity: 1 },
            { scaleY: 0, transformOrigin: 'bottom', opacity: 0, ease: 'power2.in' },
            0.75
          )
          .fromTo(
            dot,
            { scale: 1, opacity: 1 },
            { scale: 0, opacity: 0, ease: 'power2.in' },
            0.8
          );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-luxury-black z-10"
      id="hero"
    >
      {/* Left Photo Panel */}
      <div
        ref={photoRef}
        className="absolute left-0 top-0 w-full lg:w-[52vw] h-full will-change-transform"
      >
        <img
          src="/images/hero-executive.png"
          alt="Executive portrait"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for text readability on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-luxury-black/90 lg:to-luxury-black/60" />
      </div>

      {/* Vertical Hairline */}
      <div
        ref={hairlineRef}
        className="hidden lg:block absolute left-[52vw] top-[10vh] w-px h-[80vh] hairline will-change-transform"
        style={{ transformOrigin: 'top' }}
      />

      {/* Right Text Area */}
      <div className="absolute inset-0 lg:left-[58vw] lg:top-[18vh] lg:w-[36vw] flex flex-col justify-center px-6 lg:px-0">

        {/* Headline */}
        <div className="mb-8">
          <div
            ref={(el) => { if (el) headlineRefs.current[0] = el; }}
            className="headline-xl text-luxury-ivory will-change-transform"
          >
            AI THAT
          </div>
          <div
            ref={(el) => { if (el) headlineRefs.current[1] = el; }}
            className="headline-xl text-luxury-ivory will-change-transform"
          >
            RUNS YOUR
          </div>
          <div
            ref={(el) => { if (el) headlineRefs.current[2] = el; }}
            className="headline-xl text-gold will-change-transform"
          >
            BUSINESS
          </div>
        </div>

        {/* Subheadline */}
        <p
          ref={subheadRef}
          className="body-text text-luxury-ivory/70 max-w-md mb-10 will-change-transform"
        >
          Golden Spark builds AI agents and automations that handle operations,
          sales, and support—so you scale without hiring overhead.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 will-change-transform">
          <button
            onClick={() => scrollToSection('#contact')}
            className="btn-primary"
          >
            Book a Call
          </button>
          <button
            onClick={() => scrollToSection('#services')}
            className="btn-secondary"
          >
            See Services
          </button>
        </div>
      </div>

      {/* Decorative Amber Dot */}
      <div
        ref={dotRef}
        className="hidden lg:block absolute left-[86vw] top-[78vh] w-2 h-2 bg-gold rounded-full will-change-transform"
      />

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,11,15,0.4)_100%)]" />
    </section>
  );
};

export default HeroSection;

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

const VoiceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRefs = useRef<HTMLDivElement[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ENABLE_SCROLL_ANIMATIONS) return;

    const section = sectionRef.current;
    const photo = photoRef.current;
    const hairline = hairlineRef.current;
    const headlines = headlineRefs.current;
    const body = bodyRef.current;
    const badge = badgeRef.current;
    const dot = dotRef.current;
    const wave = waveRef.current;

    if (!section || !photo || !hairline || !body || !badge || !dot || !wave) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          photo,
          { x: '60vw', opacity: 0 },
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
          { x: '-40vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.08
        )
        .fromTo(
          body,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.12
        )
        .fromTo(
          dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'none' },
          0.2
        )
        .fromTo(
          wave,
          { opacity: 0 },
          { opacity: 1, ease: 'none' },
          0.25
        );

      // SETTLE (30% - 70%): Hold positions

      // Ambient voice wave animation during settle
      const waveBars = wave.querySelectorAll('.wave-bar');
      gsap.to(waveBars, {
        scaleY: 0.6,
        duration: 1.2,
        stagger: {
          each: 0.1,
          yoyo: true,
          repeat: -1,
        },
        ease: 'sine.inOut',
      });

      // EXIT (70% - 100%)
      scrollTl
        .to(
          photo,
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to(
          hairline,
          { scaleY: 0, transformOrigin: 'bottom', ease: 'power2.in' },
          0.7
        )
        .to(
          headlines,
          { y: '-10vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to(
          body,
          { y: '-6vh', opacity: 0, ease: 'power2.in' },
          0.72
        )
        .to(
          badge,
          { y: '-4vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to(
          dot,
          { scale: 0, opacity: 0, ease: 'power2.in' },
          0.75
        )
        .to(
          wave,
          { opacity: 0, ease: 'power2.in' },
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

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-luxury-black z-40"
    >
      {/* Left Text Area */}
      <div className="absolute inset-0 z-20 lg:left-[8vw] lg:top-[22vh] lg:w-[38vw] flex flex-col justify-center px-6 pt-24 pb-12 lg:px-0 lg:pt-0 lg:pb-0">
        {/* Micro Badge */}
        <div
          ref={badgeRef}
          className="hidden"
        >
        </div>

        {/* Headline */}
        <div className="mb-8">
          <div
            ref={(el) => { if (el) headlineRefs.current[0] = el; }}
            className="headline-lg text-luxury-ivory will-change-transform"
          >
            NEVER MISS
          </div>
          <div
            ref={(el) => { if (el) headlineRefs.current[1] = el; }}
            className="headline-lg text-gold will-change-transform"
          >
            A BOOKING
          </div>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="will-change-transform">
          <p className="body-text text-luxury-ivory/70 max-w-md mb-8">
            Our voice agents answer calls, handle reschedules, and confirm
            details—politely, accurately, and in your brand tone. You stay
            focused on the work that matters.
          </p>
          <button
            onClick={() => scrollToSection('#contact')}
            className="btn-secondary w-full sm:w-auto"
          >
            Hear a Demo
          </button>
        </div>

        {/* Voice Wave Animation */}
        <div
          ref={waveRef}
          className="hidden lg:flex items-end gap-1 mt-12 h-8 opacity-25"
        >
          <div className="wave-bar w-1 bg-gold rounded-full origin-bottom" style={{ height: '60%' }} />
          <div className="wave-bar w-1 bg-gold rounded-full origin-bottom" style={{ height: '100%' }} />
          <div className="wave-bar w-1 bg-gold rounded-full origin-bottom" style={{ height: '75%' }} />
          <div className="wave-bar w-1 bg-gold rounded-full origin-bottom" style={{ height: '90%' }} />
          <div className="wave-bar w-1 bg-gold rounded-full origin-bottom" style={{ height: '50%' }} />
        </div>
      </div>

      {/* Vertical Hairline */}
      <div
        ref={hairlineRef}
        className="hidden lg:block absolute left-[52vw] top-[12vh] w-px h-[76vh] hairline will-change-transform"
        style={{ transformOrigin: 'center' }}
      />

      {/* Right Photo Panel */}
      <div
        ref={photoRef}
        className="absolute right-0 top-0 w-full lg:w-[48vw] h-full will-change-transform mobile-image-overlay"
      >
        <img
          src="/images/voice-support.jpg"
          alt="Voice AI support"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-luxury-black/80 lg:to-luxury-black/40" />
      </div>

      {/* Decorative Amber Dot */}
      <div
        ref={dotRef}
        className="hidden lg:block absolute left-[42vw] top-[72vh] w-2 h-2 bg-gold rounded-full will-change-transform"
      />
    </section>
  );
};

export default VoiceSection;


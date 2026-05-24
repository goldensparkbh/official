import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Lock } from 'lucide-react';
import { ENABLE_SCROLL_ANIMATIONS } from '@/config/motion';
import {
  portfolioProjects,
  getScreenshotUrl,
  getScreenshotFallbackUrl,
  type PortfolioProject,
} from '@/config/portfolio';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState(getScreenshotUrl(project.url));
  const triedFallback = useRef(false);
  const isVisitable = !project.noVisit;

  // 3D tilt + parallax-on-mouse-move
  useEffect(() => {
    const card = cardRef.current;
    const inner = innerRef.current;
    const img = imgRef.current;
    const glow = glowRef.current;
    if (!card || !inner || !img || !glow) return;

    const maxTilt = 12; // degrees
    const imgShift = 14; // px parallax of the screenshot inside the card

    let raf = 0;
    let targetRX = 0;
    let targetRY = 0;
    let curRX = 0;
    let curRY = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      curRX = lerp(curRX, targetRX, 0.12);
      curRY = lerp(curRY, targetRY, 0.12);

      inner.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg)`;
      img.style.transform = `scale(1.06) translate3d(${
        (-curRY / maxTilt) * imgShift
      }px, ${(curRX / maxTilt) * imgShift}px, 0)`;

      if (
        Math.abs(curRX - targetRX) > 0.01 ||
        Math.abs(curRY - targetRY) > 0.01
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const handleMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1

      // map to -maxTilt..+maxTilt
      targetRY = (px - 0.5) * 2 * maxTilt;
      targetRX = -(py - 0.5) * 2 * maxTilt;

      // light glow follows cursor
      glow.style.background = `radial-gradient(420px circle at ${px * 100}% ${
        py * 100
      }%, rgba(243,179,62,0.22), transparent 55%)`;

      start();
    };

    const handleEnter = () => {
      glow.style.opacity = '1';
    };

    const handleLeave = () => {
      targetRX = 0;
      targetRY = 0;
      glow.style.opacity = '0';
      start();
    };

    card.addEventListener('pointermove', handleMove);
    card.addEventListener('pointerenter', handleEnter);
    card.addEventListener('pointerleave', handleLeave);

    return () => {
      card.removeEventListener('pointermove', handleMove);
      card.removeEventListener('pointerenter', handleEnter);
      card.removeEventListener('pointerleave', handleLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Reveal animation + scroll-based parallax drift
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      // Always-on intro reveal (works even without scroll triggers)
      gsap.fromTo(
        card,
        { y: 32, opacity: 0, rotateX: -8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          delay: 0.05 + (index % 8) * 0.06,
          ease: 'power3.out',
        }
      );

      if (ENABLE_SCROLL_ANIMATIONS) {
        // Subtle vertical parallax on scroll (alternating direction)
        const dir = index % 2 === 0 ? -1 : 1;
        gsap.to(card, {
          y: dir * 30,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, card);

    return () => ctx.revert();
  }, [index]);

  const handleImgError = () => {
    if (!triedFallback.current) {
      triedFallback.current = true;
      setImgSrc(getScreenshotFallbackUrl(project.url));
    }
  };

  const cardInner = (
    <div
      ref={cardRef}
      className="group relative block w-full text-left will-change-transform [perspective:1200px]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={innerRef}
        className={`relative rounded-2xl overflow-hidden border border-white/5 bg-luxury-charcoal/60 shadow-luxury transition-shadow duration-300 ${
          isVisitable
            ? 'group-hover:shadow-[0_30px_80px_-20px_rgba(243,179,62,0.35)]'
            : 'group-hover:shadow-[0_30px_80px_-20px_rgba(255,255,255,0.18)]'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 120ms ease-out',
        }}
      >
        {/* Screenshot */}
        <div className="relative aspect-[16/10] overflow-hidden bg-luxury-black">
          {/* skeleton shimmer */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-luxury-charcoal via-luxury-black to-luxury-charcoal animate-pulse-glow"
            aria-hidden="true"
          />
          <img
            ref={imgRef}
            src={imgSrc}
            onError={handleImgError}
            alt={`${project.title} website screenshot`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="relative w-full h-full object-cover object-top will-change-transform"
            style={{
              transform: 'scale(1.06)',
              transition: 'transform 240ms ease-out, filter 300ms ease-out',
            }}
          />

          {/* dark gradient for legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-luxury-black/95 via-luxury-black/35 to-transparent" />

          {/* gold glow that follows cursor */}
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          />

          {/* Number badge */}
          <div className="absolute top-4 left-4 font-mono text-[11px] tracking-[0.2em] text-gold/90 bg-luxury-black/70 backdrop-blur-md border border-gold/20 px-2.5 py-1 rounded-full">
            {project.id}
          </div>

          {/* Top-right affordance: visit arrow OR restricted badge */}
          {isVisitable ? (
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-luxury-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-luxury-ivory/80 transition-all duration-300 group-hover:bg-gold group-hover:text-luxury-black group-hover:scale-110">
              <ArrowUpRight size={16} strokeWidth={2.4} />
            </div>
          ) : (
            <div className="absolute top-4 right-4 h-9 px-3 rounded-full bg-luxury-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[10px] font-mono tracking-[0.18em] uppercase text-luxury-ivory/70">
              <Lock size={11} strokeWidth={2.4} />
              Restricted
            </div>
          )}

          {/* Title floats above the image */}
          <div
            className="absolute left-5 right-5 bottom-4"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div className="micro-label text-gold/80 mb-1.5">
              {project.category}
            </div>
            <h3 className="font-heading text-xl lg:text-2xl font-extrabold text-luxury-ivory leading-tight">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-5 border-t border-white/5 bg-luxury-charcoal/40">
          <p className="text-[13px] leading-relaxed text-luxury-ivory/60 line-clamp-2">
            {project.description}
          </p>
          <div className="mt-3 flex items-center justify-end">
            {isVisitable ? (
              <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-gold/80 group-hover:text-gold transition-colors">
                Visit
              </span>
            ) : (
              <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-luxury-ivory/40">
                Internal
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isVisitable) {
    return cardInner;
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.title} — opens in a new tab`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-2xl"
    >
      {cardInner}
    </a>
  );
};

const PortfolioSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Global mouse-driven parallax across the grid (subtle drift)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      curX = lerp(curX, targetX, 0.06);
      curY = lerp(curY, targetY, 0.06);
      grid.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      if (
        Math.abs(curX - targetX) > 0.05 ||
        Math.abs(curY - targetY) > 0.05
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const handleMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      // only drift when cursor is near the grid
      if (
        e.clientY < rect.top - 200 ||
        e.clientY > rect.bottom + 200
      )
        return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 8; // max 8px
      targetY = ((e.clientY - cy) / cy) * 8;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useLayoutEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.05,
        }
      );

      if (ENABLE_SCROLL_ANIMATIONS) {
        gsap.from(heading, {
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-flowing relative bg-luxury-black z-[65] py-24 lg:py-32"
      id="portfolio"
    >
      {/* Decorative ambient gold orbs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-gold/10 blur-[140px] opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 w-[36rem] h-[36rem] rounded-full bg-gold/5 blur-[120px] opacity-60"
        aria-hidden="true"
      />

      <div className="relative px-6 lg:px-[8vw]">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 will-change-transform"
        >
          <div className="micro-label text-gold/80 mb-4">Selected Work</div>
          <h2 className="headline-lg text-luxury-ivory mb-6">
            OUR <span className="text-gold">PORTFOLIO</span>
          </h2>
          <p className="body-text text-luxury-ivory/70">
            A curated selection of platforms, dashboards, and digital products
            we have designed and shipped. Click any card to visit the live site.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7 max-w-[1500px] mx-auto will-change-transform"
          style={{ perspective: '1400px' }}
        >
          {portfolioProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;

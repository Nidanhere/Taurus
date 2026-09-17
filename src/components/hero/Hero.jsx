import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { HeroScene } from './HeroScene';
import { HeroContent } from './HeroContent';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function Hero() {
  const containerRef = useRef(null);
  const atmosphereRef = useRef(null);
  const headlineRef = useRef(null);
  const taglineRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { isMobile, isTablet } = useWindowDimensions();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const targets = [
      atmosphereRef.current,
      headlineRef.current,
      taglineRef.current,
    ];

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      gsap.set(atmosphereRef.current, { opacity: 0 });
      gsap.set([headlineRef.current, taglineRef.current], {
        opacity: 0,
        y: 24,
      });

      timeline
        .to(atmosphereRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        })
        .to(
          headlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
          },
          '-=0.4',
        )
        .to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
          },
          '-=0.5',
        );
    }, containerRef);

    const finalStateTimer = window.setTimeout(() => {
      gsap.set(targets, { opacity: 1, x: 0, y: 0, scale: 1 });
    }, 2400);

    return () => {
      window.clearTimeout(finalStateTimer);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative isolate flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#070706] text-[#f4efe4]"
    >
      {/* 3D Scene filling the entire hero viewport for 100% background blending */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <HeroScene
          isMobile={isMobile}
          isTablet={isTablet}
          reducedMotion={reducedMotion}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* Atmospheric lighting overlay seamlessly blending whole canvas */}
      <div ref={atmosphereRef} className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-luxury-vignette opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[45rem] w-[55rem] rounded-full bg-[#b08b52]/[0.035] blur-[180px]" />
        {/* Soft bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070706] to-transparent" />
      </div>

      {/* Headline Content placed on top of 3D canvas */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-28 sm:pt-36 md:pt-40 pointer-events-none">
        <HeroContent
          headlineRef={headlineRef}
          taglineRef={taglineRef}
        />
      </div>

      {/* Spacer for bottom breathing room */}
      <div className="relative z-10 h-24 sm:h-32 pointer-events-none" />
    </section>
  );
}

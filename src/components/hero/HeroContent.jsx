export function HeroContent({ headlineRef, taglineRef }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center pointer-events-auto px-4 sm:px-6 max-w-6xl mx-auto w-full">
      {/* Prominent main headline in Cinzel luxury font */}
      <h1
        ref={headlineRef}
        className="font-editorial text-[1.85rem] sm:text-[2.6rem] md:text-[3.5rem] lg:text-[4.2rem] xl:text-[4.8rem] font-bold leading-[1.12] tracking-[0.04em] text-[#f4efe4] uppercase max-w-5xl"
      >
        Best Forex Trading Institute <br className="hidden sm:inline" />
        in Kerala
      </h1>

      {/* Sub-line motto directly below */}
      <div
        ref={taglineRef}
        className="mt-4 sm:mt-6 flex items-center justify-center gap-4 font-editorial text-sm sm:text-base md:text-lg tracking-[0.25em] text-[#c9b79c] uppercase font-medium"
      >
        <span>Learn</span>
        <span className="text-[#b89b6a] text-xs">&bull;</span>
        <span>Trade</span>
        <span className="text-[#b89b6a] text-xs">&bull;</span>
        <span className="text-[#e5d3b3]">Excel</span>
      </div>

      {/* Know More Button */}
      <button
        onClick={() => window.location.href = '#inquire'}
        className="mt-8 sm:mt-10 cursor-pointer rounded-full border border-[#b99d6e]/35 bg-[#11100d]/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#eee4d2] transition-all duration-300 hover:border-[#d1b27c]/65 hover:bg-[#17130e] hover:shadow-lg hover:shadow-[#b99d6e]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b99d6e] sm:px-8 sm:py-3.5 sm:text-sm"
      >
        Know More
      </button>
    </div>
  );
}

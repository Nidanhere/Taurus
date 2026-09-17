export function Navbar({ navbarRef }) {
  return (
    <header
      ref={navbarRef}
      className="fixed left-0 right-0 top-0 z-50 w-full border-b border-white/[0.045] bg-[#070706]/68 px-5 py-5 backdrop-blur-xl transition-all sm:px-10 lg:px-14 xl:px-16"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#" className="flex items-center gap-3.5" aria-label="Taurus Institute home">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b99d6e]/45 bg-[#11100d] font-editorial text-xs font-semibold tracking-widest text-[#f0e8d9]">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-sm font-semibold uppercase tracking-[0.22em] text-[#f4efe4]">
              TAURUS
            </span>
            <span className="-mt-0.5 text-[9px] uppercase tracking-[0.28em] text-[#b99d6e]">
              Institute
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-9 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9a958c] md:flex">
          <a href="#institute" className="transition-colors duration-200 hover:text-[#f4efe4]">Institute</a>
          <a href="#curriculum" className="transition-colors duration-200 hover:text-[#f4efe4]">Curriculum</a>
          <a href="#mentorship" className="transition-colors duration-200 hover:text-[#f4efe4]">Mentorship</a>
        </nav>

        <div className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center sm:static sm:translate-y-0">
          <button
            onClick={() => window.location.href = '#inquire'}
            className="cursor-pointer rounded-full border border-[#b99d6e]/35 bg-[#11100d]/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#eee4d2] transition-all duration-300 hover:border-[#d1b27c]/65 hover:bg-[#17130e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b99d6e] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
          >
            Inquire
          </button>
        </div>
      </div>
    </header>
  );
}

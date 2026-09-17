import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/hero/Hero';
import { CryptoCards } from './components/CryptoCards';

export function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#07080a] text-[#edece6] flex flex-col selection:bg-[#c5a880]/20 selection:text-[#f7f5f0]">
      {/* Editorial Luxury Navigation */}
      <Navbar />

      {/* Main Cinematic Hero */}
      <main className="flex-1 w-full flex flex-col justify-center">
        <Hero />
      </main>

      {/* Crypto Cards Section */}
      <CryptoCards />
    </div>
  );
}

export default App;

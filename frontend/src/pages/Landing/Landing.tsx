import LandingHeader from './components/LandingHeader';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LandingFooter from './components/LandingFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-app font-sans selection:bg-brand/20 selection:text-brand flex flex-col transition-colors duration-300">
      <LandingHeader />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 md:px-16 pt-4 pb-24">
        <HeroSection />
        <FeaturesSection />
      </main>

      <LandingFooter />
    </div>
  );
}
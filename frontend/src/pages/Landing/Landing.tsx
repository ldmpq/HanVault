import LandingHeader from './components/LandingHeader';
import LandingHero from './components/LandingHero';
import FeaturesSection from './components/FeaturesSection';
import LandingFooter from './components/LandingFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-app font-sans selection:bg-brand/20 selection:text-brand flex flex-col transition-colors duration-300">
      <LandingHeader />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 md:px-16 pt-4 pb-24">
        <LandingHero />
        <FeaturesSection />
      </main>

      <LandingFooter />
    </div>
  );
}
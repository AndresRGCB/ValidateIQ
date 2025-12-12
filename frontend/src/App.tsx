import { useEffect, useCallback, useRef } from 'react';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { FeaturesSection } from './components/FeaturesSection';
import { SocialProof } from './components/SocialProof';
import { WaitlistForm } from './components/WaitlistForm';
import { Footer } from './components/Footer';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const isInitializedRef = useRef(false);
  const viewedSections = useRef<Set<string>>(new Set());

  const {
    init,
    trackSectionView,
    updateScrollDepth,
    trackFormFocus,
    trackFormFieldBlur,
    trackFormSubmit,
    trackCTAClick,
    trackFeatureHover,
    getVisitorId,
    getPageLoadTime,
  } = useAnalytics();

  // Initialize analytics
  useEffect(() => {
    const initialize = async () => {
      await init();
      isInitializedRef.current = true;
    };

    initialize();
  }, [init]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      updateScrollDepth(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollDepth]);

  // Handle section view (only track once per section)
  const handleSectionView = useCallback((section: string) => {
    if (!viewedSections.current.has(section)) {
      viewedSections.current.add(section);
      trackSectionView(section);
    }
  }, [trackSectionView]);

  // Scroll to waitlist form
  const scrollToWaitlist = useCallback(() => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Hero
        onCTAClick={scrollToWaitlist}
        trackCTA={trackCTAClick}
      />

      <ProblemSection onSectionView={handleSectionView} />

      <FeaturesSection
        onSectionView={handleSectionView}
        onFeatureHover={trackFeatureHover}
      />

      <SocialProof onSectionView={handleSectionView} />

      <WaitlistForm
        visitorId={isInitializedRef.current ? getVisitorId() : null}
        pageLoadTime={getPageLoadTime()}
        onSectionView={handleSectionView}
        onFormFocus={trackFormFocus}
        onFormFieldBlur={trackFormFieldBlur}
        onFormSubmit={trackFormSubmit}
        onSignupSuccess={() => {}}
      />

      <Footer />
    </div>
  );
}

export default App;

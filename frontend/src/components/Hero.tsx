import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface HeroProps {
  onCTAClick: () => void;
  trackCTA: (text: string, position: string) => void;
}

export function Hero({ onCTAClick, trackCTA }: HeroProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const handleCTAClick = () => {
    trackCTA('Join the Waitlist', 'hero');
    onCTAClick();
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32"
    >
      {/* Background glow */}
      <div className="hero-glow" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 mb-8 bg-accent-primary/10 border border-accent-primary/20 rounded-full transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
          </span>
          <span className="text-accent-primary text-sm font-medium">
            Early access now open
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="gradient-text">Stop Building Products</span>
          <br />
          <span className="text-white">Nobody Wants</span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          The all-in-one validation suite that helps founders discover real pain points,
          test demand, and make confident build-or-kill decisions —{' '}
          <span className="text-white font-medium">before writing a single line of code.</span>
        </p>

        {/* CTA Button */}
        <div
          className={`transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button size="lg" onClick={handleCTAClick} className="text-lg px-10 py-5">
            Join the Waitlist
            <ArrowRight className="w-5 h-5" />
          </Button>

          <p className="mt-4 text-sm text-zinc-500">
            Get <span className="text-accent-primary font-semibold">50% off</span> for your first 3 months after launch
          </p>
        </div>

        {/* Trust badges */}
        <div
          className={`flex flex-wrap items-center justify-center gap-6 mt-12 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            'No credit card required',
            'Free during beta',
            'Cancel anytime',
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

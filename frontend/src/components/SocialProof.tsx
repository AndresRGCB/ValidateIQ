import { Quote } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface SocialProofProps {
  onSectionView: (section: string) => void;
}

export function SocialProof({ onSectionView }: SocialProofProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  if (isVisible) {
    onSectionView('social_proof');
  }

  return (
    <section
      ref={ref}
      id="social-proof"
      className="py-24 md:py-32 relative"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Quote icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 mb-8">
            <Quote className="w-8 h-8 text-accent-primary" />
          </div>

          {/* Quote */}
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed mb-8">
            "Built by a founder who wasted months building the wrong thing."
          </blockquote>

          {/* Attribution */}
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            After GummySearch shut down, I realized founders need more than a research tool —
            they need a <span className="text-white font-medium">complete validation system</span>.
          </p>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {[
              { value: '42%', label: 'of startups fail due to no market need' },
              { value: '3mo', label: 'average time wasted on wrong ideas' },
              { value: '$50k+', label: 'burned before pivoting' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

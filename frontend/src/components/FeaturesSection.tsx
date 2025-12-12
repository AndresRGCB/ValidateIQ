import { Search, Rocket, BarChart3, ClipboardList, TrendingUp } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface FeaturesSectionProps {
  onSectionView: (section: string) => void;
  onFeatureHover: (featureName: string) => void;
}

const features = [
  {
    icon: Search,
    title: 'AI Research Agent',
    description:
      'Tell it your idea and target audience. It explores Reddit, Hacker News, and Twitter — finding pain points, competitor mentions, and opportunities. Get a report with real quotes and links, not AI hallucinations.',
    color: 'purple',
  },
  {
    icon: Rocket,
    title: 'One-Click Landing Pages',
    description:
      'Turn research insights into landing pages instantly. AI writes the copy based on the pain points it found. Publish in seconds, no design skills needed.',
    color: 'blue',
  },
  {
    icon: BarChart3,
    title: 'Built-in Analytics',
    description:
      'Track visits, scroll depth, time on page, and conversion — without setting up Google Analytics. See what\'s working in one dashboard.',
    color: 'green',
  },
  {
    icon: ClipboardList,
    title: 'Smart Waitlist',
    description:
      'Capture emails with conversion tracking. See which messages resonate. Run fake door tests to measure real demand before building.',
    color: 'orange',
  },
  {
    icon: TrendingUp,
    title: 'Validation Dashboard',
    description:
      'All your evidence in one place: research findings, landing page metrics, waitlist signups. Get a validation score and make decisions with confidence.',
    color: 'pink',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400' },
};

export function FeaturesSection({ onSectionView, onFeatureHover }: FeaturesSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  if (isVisible) {
    onSectionView('features');
  }

  return (
    <section
      ref={ref}
      id="features"
      className="py-24 md:py-32 relative bg-bg-secondary/50"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            One platform.{' '}
            <span className="gradient-text-accent">Complete validation.</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Everything you need to validate your startup idea in one place
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            return (
              <div
                key={index}
                className={`feature-card transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
                onMouseEnter={() => onFeatureHover(feature.title)}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6`}
                >
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Smartphone, Clock, Dice5 } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ProblemSectionProps {
  onSectionView: (section: string) => void;
}

const problems = [
  {
    icon: Smartphone,
    title: 'Scattered tools, scattered insights',
    description:
      "You're juggling Reddit searches, Carrd pages, Google Analytics, email tools, and spreadsheets. Nothing connects.",
  },
  {
    icon: Clock,
    title: 'Hours of manual research',
    description:
      "Scrolling through subreddits, copying quotes into docs, trying to spot patterns. It's exhausting.",
  },
  {
    icon: Dice5,
    title: 'Building on gut feeling',
    description:
      'Without real evidence, you\'re guessing. And 42% of startups fail because they built something nobody needed.',
  },
];

export function ProblemSection({ onSectionView }: ProblemSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  if (isVisible) {
    onSectionView('problem');
  }

  return (
    <section
      ref={ref}
      id="problem"
      className="py-24 md:py-32 relative"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text-accent">Validation is broken</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Most founders validate ideas with incomplete tools and guesswork
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className={`feature-card transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {problem.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

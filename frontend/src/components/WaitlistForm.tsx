import { useState, useRef, FormEvent } from 'react';
import { ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { submitSignup } from '../services/api';

interface WaitlistFormProps {
  signupCount: number;
  visitorId: number | null;
  pageLoadTime: number;
  onSectionView: (section: string) => void;
  onFormFocus: () => void;
  onFormFieldBlur: (fieldName: string, hasValue: boolean) => void;
  onFormSubmit: (success: boolean, feature?: string) => void;
  onSignupSuccess: () => void;
}

const featureOptions = [
  { value: '', label: 'Select a feature...' },
  { value: 'ai_research', label: 'AI Research Agent (Reddit, HN, Twitter analysis)' },
  { value: 'landing_pages', label: 'One-Click Landing Page Builder' },
  { value: 'analytics', label: 'Built-in Analytics Dashboard' },
  { value: 'waitlist', label: 'Smart Waitlist & Fake Door Testing' },
  { value: 'dashboard', label: 'Validation Evidence Dashboard' },
  { value: 'all', label: 'All of them equally' },
];

export function WaitlistForm({
  signupCount,
  visitorId,
  pageLoadTime,
  onSectionView,
  onFormFocus,
  onFormFieldBlur,
  onFormSubmit,
  onSignupSuccess,
}: WaitlistFormProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState('');
  const [feature, setFeature] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ position: number; spotsLeft: number } | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const spotsLeft = Math.max(100 - signupCount, 0);

  if (isVisible) {
    onSectionView('waitlist_form');
  }

  const handleFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onFormFocus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!feature) {
      setError('Please select a feature');
      return;
    }

    if (!visitorId) {
      setError('Something went wrong. Please refresh and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const timeToSignup = Math.floor((Date.now() - pageLoadTime) / 1000);

      const result = await submitSignup({
        visitor_id: visitorId,
        email,
        most_wanted_feature: feature,
        marketing_consent: consent,
        signup_source: 'main_form',
        time_to_signup_seconds: timeToSignup,
      });

      setSuccess({ position: result.position, spotsLeft: result.spots_left });
      onFormSubmit(true, feature);
      onSignupSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      onFormSubmit(false, feature);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <section ref={ref} id="waitlist" className="py-24 md:py-32 relative">
        <div className="max-w-xl mx-auto px-6">
          <div
            className={`bg-bg-secondary border border-green-500/20 rounded-2xl p-8 md:p-12 text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              You're in!
            </h3>
            <p className="text-zinc-400 mb-6">
              Position <span className="text-white font-semibold">#{success.position}</span> on the waitlist.
              <br />
              Check your inbox for a confirmation.
            </p>
            {success.spotsLeft > 0 && (
              <p className="text-sm text-zinc-500">
                Only {success.spotsLeft} early bird spots left
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="waitlist" className="py-24 md:py-32 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-xl mx-auto px-6">
        <div
          className={`bg-bg-secondary border border-white/10 rounded-2xl p-8 md:p-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Get Early Access
            </h2>
            <p className="text-accent-primary font-medium">
              + 50% Lifetime Discount
            </p>
            <p className="text-zinc-400 mt-2 text-sm">
              First 100 founders get 50% off forever. We're at {signupCount}/100.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary transition-all duration-500"
                style={{ width: `${Math.min(signupCount, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-zinc-500">
              <span>{signupCount} signed up</span>
              <span>{spotsLeft} spots left</span>
            </div>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@startup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFocus}
              onBlur={() => onFormFieldBlur('email', !!email)}
            />

            <Select
              options={featureOptions}
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              onFocus={handleFocus}
              onBlur={() => onFormFieldBlur('feature', !!feature)}
              label="Which feature would help you most?"
            />

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                onFocus={handleFocus}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-bg-tertiary text-accent-primary focus:ring-accent-primary/20"
              />
              <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                I agree to receive product updates and launch news.
                No spam, unsubscribe anytime.
              </span>
            </label>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Join the Waitlist
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          {/* Privacy note */}
          <div className="flex items-center justify-center gap-2 mt-6 text-zinc-500 text-sm">
            <Lock className="w-4 h-4" />
            <span>We respect your privacy</span>
          </div>
        </div>
      </div>
    </section>
  );
}

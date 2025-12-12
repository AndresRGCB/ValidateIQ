import { Twitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-tertiary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <span className="font-semibold text-white">ValidateIQ</span>
            </div>
            <p className="text-sm text-zinc-500">
              Building in public. Follow the journey.
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} ValidateIQ. Made for founders, by a founder.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useSelector } from 'react-redux';
import { ArrowUp, Heart } from 'lucide-react';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const QUICK_LINKS = [
  { label: 'Work', href: '#showcase' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Contact', href: '#contact' },
];

function Footer() {
  const { data } = useSelector((state) => state.profile);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[var(--color-surface-1)] border-t border-[var(--color-surface-border)]">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* Brand Column */}
          <div>
            <a
              href="#"
              onClick={scrollToTop}
              className="font-display text-xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              {data?.headline || 'Satyam Kr. Pandey'}
            </a>
            <p className="text-sm text-[var(--color-text-muted)] mt-3 leading-relaxed max-w-xs">
              Building custom direct-booking platforms that help hospitality & real estate businesses eliminate aggregator commissions.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-5">
              {data?.github_url && (
                <a
                  href={data.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[var(--color-surface-3)] hover:bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-all"
                  aria-label="GitHub — Satyam Kr. Pandey"
                >
                  <GithubIcon size={16} />
                </a>
              )}
              {data?.linkedin_url && (
                <a
                  href={data.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[var(--color-surface-3)] hover:bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-all"
                  aria-label="LinkedIn — Satyam Pandey"
                >
                  <LinkedinIcon size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
              Ready to scale your brand? Reach out for a premium design audit.
            </p>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/15"
            >
              Get Free Audit
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[var(--color-surface-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
            © {new Date().getFullYear()} · Designed & Built with
            <Heart size={12} className="text-[var(--color-accent)] fill-current" />
            by Satyam Kr. Pandey
          </p>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

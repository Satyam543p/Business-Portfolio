import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Work', href: '#showcase' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Contact', href: '#contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { data } = useSelector((state) => state.profile);

  // Throttled scroll listener for backdrop blur
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback((e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const brandName = data?.headline || 'Satyam Kr. Pandey';

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <nav
        aria-label="Main navigation"
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl transition-all duration-500 rounded-2xl ${
          scrolled
            ? 'bg-[var(--color-surface-1)]/80 backdrop-blur-2xl border border-white/[0.06] shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3">
          {/* Logo / Brand */}
          <a
            href="#"
            onClick={scrollToTop}
            className="font-display text-lg font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
          >
            {brandName}
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === link.href.slice(1)
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {link.label}
                {/* Active indicator dot */}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                )}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/20"
          >
            Get Free Audit
            <ArrowRight size={14} strokeWidth={2.5} />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? 'max-h-64 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 px-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  activeSection === link.href.slice(1)
                    ? 'text-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.03]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="mt-2 flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-xl active:scale-95 transition-transform"
            >
              Get Free Audit
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

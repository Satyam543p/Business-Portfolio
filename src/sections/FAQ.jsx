import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, HelpCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: 'Why choose custom React code instead of WordPress or Wix templates?',
    a: 'Templates look generic and often load slowly due to bulky, unused code and heavy plugins. Custom React websites are built from scratch, ensuring they are lightning-fast, highly secure, fully unique to your brand design, and free of recurring plugin fees. You get total control over your digital legacy.',
  },
  {
    q: 'How does a custom website help a local small business vs. a large enterprise?',
    a: 'For a small local business, a website is a 24/7 digital office that establishes market credibility, helps local clients find you on Google Search, and allows them to message you instantly on WhatsApp. For a growing enterprise, it acts as a scalable booking engine, centralizing customer data, automating bookings, and eliminating dependency on third-party aggregators.',
  },
  {
    q: 'How does a premium custom website help in brand building?',
    a: 'Your website is the digital storefront of your business. In the Indian market, trust is built on credibility. A slow, cheap-looking template signals lack of effort, while a fast, premium web experience instantly increases your brand value, builds customer confidence, and lets you charge a premium for your services.',
  },
  {
    q: 'Who owns the website and code after launch?',
    a: 'It depends on your investment tier. If you purchase any one-time build plan (Starter, Business Standard, Premium Dynamic, or Custom Web App), you own 100% of the code, database, and domain from Day 1. For monthly retainer models, codebase ownership transfers to you after completing the agreed retainer commitment term.',
  },
  {
    q: 'Why shouldn\'t I just hire a cheap agency for ₹5,000?',
    a: 'Cheap agencies use bloated, copy-paste WordPress templates that load slowly, get hacked easily, and look identical to your competitors. Furthermore, they often trap you with hidden fees for minor edits. I provide a 100% custom-coded, high-performance solution starting from Tier 1 (₹5,000) up to enterprise-level apps—with direct WhatsApp support.',
  },
  {
    q: 'Will the website work smoothly on slow mobile networks (3G/4G)?',
    a: 'Yes, performance is built into the engineering. Every script is tree-shaken, images are compressed and served via CDN webp format, and layouts are coded defensively. Your website will load rapidly even on standard mobile connections in tier-2 or tier-3 cities.',
  },
];

function FAQ() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set('.faq-item', { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      '.faq-item',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, { scope: containerRef });

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={containerRef}
      className="relative bg-[var(--color-surface-1)] py-24 px-6 scroll-mt-20 border-t border-[var(--color-surface-border)] overflow-hidden"
    >
      {/* Subtle Grid pattern in background */}
      <div className="absolute inset-0 dot-grid-bg opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider bg-orange-950/40 border border-orange-500/20 px-3 py-1 rounded-full">
            Common Inquiries
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mt-4 mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm sm:text-base max-w-xl mx-auto">
            Direct, honest answers about building, owning, and growing your digital brand.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 text-left">
          {FAQS.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <div
                key={i}
                className="faq-item glass-card rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex items-start justify-between gap-4 p-6 sm:p-8 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex gap-4 items-start">
                    <span className="text-[var(--color-accent)] mt-0.5 flex-shrink-0">
                      <HelpCircle size={18} />
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
                      {faq.q}
                    </h3>
                  </div>
                  <span
                    className={`text-[var(--color-text-muted)] mt-0.5 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[var(--color-accent)]' : ''
                    }`}
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                {/* Collapsible Answer */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-60 border-t border-[var(--color-surface-border)]' : 'max-h-0'
                  }`}
                >
                  <p className="p-6 sm:p-8 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Monitor, CreditCard, Cpu, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    icon: <Monitor size={24} />,
    title: 'Brand & Authority Websites',
    desc: 'First impressions matter. I design and code highly polished, custom websites that instantly build trust, convey your premium brand value, and stand out from competitors.',
  },
  {
    icon: <CreditCard size={24} />,
    title: 'Direct Booking & E-Commerce',
    desc: 'Stop paying hefty 20% fees. I build direct reservation systems, custom ordering engines, and checkout portals that keep customer relationships and profits in your hands.',
  },
  {
    icon: <Cpu size={24} />,
    title: 'Scalable Web Applications',
    desc: 'Custom-built dashboards, portals, and operational software that grow with your traffic. Built on React and secure cloud databases for lightning-fast speeds.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Performance & Speed Audits',
    desc: 'Indian mobile users access websites on varying network speeds. I optimize code, compress media, and build lightweight bundles that load under 1.5 seconds on any connection.',
  },
];

function Services() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set('.service-card', { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      '.service-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section
      id="services"
      ref={containerRef}
      className="bg-[var(--color-light-1)] py-24 px-6 scroll-mt-20 border-t border-[var(--color-light-border)]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full">
            Our Offerings
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-on-light)] mt-4 mb-4">
            How I Help <span className="text-gradient">Your Business Grow</span>
          </h2>
          <p className="text-[var(--color-text-on-light-secondary)] text-sm sm:text-base max-w-xl mx-auto">
            Practical digital assets built to secure trust, drive direct inquiries, and scale without recurring template fees.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((srv, i) => (
            <div
              key={i}
              className="service-card glass-card-light rounded-2xl p-8 flex gap-6 items-start text-left"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
                {srv.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold text-[var(--color-text-on-light)]">
                  {srv.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-on-light-secondary)] leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;

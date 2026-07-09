import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Compass, BarChart3, Smartphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  {
    id: 'web-apps',
    title: 'High-Performance Web Apps',
    icon: Globe,
    desc: 'Custom React/Next.js platforms built for speed, SEO, and massive scale. Lightning-fast response times and flawless user flows.',
    color: 'from-orange-500/20 to-rose-500/5',
    iconColor: 'text-orange-500',
  },
  {
    id: 'immersive',
    title: 'Immersive Experiences',
    icon: Compass,
    desc: 'Scroll-driven storytelling, 3D showcases (Three.js/WebGL), and premium micro-animations that capture attention and build authority.',
    color: 'from-blue-500/20 to-cyan-500/5',
    iconColor: 'text-blue-500',
  },
  {
    id: 'dashboards',
    title: 'Internal Dashboards & Systems',
    icon: BarChart3,
    desc: 'Operational software, CRM integrations, and admin dashboards built to streamline bookings, databases, and business operations.',
    color: 'from-emerald-500/20 to-teal-500/5',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'native-apps',
    title: 'Cross-Platform Native Apps',
    icon: Smartphone,
    desc: 'High-quality React Native iOS and Android apps sharing a unified backend ecosystem for frictionless mobile distribution.',
    color: 'from-purple-500/20 to-pink-500/5',
    iconColor: 'text-purple-500',
  },
];

function Capabilities() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set('.capability-card', { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      '.capability-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section
      id="capabilities"
      ref={containerRef}
      className="bg-[var(--color-surface-1)] py-20 px-6 border-t border-[var(--color-surface-border)] relative overflow-hidden"
    >
      <div className="absolute inset-0 dot-grid-bg opacity-[0.02] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider bg-orange-950/40 border border-orange-500/20 px-3 py-1 rounded-full">
            Technical Capabilities
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mt-4">
            Engineering Premium <span className="text-gradient">Digital Architecture</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.id}
              className="capability-card glass-card rounded-2xl p-6 hover:bg-white/[0.04] transition-colors group relative overflow-hidden flex flex-col justify-between"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cap.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-[var(--color-surface-2)] flex items-center justify-center mb-5 ${cap.iconColor} shadow-inner shadow-white/5`}>
                  <cap.icon size={22} strokeWidth={2} />
                </div>
                
                <h3 className="font-display text-base font-bold text-[var(--color-text-primary)] mb-3">
                  {cap.title}
                </h3>
                
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Capabilities;

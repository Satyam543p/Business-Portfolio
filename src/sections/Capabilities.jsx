import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Compass, BarChart3, Smartphone, Zap } from 'lucide-react';

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
    title: 'Admin Portals & Dashboards',
    icon: BarChart3,
    desc: 'Admin panels & portal dashboards built for schools, clinics, and local agencies to easily manage admissions, appointments, staff scheduling, and operations.',
    color: 'from-emerald-500/20 to-teal-500/5',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'native-apps',
    title: 'Mobile Booking & Portal Apps',
    icon: Smartphone,
    desc: 'iOS and Android mobile apps designed for clinics, schools, and service providers to offer direct booking, scheduling, and portal access to their users.',
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
            Direct-Booking &amp; <span className="text-gradient">Admissions Architecture</span>
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

        {/* Speed Audits / Tech Proof Comparison */}
        <div className="mt-16 capability-card glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/5 max-w-4xl mx-auto">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/5 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Explainer */}
            <div className="md:col-span-5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.06] text-[10px] font-bold text-[var(--color-accent-light)] uppercase tracking-wider mb-4">
                <Zap size={10} className="fill-[var(--color-accent)]" /> Performance Ledger
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)] mb-3">
                Why Custom Code Wins Over Cheap Templates
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Cheap WordPress templates load bloated scripts, crashing performance on mobile networks. Code Captain websites are custom-engineered to load instantly, improving customer retention by up to 40% in tier-2 and tier-3 locations.
              </p>
            </div>
            
            {/* Speed Comparison Visualizer */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bloated template */}
              <div className="bg-[var(--color-surface-1)] border border-white/5 rounded-2xl p-5 flex flex-col justify-between text-left">
                <div>
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Typical Builder / WordPress</span>
                  <h4 className="text-sm font-bold text-red-400 mb-4">Slow Template Site</h4>
                </div>
                <div className="flex items-center gap-4">
                  {/* Gauge representation */}
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-red-500/10 text-red-400">
                    <span className="text-lg font-bold font-display">42</span>
                    <span className="text-[8px] absolute bottom-1.5">Speed</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-[var(--color-text-secondary)]">⏱️ Load time: <span className="font-semibold text-red-400">3.8s</span></p>
                    <p className="text-[var(--color-text-muted)] text-[10px]">Loses 25% visitors before load</p>
                  </div>
                </div>
              </div>
              
              {/* Code Captain site */}
              <div className="bg-[var(--color-surface-2)] border border-[var(--color-accent)]/20 rounded-2xl p-5 flex flex-col justify-between text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-accent)]/5 blur-xl rounded-full" />
                <div>
                  <span className="text-[10px] font-bold text-[var(--color-accent-light)] uppercase tracking-wider block mb-1">Code Captain Standard</span>
                  <h4 className="text-sm font-bold text-[var(--color-accent-light)] mb-4">Custom React Engine</h4>
                </div>
                <div className="flex items-center gap-4">
                  {/* Gauge representation */}
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-[var(--color-accent)]/30 text-[var(--color-accent-light)] shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                    <span className="text-lg font-bold font-display">100</span>
                    <span className="text-[8px] absolute bottom-1.5">Speed</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-[var(--color-text-secondary)]">⏱️ Load time: <span className="font-semibold text-[var(--color-accent-light)]">0.4s</span></p>
                    <p className="text-[var(--color-accent-light)] text-[10px]">Zero conversion leakage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Capabilities;

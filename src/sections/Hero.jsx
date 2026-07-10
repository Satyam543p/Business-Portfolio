import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { fetchCaseStudies } from '../store/slices/caseStudiesSlice.js';
import { ArrowDown, Sparkles } from 'lucide-react';

// Brand SVGs — Lucide doesn't include brand logos
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
import { getFilePreviewUrl } from '../lib/appwrite.js';

const STATS = [
  { id: 'projects', label: 'Premium Brands Built', suffix: '+' },
  { id: 'years', label: 'Years Coding', suffix: '+' },
  { id: 'satisfaction', label: 'Customer Reach', suffix: 'k+' },
  { id: 'revenue', label: 'Client Growth', prefix: '>', suffix: '%' },
];

function Hero() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.profile);
  const { items: caseStudies } = useSelector((state) => state.caseStudies);
  const containerRef = useRef(null);
  const statRefs = useRef({});

  // Fetch case studies for stats
  useEffect(() => {
    dispatch(fetchCaseStudies());
  }, [dispatch]);

  // Derive stat values from live data
  const statValues = {
    projects: caseStudies?.length || 4,
    years: 4,
    satisfaction: 10,
    revenue: 50,
  };

  // GSAP Entrance Animation
  useGSAP(() => {
    if (status !== 'succeeded' || !data) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.hero-animate', { opacity: 1, y: 0 });
      // Set stat values immediately
      STATS.forEach((stat) => {
        const el = statRefs.current[stat.id];
        if (el) el.textContent = statValues[stat.id];
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      '.hero-animate',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.12 }
    );

    // Animate stat counters
    STATS.forEach((stat, i) => {
      const target = statValues[stat.id];
      const obj = { value: 0 };
      tl.to(obj, {
        value: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          const el = statRefs.current[stat.id];
          if (el) el.textContent = Math.round(obj.value);
        },
      }, i === 0 ? '-=0.5' : '<+0.1');
    });
  }, { scope: containerRef, dependencies: [status, data, caseStudies] });

  // Interactive Mouse-Following Aurora
  const handleMouseMove = (e) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to('.aurora-orb', {
      x: x - 200,
      y: y - 200,
      duration: 1.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  // Avatar URL builder
  const avatarUrl = data?.avatar_file_id
    ? getFilePreviewUrl(
        data.avatar_file_id,
        384,
        384
      )
    : null;

  // Loading State
  if (status === 'loading' || status === 'idle') {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="shimmer h-8 w-48 rounded-full" />
            <div className="shimmer h-16 w-full rounded-2xl" />
            <div className="shimmer h-6 w-3/4 rounded-lg" />
            <div className="flex gap-4 mt-8">
              <div className="shimmer h-12 w-40 rounded-xl" />
              <div className="shimmer h-12 w-40 rounded-xl" />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="shimmer w-48 h-48 rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (status === 'failed') {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <p className="text-error font-semibold mb-2">Failed to load profile</p>
          <p className="text-text-muted text-sm">Please check your connection and refresh.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Aurora Mesh Background */}
      <div className="aurora-bg">
        <div className="aurora-orb" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left — Text Content */}
          <div className="lg:col-span-7 text-left">
            {/* Badge */}
            <div className="hero-animate inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent-subtle)] text-xs font-semibold text-[var(--color-accent-light)] mb-6">
              <Sparkles size={14} />
              {data?.sub_headline || 'Brand Growth & Premium Web Engineering'}
            </div>

            {/* Headline */}
            <h1 className="hero-animate font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              Engineer Custom <span className="text-gradient">Digital Ecosystems.</span>
            </h1>

            {/* Sub-text */}
            <p className="hero-animate text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              {data?.bio || 'I design and engineer premium web applications, immersive digital experiences, and scalable internal systems that drive growth and establish market authority.'}
            </p>

            {/* CTA Row */}
            <div className="hero-animate flex flex-wrap gap-4 mb-12">
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}?text=${encodeURIComponent('Hi, I would like a free audit of my business brand.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/25"
              >
                WhatsApp For Free Audit
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href="#pricing"
                onClick={(e) => { e.preventDefault(); document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all active:scale-95 border border-white/20 backdrop-blur-sm"
              >
                View Packages & ROI
              </a>
            </div>

            {/* Stat Counters */}
            <div className="hero-animate grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <div key={stat.id} className="glass-card rounded-xl px-4 py-3 text-center">
                  <div className="text-2xl font-display font-bold text-[var(--color-text-primary)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {stat.prefix || ''}
                    <span ref={(el) => (statRefs.current[stat.id] = el)}>0</span>
                    {stat.suffix || ''}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)] font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Avatar + Social Links */}
          <div className="lg:col-span-5 flex flex-col items-center gap-6">
            {/* Avatar with glow ring & orbital spin */}
            <div className="hero-animate relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center">
              
              {/* Outer Dashed Orbiting Ring */}
              <div className="absolute -inset-6 rounded-full border border-dashed border-white/10 animate-[spin_40s_linear_infinite] pointer-events-none" />
              
              {/* Outer Ambient Glow */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[var(--color-accent)]/40 via-transparent to-amber-500/30 blur-2xl opacity-75 animate-pulse pointer-events-none" />
              
              {/* Rotating Gradient Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-accent)] via-orange-400 to-amber-300 animate-[spin_8s_linear_infinite] shadow-2xl pointer-events-none" />
              
              {/* Static Dark Border Mask (makes it look like a hollow ring) */}
              <div className="absolute inset-[3px] rounded-full bg-[var(--color-surface-1)] pointer-events-none" />
              
              {/* Static Image Container */}
              <div className="absolute inset-[6px] rounded-full overflow-hidden bg-[var(--color-surface-2)] flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={data?.headline || 'Profile avatar'}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl font-display font-bold text-gray-500">
                    {(data?.headline || 'S').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="hero-animate flex items-center gap-3">
              {data?.github_url && (
                <a
                  href={data.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  aria-label="GitHub Profile — Satyam Pandey"
                >
                  <GithubIcon size={16} />
                  <span className="hidden sm:inline">Satyam Pandey</span>
                </a>
              )}
              {data?.linkedin_url && (
                <a
                  href={data.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  aria-label="LinkedIn Profile — Satyam Pandey"
                >
                  <LinkedinIcon size={16} />
                  <span className="hidden sm:inline">Satyam Pandey</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

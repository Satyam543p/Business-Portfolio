import { useRef, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, TrendingUp, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getFilePreviewUrl } from '../lib/appwrite.js';

gsap.registerPlugin(ScrollTrigger);

function Showcase() {
  const { items, status } = useSelector((state) => state.caseStudies);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Build unique categories from data
  const published = items?.filter((item) => item.is_published !== false && item.title !== '__SYSTEM_CATEGORIES__') || [];
  const baseCategories = ['All', ...new Set(published.map((i) => i.category).filter(Boolean))];
  const categories = [...baseCategories];
  if (!categories.includes('education')) categories.push('education');
  if (!categories.includes('personal')) categories.push('personal');

  const filtered = activeCategory === 'All' ? published : published.filter((item) => item.category === activeCategory);

  // ── 3D Tilt Handler ──
  const handleMouseMove = useCallback((e, cardEl) => {
    if (!cardEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    gsap.to(cardEl, {
      rotateY: x * 5,
      rotateX: -y * 5,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
      transformOrigin: 'center center',
    });
  }, []);

  const handleMouseLeave = useCallback((cardEl) => {
    if (!cardEl) return;
    gsap.to(cardEl, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, []);

  // ── Horizontal Scroll Controls ──
  const checkScrollBounds = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollBounds();
    el.addEventListener('scroll', checkScrollBounds, { passive: true });
    return () => el.removeEventListener('scroll', checkScrollBounds);
  }, [filtered, checkScrollBounds]);

  const scrollBy = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 380, behavior: 'smooth' });
  }, []);

  // ── GSAP ScrollTrigger Reveal ──
  useGSAP(() => {
    if (status !== 'succeeded' || !filtered.length) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Clean up existing triggers inside this scope
    ScrollTrigger.getAll().forEach((st) => {
      if (containerRef.current?.contains(st.trigger)) st.kill();
    });

    if (prefersReducedMotion) {
      gsap.set('.showcase-card', { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      '.showcase-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, { scope: containerRef, dependencies: [status, activeCategory] });

  // ── Thumbnail URL builder ──
  const getThumb = (fileId, w = 640, h = 400) => {
    return getFilePreviewUrl(fileId, w, h);
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <section className="bg-[var(--color-light-0)] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="shimmer h-10 w-64 rounded-xl mb-8 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-72 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="bg-[var(--color-surface-1)] py-24 px-6 scroll-mt-20 border-t border-[var(--color-surface-border)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Selected <span className="text-gradient">Work</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-base max-w-2xl mx-auto">
            Premium website designs that scale brand value. Explore hand-crafted web experiences engineered to drive exponential business growth and establish market authority in the Indian landscape.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex justify-start md:justify-center mb-12 overflow-x-auto no-scrollbar -mx-6 px-6">
            <div className="inline-flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-2xl whitespace-nowrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-[var(--color-accent)] text-white shadow-md shadow-orange-500/20'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Bento Grid — Featured Projects ═══ */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {filtered.map((item, idx) => {
              const isLarge = idx === 0 && filtered.length > 2;
              return (
                <div
                  key={item.$id}
                  className={`showcase-card group flex flex-col bg-surface-2 border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[var(--color-accent)]/30 ${
                    isLarge 
                      ? 'md:col-span-2 md:relative md:min-h-[420px]' 
                      : 'col-span-1 md:relative md:min-h-[380px]'
                  }`}
                  onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Image wrapper */}
                  <div className={`relative w-full aspect-video bg-surface-3 flex items-center justify-center overflow-hidden shrink-0 ${
                    isLarge 
                      ? 'md:absolute md:inset-0 md:w-full md:h-full md:aspect-auto md:z-0' 
                      : 'md:absolute md:inset-0 md:w-full md:h-full md:aspect-auto md:z-0'
                  }`}>
                    {/* Underlying Loading Text */}
                    <span className="absolute text-xs text-[var(--color-text-muted)] select-none">
                      Premium Design Asset
                    </span>

                    {(item.thumbnail_file_id && item.thumbnail_file_id !== 'auto_screenshot') || item.live_url ? (
                      <img
                        src={
                          (item.thumbnail_file_id && item.thumbnail_file_id !== 'auto_screenshot')
                            ? getThumb(item.thumbnail_file_id, isLarge ? 960 : 640, isLarge ? 600 : 400)
                            : `https://api.microlink.io/?url=${encodeURIComponent(item.live_url)}&screenshot=true&embed=screenshot.url`
                        }
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading={idx < 3 ? 'eager' : 'lazy'}
                        onError={(e) => {
                          e.target.style.opacity = '0';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-surface-3 flex items-center justify-center text-xs text-gray-500">
                        Premium Design Asset
                      </div>
                    )}

                    {/* Mobile Badges (rendered inside the aspect-video container) */}
                    <div className="absolute top-3 left-3 flex gap-2 md:hidden">
                      {item.category && (
                        <span className="px-2.5 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-semibold text-white">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 md:hidden">
                      {item.roi_value && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-emerald-400/20 shadow-md">
                          <TrendingUp size={10} />
                          +{item.roi_value}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop Vignette Overlay */}
                  <div className="hidden md:block md:absolute md:inset-0 md:bg-gradient-to-t md:from-neutral-950 md:via-neutral-900/60 md:to-black/30 md:z-10 md:transition-opacity md:duration-500 md:group-hover:opacity-90" />

                  {/* Desktop Badges (rendered at the card level on desktop) */}
                  <div className="hidden md:flex md:absolute md:top-4 md:left-4 md:z-20 md:gap-2">
                    {item.category && (
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-semibold text-white">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block md:absolute md:top-4 md:right-4 md:z-20">
                    {item.roi_value && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full border border-emerald-400/20 shadow-lg shadow-emerald-500/20">
                        <TrendingUp size={12} />
                        +{item.roi_value}%
                      </span>
                    )}
                  </div>

                  {/* Card Content & Text Description */}
                  <div className="p-5 flex flex-col justify-between flex-grow md:absolute md:inset-0 md:p-6 md:p-8 md:z-20 md:flex md:flex-col md:justify-end md:h-full md:pointer-events-none">
                    <div className="space-y-2.5 md:pointer-events-auto">
                      <h3 className={`font-display font-bold text-white group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 ${
                        isLarge ? 'text-lg md:text-2xl lg:text-3xl' : 'text-base md:text-xl'
                      }`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-3 md:text-gray-300 md:max-w-2xl ${
                        isLarge ? 'md:text-base md:line-clamp-4' : 'md:line-clamp-2 md:group-hover:line-clamp-4'
                      }`}>
                        {item.description}
                      </p>

                      {item.live_url && (
                        <div className="pt-4 border-t border-white/10 mt-4 flex flex-wrap gap-4 items-center justify-between">
                          {item.roi_metric && isLarge && (
                            <span className="text-[10px] md:text-xs text-gray-400 italic font-display pr-2 truncate max-w-[180px] md:max-w-[280px]">
                              Metric: {item.roi_metric}
                            </span>
                          )}
                          <a
                            href={item.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white text-xs font-semibold rounded-xl transition-all active:scale-95 shadow-md shadow-orange-500/15 ml-auto"
                          >
                            View Live
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 glass-card rounded-3xl border border-white/5 max-w-lg mx-auto mb-12">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent-light)] flex items-center justify-center mb-4 border border-[var(--color-accent)]/20 animate-pulse">
              <Sparkles size={20} />
            </div>
            <h4 className="font-display text-lg font-bold text-[var(--color-text-primary)] mb-2">Projects Coming Soon</h4>
            <p className="text-[var(--color-text-secondary)] text-sm max-w-sm leading-relaxed">
              I am currently engineering custom digital solutions for this sector. Check back shortly, or reach out to design yours!
            </p>
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}?text=${encodeURIComponent("Hi Satyam, I'd like to discuss a custom build project in the " + activeCategory + " space.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white text-xs font-semibold rounded-xl transition-all active:scale-95 shadow-md shadow-orange-500/15"
            >
              Inquire About Custom Builds
            </a>
          </div>
        )}

        {/* ═══ Horizontal Scroll Gallery ═══ */}
        {published.length > 3 && (
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                All Projects
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollBy(-1)}
                  disabled={!canScrollLeft}
                  className="p-2 rounded-xl border border-white/10 text-[var(--color-text-secondary)] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollBy(1)}
                  disabled={!canScrollRight}
                  className="p-2 rounded-xl border border-white/10 text-[var(--color-text-secondary)] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto custom-scrollbar pb-4 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarGutter: 'stable' }}
            >
              {published.map((item) => (
                <div
                  key={`scroll-${item.$id}`}
                  className="flex-none w-[320px] snap-start"
                  onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="glass-card rounded-2xl overflow-hidden h-full">
                    <div className="relative h-40 bg-[var(--color-surface-2)] flex items-center justify-center overflow-hidden">
                      <span className="absolute text-xs text-[var(--color-text-muted)] select-none">
                        Premium Design Asset
                      </span>
                      {((item.thumbnail_file_id && item.thumbnail_file_id !== 'auto_screenshot') || item.live_url) && (
                        <img
                          src={
                            (item.thumbnail_file_id && item.thumbnail_file_id !== 'auto_screenshot')
                              ? getThumb(item.thumbnail_file_id, 480, 300)
                              : `https://api.microlink.io/?url=${encodeURIComponent(item.live_url)}&screenshot=true&embed=screenshot.url`
                          }
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 hover:scale-105 z-10"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.opacity = '0';
                          }}
                        />
                      )}
                      {item.roi_value && (
                        <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/90 text-white text-[11px] font-bold rounded-full z-20">
                          <TrendingUp size={10} />
                          +{item.roi_value}%
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-display text-sm font-bold text-[var(--color-text-primary)] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Showcase;

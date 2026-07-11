import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, Clock, Shield, Server, Mail, Globe, Layers, Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BUILD_TIERS = [
  {
    name: 'Starter (Tier 1)',
    price: '₹5,000 – ₹15,000',
    desc: 'Perfect for salons, tuition centers, single-doctor clinics, small kirana-adjacent shops, freelancers, personal portfolios, students, and small NGOs.',
    delivery: '3–5 days',
    features: [
      '1–5 Pages (Home, Services, Gallery, Contact, etc.)',
      'Mobile-responsive & fast-loading design',
      'Basic on-page SEO (titles, tags, sitemap, robots.txt)',
      'WhatsApp click-to-chat integration',
      'Google Maps location embed',
      'Google Business Profile setup/claim help',
      'Standard contact form with email delivery',
      '1 round of revision',
    ],
    cta: 'Get Starter Plan',
    popular: false,
    whatsappMsg: "Hi Satyam, I'm interested in the Starter (Tier 1) build plan for my business."
  },
  {
    name: 'Business Standard (Tier 2)',
    price: '₹15,000 – ₹35,000',
    desc: 'Best for active clinics, restaurants, boutique hotels, gyms, local retailers, schools (admissions/announcements pages), and diagnostic centers.',
    delivery: '7–12 days',
    features: [
      'Everything in Tier 1 included',
      'Dynamic CMS (easily update menu, services, timings)',
      'Enquiry/booking form with WhatsApp + email routing',
      'Dynamic photo gallery with premium lightbox',
      'Live Google Reviews widget embed',
      'Local SEO (city & service keyword targeting, schema)',
      'Blog or announcements section (optional)',
      '2 rounds of revisions',
    ],
    cta: 'Get Business Plan',
    popular: false,
    whatsappMsg: "Hi Satyam, I'm interested in the Business Standard (Tier 2) build plan."
  },
  {
    name: 'Premium Dynamic (Tier 3)',
    price: '₹55,000 – ₹1,00,000+',
    desc: 'Best for hotels, real estate agencies, clubs, hospitals (department + appointment booking pages), and multi-branch schools.',
    delivery: '2–4 weeks',
    features: [
      'Everything in Tier 2 included',
      'Full admin dashboard (manage room, staff, menu, events)',
      'Direct booking engine (bypass aggregator commission fees)',
      'Secure payment gateway integration (Razorpay/PhonePe)',
      'Multi-language support (Hindi/regional + English)',
      'Performance analytics & client dashboard',
      'Staff/role-based system access permissions',
      '3 rounds of revisions',
    ],
    cta: 'Get Premium Plan',
    popular: true,
    whatsappMsg: "Hi Satyam, I'm interested in the Premium Dynamic (Tier 3) build plan."
  },
  {
    name: 'Custom Web App (Tier 4)',
    price: 'Quoted per scope',
    note: 'Typically ₹80,000+',
    desc: 'Best for startups, SaaS MVPs, and custom internal operations tools.',
    delivery: 'Sprint-based timeline',
    features: [
      'Custom authentication & role permissions',
      'Advanced API integrations (CRM, payment, custom services)',
      'Interactive dashboards & complex data models',
      'Staging + production deployment environments',
      'Comprehensive documentation & developer handoff',
      'Priced per sprint/milestone to prevent scope creep',
    ],
    cta: 'Discuss Custom Project',
    popular: false,
    whatsappMsg: "Hi Satyam, I want to discuss a custom web application / startup MVP project."
  },
];

const RETAINERS = [
  {
    name: 'Basic Retainer',
    hours: '8–10 hrs / month',
    price: '₹8,000 – ₹15,000',
    desc: 'Perfect for small monthly content updates and minor features.',
    bestFor: 'Small static sites needing occasional adjustments.',
    features: [
      'Text and image content replacements',
      'Minor CSS style adjustments',
      'Small feature tweaks & enhancements',
    ],
  },
  {
    name: 'Standard Retainer',
    hours: '15–20 hrs / month',
    price: '₹20,000 – ₹35,000',
    desc: 'Best for active businesses regular feature additions and optimization.',
    bestFor: 'E-commerce, blogs, and content-rich business portals.',
    features: [
      'New page design and integration',
      'Integration modifications & upgrades',
      'Regular UI/UX reviews and refinements',
    ],
  },
  {
    name: 'Priority Retainer',
    hours: '25–30 hrs / month',
    price: '₹40,000 – ₹60,000',
    desc: 'Startups needing near-continuous development and prioritized support.',
    bestFor: 'SaaS platforms, dynamic engines, and fast-scaling products.',
    features: [
      'Priority task scheduling & queueing',
      'Direct communication channel & instant support',
      'Continuous development and deployment iterations',
    ],
  },
];

const AMC_PLANS = [
  {
    name: 'Basic AMC',
    price: '₹1,000 – ₹2,000',
    period: '/ month',
    desc: 'Keeps what exists alive, secure, and running smoothly.',
    features: [
      '24/7 Uptime monitoring & alert setup',
      'Basic security patch deployments',
      '2–3 minor text/image swaps per month',
      'Regular automated site backups',
    ],
  },
  {
    name: 'Standard AMC',
    price: '₹2,500 – ₹5,000',
    period: '/ month',
    desc: 'Ensures optimal speed, compatibility, and proactive bug fixing.',
    features: [
      'Includes everything in Basic AMC',
      'Plugin and dependency updates',
      'Monthly performance health check',
      'Standard bug fixes & troubleshooting',
    ],
  },
  {
    name: 'Premium AMC',
    price: '₹5,000 – ₹10,000',
    period: '/ month',
    desc: 'High-priority support with reporting and search optimization audits.',
    features: [
      'Includes everything in Standard AMC',
      'Priority SLA response (24–48 hours)',
      'Monthly analytics and usage reports',
      'SEO health check & recommendation list',
    ],
  },
];

const HOSTING_OPTIONS = [
  {
    title: 'Option A: Client-Owned Hosting',
    price: '₹1,000 – ₹3,000 setup',
    icon: Server,
    desc: 'I deploy to your hosting account (Hostinger, GoDaddy, Vercel, AWS, etc.). You purchase the plan directly from the provider. You retain 100% account ownership; I maintain access solely for developer support.',
  },
  {
    title: 'Option B: Managed Hosting',
    price: '₹500 – ₹2,000 / month',
    icon: Globe,
    desc: 'Hosted on my premium reseller infrastructure (VPS, Vercel, Netlify, or Appwrite Cloud). Billed monthly. Can be bundled with AMC for a single combined "Care Plan" billing.',
  },
  {
    title: 'Domain Registration & SSL',
    price: 'Pass-through cost + ₹200–₹500 convenience fee',
    icon: Shield,
    desc: 'I handle domain booking and DNS setup. SSL security certificates are configured for free via Cloudflare/Let\'s Encrypt (never pay for SSL; it\'s included standard).',
  },
  {
    title: 'Business Email Setup',
    price: '₹500 – ₹1,500 setup',
    icon: Mail,
    desc: 'Professional domain email setup (e.g., info@yourbrand.com) via Google Workspace or Zoho Mail. The subscription fee is paid by the client directly to the provider.',
  },
];

const ADD_ONS = [
  { name: 'Extra Page (beyond package limit)', price: '₹1,000 – ₹2,500 / page' },
  { name: 'Custom Logo Design', price: '₹1,500 – ₹5,000' },
  { name: 'Copywriting (per page)', price: '₹500 – ₹1,500' },
  { name: 'Product Photography Coordination', price: 'Quoted per scope' },
  { name: 'WhatsApp Business API Integration', price: '₹3,000 – ₹8,000' },
  { name: 'Advanced SEO Package (ongoing)', price: '₹5,000 – ₹15,000 / month' },
  { name: 'Google Ads / Meta Ads Setup', price: '₹3,000 – ₹10,000 one-time' },
  { name: 'Multi-Location Franchise Expansion', price: 'Quoted per location' },
];

function Pricing() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('build');
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

  const getWhatsAppLink = (text) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set('.pricing-card, .tab-content-area', { opacity: 1, y: 0 });
      return;
    }

    // Scroll trigger entry animation (runs once)
    gsap.fromTo(
      '.pricing-header-elements',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, { scope: containerRef });

  // Tab switch fade and rise animation
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      '.tab-content-area',
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }
    );
  }, { scope: containerRef, dependencies: [activeTab] });

  return (
    <section
      id="pricing"
      ref={containerRef}
      className="bg-[var(--color-light-1)] py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20 border-t border-[var(--color-light-border)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 pricing-header-elements">
          <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-on-light)] mt-4 mb-4">
            Invest in Your <span className="text-gradient">Brand's Digital Legacy</span>
          </h2>
          <p className="text-[var(--color-text-on-light-secondary)] text-sm sm:text-base max-w-2xl mx-auto">
            Flexible pricing models for local businesses, startups, and enterprises. Choose an affordable one-time build, structured monthly retainer, or baseline AMC support.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-12 pricing-header-elements">
          <div className="inline-flex p-1 bg-black/[0.04] border border-black/5 rounded-2xl max-w-full overflow-x-auto no-scrollbar shadow-inner">
            <button
              onClick={() => setActiveTab('build')}
              className={`px-5 sm:px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'build'
                  ? 'bg-white text-[var(--color-text-on-light)] shadow-sm font-semibold'
                  : 'text-[var(--color-text-on-light-secondary)] hover:text-[var(--color-text-on-light)] font-normal'
              }`}
            >
              One-Time Build Plans
            </button>
            <button
              onClick={() => setActiveTab('retainers')}
              className={`px-5 sm:px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'retainers'
                  ? 'bg-white text-[var(--color-text-on-light)] shadow-sm font-semibold'
                  : 'text-[var(--color-text-on-light-secondary)] hover:text-[var(--color-text-on-light)] font-normal'
              }`}
            >
              Retainers & AMC
            </button>
            <button
              onClick={() => setActiveTab('hosting_addons')}
              className={`px-5 sm:px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'hosting_addons'
                  ? 'bg-white text-[var(--color-text-on-light)] shadow-sm font-semibold'
                  : 'text-[var(--color-text-on-light-secondary)] hover:text-[var(--color-text-on-light)] font-normal'
              }`}
            >
              Hosting & Add-ons
            </button>
          </div>
        </div>

        {/* Tab Contents Area */}
        <div className="tab-content-area min-h-[400px]">
          {/* TAB 1: BUILD PLANS */}
          {activeTab === 'build' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {BUILD_TIERS.map((pkg, i) => (
                <div
                  key={i}
                  className={`pricing-card glass-card-light rounded-2xl p-6 flex flex-col justify-between text-left relative ${
                    pkg.popular ? 'border-2 border-[var(--color-accent)] shadow-lg shadow-orange-500/5 bg-white scale-[1.01] lg:scale-[1.02]' : ''
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--color-accent)] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                      Best Value / Popular
                    </span>
                  )}

                  <div>
                    {/* Card Header */}
                    <div className="mb-6">
                      <h3 className="font-display text-base font-bold text-[var(--color-text-on-light)] mb-1">
                        {pkg.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-2 mb-2">
                        <span className="text-2xl sm:text-3xl font-display font-bold text-[var(--color-text-on-light)]">
                          {pkg.price}
                        </span>
                      </div>
                      {pkg.note && (
                        <p className="text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-wider mb-2">
                          {pkg.note}
                        </p>
                      )}
                      <p className="text-xs text-[var(--color-text-on-light-secondary)] leading-relaxed mt-2 min-h-[48px]">
                        {pkg.desc}
                      </p>
                      <div className="inline-flex items-center gap-1.5 mt-3 px-2 py-1 rounded bg-black/[0.03] border border-black/5 text-[10px] font-semibold text-[var(--color-text-on-light-secondary)]">
                        <Clock size={12} />
                        Delivery: {pkg.delivery}
                      </div>
                    </div>

                    <hr className="border-black/5 mb-6" />

                    {/* Features List */}
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs text-[var(--color-text-on-light-secondary)]">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-orange-100 text-[var(--color-accent)] flex items-center justify-center mt-0.5">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={getWhatsAppLink(pkg.whatsappMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold rounded-xl active:scale-95 transition-all ${
                      pkg.popular
                        ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white shadow-lg shadow-orange-500/20'
                        : 'border border-black/10 hover:bg-black/[0.04] text-[var(--color-text-on-light)]'
                    }`}
                  >
                    {pkg.cta}
                    <ArrowRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: RETAINERS & AMC */}
          {activeTab === 'retainers' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Monthly Retainers (Left) */}
                <div className="glass-card-light rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left border border-black/5">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-[var(--color-accent)] flex items-center justify-center">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-[var(--color-text-on-light)]">
                          Monthly Retainers
                        </h3>
                        <p className="text-xs text-[var(--color-text-on-light-muted)]">
                          Ongoing feature additions & development work
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--color-text-on-light-secondary)] leading-relaxed mb-6">
                      For active startups and growing local brands requiring consistent iterations, active feature additions, and direct engineering output.
                    </p>

                    <div className="space-y-4 mb-6">
                      {RETAINERS.map((plan, idx) => (
                        <div key={idx} className="bg-white/60 hover:bg-white border border-black/5 hover:border-black/10 rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-on-light)]">{plan.name}</h4>
                              <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-[var(--color-accent)] font-semibold rounded-full">{plan.hours}</span>
                            </div>
                            <p className="text-[11px] text-[var(--color-text-on-light-secondary)] leading-relaxed">{plan.desc}</p>
                            <p className="text-[10px] text-[var(--color-text-on-light-muted)] italic">Best for: {plan.bestFor}</p>
                          </div>
                          <div className="sm:text-right shrink-0">
                            <span className="text-base sm:text-lg font-display font-bold text-[var(--color-text-on-light)]">{plan.price}</span>
                            <span className="text-[10px] text-[var(--color-text-on-light-muted)] block">/ month</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rules of Thumb */}
                  <div className="bg-orange-50 border border-orange-200/50 rounded-2xl p-4 mb-6">
                    <h5 className="text-[10px] font-bold text-[var(--color-accent-dark)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock size={12} /> Retainer Policies
                    </h5>
                    <ul className="space-y-1 text-[10.5px] text-[var(--color-text-on-light-secondary)] leading-relaxed list-disc pl-4">
                      <li>Hours cap expires monthly; up to 5 unused hours can roll over to the next month.</li>
                      <li>Overage rate is billed at <strong className="text-[var(--color-text-on-light)]">₹800–₹1,500 / hr</strong> depending on task complexity.</li>
                      <li>Minimum commitment of 3 months recommended to secure developer capacity.</li>
                    </ul>
                  </div>

                  <a
                    href={getWhatsAppLink("Hi Satyam, I'm interested in discussing custom retainer plans for ongoing development support.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white shadow-md active:scale-95 transition-all"
                  >
                    Discuss Retainer Engagement
                    <ArrowRight size={14} />
                  </a>
                </div>

                {/* Annual Maintenance (Right) */}
                <div className="glass-card-light rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left border border-black/5">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-[var(--color-accent)] flex items-center justify-center">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-[var(--color-text-on-light)]">
                          AMC Contracts
                        </h3>
                        <p className="text-xs text-[var(--color-text-on-light-muted)]">
                          Keeping your live site secure, fast, and maintained
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--color-text-on-light-secondary)] leading-relaxed mb-6">
                      Billed separately from retainer. AMC is for security monitoring, compatibility updates, regular backups, and minor diagnostic reviews.
                    </p>

                    <div className="space-y-4 mb-6">
                      {AMC_PLANS.map((plan, idx) => (
                        <div key={idx} className="bg-white/60 hover:bg-white border border-black/5 hover:border-black/10 rounded-2xl p-4 transition-all">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-on-light)]">{plan.name}</h4>
                            <div className="text-right shrink-0">
                              <span className="text-base font-display font-bold text-[var(--color-text-on-light)]">{plan.price}</span>
                              <span className="text-[10px] text-[var(--color-text-on-light-muted)]">{plan.period}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-[var(--color-text-on-light-secondary)] leading-relaxed mb-3">{plan.desc}</p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 border-t border-black/[0.03] pt-2">
                            {plan.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-on-light-secondary)]">
                                <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0" />
                                <span className="truncate">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AMC Value Pitch */}
                  <div className="bg-orange-50 border border-orange-200/50 rounded-2xl p-4 mb-6">
                    <h5 className="text-[10px] font-bold text-[var(--color-accent-dark)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Shield size={12} /> Proactive Website Upkeep
                    </h5>
                    <p className="text-[10.5px] text-[var(--color-text-on-light-secondary)] leading-relaxed">
                      Pitch advice: <em className="text-[var(--color-text-on-light)]">"Your site needs upkeep like a physical shop needs regular cleaning — nothing breaks if someone is watching it."</em> This acts as your recurring insurance against security threats and down-time.
                    </p>
                  </div>

                  <a
                    href={getWhatsAppLink("Hi Satyam, I want to inquire about setting up an AMC Care Plan for my website.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold rounded-xl border border-black/10 hover:bg-black/[0.04] text-[var(--color-text-on-light)] active:scale-95 transition-all"
                  >
                    Setup AMC Care Plan
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOSTING & ADD-ONS */}
          {activeTab === 'hosting_addons' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Hosting Columns (Left) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                <div className="glass-card-light rounded-3xl p-6 sm:p-8 border border-black/5 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[var(--color-accent)] flex items-center justify-center">
                      <Server size={20} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[var(--color-text-on-light)]">
                        Deployment & Hosting Plans
                      </h3>
                      <p className="text-xs text-[var(--color-text-on-light-muted)]">
                        Publishing your web assets to production
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {HOSTING_OPTIONS.map((opt, idx) => {
                      const IconComponent = opt.icon;
                      return (
                        <div key={idx} className="bg-white/60 border border-black/5 rounded-2xl p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2.5 mb-2">
                              <span className="w-7 h-7 rounded-lg bg-orange-50 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                                <IconComponent size={14} />
                              </span>
                              <h4 className="text-[11px] sm:text-xs font-bold text-[var(--color-text-on-light)] leading-snug">
                                {opt.title}
                              </h4>
                            </div>
                            <p className="text-[10px] text-[var(--color-text-on-light-secondary)] leading-relaxed mt-2">
                              {opt.desc}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-black/[0.03] text-left">
                            <span className="text-[10px] text-[var(--color-text-on-light-muted)] block">Investment</span>
                            <span className="text-xs font-bold text-[var(--color-accent)]">{opt.price}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Add-ons Columns (Right) */}
              <div className="lg:col-span-5">
                <div className="glass-card-light rounded-3xl p-6 sm:p-8 border border-black/5 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-[var(--color-accent)] flex items-center justify-center">
                        <Plus size={20} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-[var(--color-text-on-light)]">
                          À La Carte Add-ons
                        </h3>
                        <p className="text-xs text-[var(--color-text-on-light-muted)]">
                          Expand and customize your scope
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-black/5">
                      {ADD_ONS.map((addon, idx) => (
                        <div key={idx} className="py-3 flex justify-between items-center gap-4 text-left">
                          <div className="flex items-center gap-2">
                            <Plus size={12} className="text-[var(--color-accent)] shrink-0" />
                            <span className="text-[11px] sm:text-xs font-semibold text-[var(--color-text-on-light)] leading-tight">
                              {addon.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-[var(--color-accent)] shrink-0 whitespace-nowrap">
                            {addon.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={getWhatsAppLink("Hi Satyam, I would like to discuss adding a few custom add-ons to my web project.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 mt-6 text-xs font-bold rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white shadow-md active:scale-95 transition-all"
                  >
                    Custom Quote Discussion
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Post-Launch Maintenance & Ownership Clarification */}
        <div className="mt-16 text-left max-w-4xl mx-auto pricing-header-elements">
          <h3 className="font-display text-lg font-bold text-[var(--color-text-on-light)] mb-6 text-center">
            Transparency on Code Ownership &amp; Setup Strategy
          </h3>
          <div className="bg-white/50 backdrop-blur-md border border-black/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black/5">
              <div className="p-6 border-r border-black/5">
                <h4 className="text-xs font-bold text-[var(--color-text-on-light)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield size={14} className="text-[var(--color-accent)]" /> Code Ownership Guarantee
                </h4>
                <p className="text-xs text-[var(--color-text-on-light-secondary)] leading-relaxed">
                  <strong>Ownership is clear-cut:</strong> For all one-time build packages (Tiers 1, 2, 3), you own 100% of the custom codebase, domain configuration, and assets from Day 1. For retainer setups, developer code transfers to your name upon completion of the retainer commitment.
                </p>
              </div>
              <div className="p-6">
                <h4 className="text-xs font-bold text-[var(--color-text-on-light)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={14} className="text-[var(--color-accent)]" /> Scope Management
                </h4>
                <p className="text-xs text-[var(--color-text-on-light-secondary)] leading-relaxed">
                  To keep projects sustainable, I quote transparently up front. Any modifications or requirements requested after code sign-off are covered via formal change orders rather than introducing scope creep.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black/5">
              <div className="p-6 border-r border-black/5">
                <h4 className="text-xs font-bold text-[var(--color-text-on-light)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Plus size={14} className="text-[var(--color-accent)]" /> Payment &amp; Milestone Terms
                </h4>
                <p className="text-xs text-[var(--color-text-on-light-secondary)] leading-relaxed">
                  <strong>Standard terms:</strong> 50% advance to begin work, remaining balance due on milestone completion / pre-launch, in line with standard industry practice.
                </p>
              </div>
              <div className="p-6">
                <h4 className="text-xs font-bold text-[var(--color-text-on-light)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock size={14} className="text-[var(--color-accent)]" /> Minor Maintenance Swaps
                </h4>
                <p className="text-xs text-[var(--color-text-on-light-secondary)] leading-relaxed">
                  Up to 5 minor content swaps included in the first 3 months on one-time plans to iron out early changes. Beyond 3 months, baseline AMC options are available.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 border-r border-black/5 md:border-b-0 border-b">
                <h4 className="text-xs font-bold text-[var(--color-text-on-light)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Server size={14} className="text-[var(--color-accent)]" /> Local Optimization
                </h4>
                <p className="text-xs text-[var(--color-text-on-light-secondary)] leading-relaxed">
                  Pricing adjustments up to ±20% are available to align with metro vs. smaller tier cities in India, urgency tags, and specific platform scope definitions under mutual agreement.
                </p>
              </div>
              <div className="p-6 bg-black/[0.01]">
                <h4 className="text-xs font-bold text-[var(--color-text-on-light)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Check size={14} className="text-[var(--color-accent)]" /> Contract Sign-off
                </h4>
                <p className="text-xs text-[var(--color-text-on-light-secondary)] leading-relaxed">
                  All engagements, milestones, and deliverables are formally structured and signed under mutually protective contract agreements prior to project kick-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;

import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Lightbulb, ArrowRight } from 'lucide-react';
import {
  setMonthlyRevenue,
  setBusinessType,
  selectMonthlyRevenue,
  selectBusinessType,
  selectMonthlyLoss,
  selectAnnualLoss,
} from '../store/slices/calculatorSlice.js';

function Calculator() {
  const dispatch = useDispatch();
  const monthlyRevenue = useSelector(selectMonthlyRevenue);
  const businessType = useSelector(selectBusinessType);
  const monthlyLoss = useSelector(selectMonthlyLoss);
  const annualLoss = useSelector(selectAnnualLoss);

  const containerRef = useRef(null);
  const monthlyValRef = useRef(null);
  const annualValRef = useRef(null);
  const ctaRef = useRef(null);

  const prevMonthlyLossRef = useRef(0);
  const prevAnnualLossRef = useRef(0);

  // GSAP Ticking Number Animation
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (monthlyValRef.current) monthlyValRef.current.textContent = '₹' + Math.round(monthlyLoss).toLocaleString('en-IN');
      if (annualValRef.current) annualValRef.current.textContent = '₹' + Math.round(annualLoss).toLocaleString('en-IN');
    } else {
      const monthlyObj = { value: prevMonthlyLossRef.current };
      gsap.to(monthlyObj, {
        value: monthlyLoss,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
          if (monthlyValRef.current) monthlyValRef.current.textContent = '₹' + Math.round(monthlyObj.value).toLocaleString('en-IN');
        },
      });

      const annualObj = { value: prevAnnualLossRef.current };
      gsap.to(annualObj, {
        value: annualLoss,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
          if (annualValRef.current) annualValRef.current.textContent = '₹' + Math.round(annualObj.value).toLocaleString('en-IN');
        },
      });
    }

    prevMonthlyLossRef.current = monthlyLoss;
    prevAnnualLossRef.current = annualLoss;
  }, { scope: containerRef, dependencies: [monthlyLoss, annualLoss] });

  // CTA Pulse — limited to 3 cycles
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !ctaRef.current) return;

    gsap.fromTo(
      ctaRef.current,
      { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.4)' },
      {
        boxShadow: '0 0 0 12px rgba(249, 115, 22, 0)',
        duration: 1.8,
        repeat: 2,
        ease: 'power1.out',
      }
    );
  }, { scope: containerRef });

  // Slider fill percentage for track gradient (50k to 50 Lakhs)
  const fillPercent = ((monthlyRevenue - 50000) / (5000000 - 50000)) * 100;

  return (
    <section
      id="calculator"
      ref={containerRef}
      className="relative bg-[var(--color-surface-0)] py-24 px-6 scroll-mt-20 overflow-hidden"
    >
      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 dot-grid-bg opacity-100 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column — Explainer */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/[0.06] text-xs font-semibold text-red-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Inefficiency Leakage vs Digital Growth
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] leading-tight mb-6">
              What Is Your Inefficient Web Stack <span className="text-gradient">Costing You?</span>
            </h2>

            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
              Sluggish templates, third-party software overheads, and poor user flows leak potential revenue every single day. By moving your business to a custom digital ecosystem, you eliminate SaaS subscription bloat, optimize lead generation pipelines, and secure complete control of your digital infrastructure.
            </p>

            <div className="glass-card rounded-xl p-5 flex items-start gap-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[var(--color-accent-subtle)] flex items-center justify-center text-[var(--color-accent)]">
                <Lightbulb size={18} />
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                <strong className="text-[var(--color-text-secondary)]">The Opportunity:</strong> Reallocate bloated SaaS monthly licensing costs and lost visitor conversions into a custom digital asset that pays for itself.
              </p>
            </div>
          </div>

          {/* Right Column — Interactive Card */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-10 relative">
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-accent)]/5 blur-[60px] rounded-full pointer-events-none" />

              {/* Business Category Selector */}
              <div className="mb-8 text-left">
                <label htmlFor="business-type-select" className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-3">
                  Your Business Category
                </label>
                <select
                  id="business-type-select"
                  value={businessType}
                  onChange={(e) => dispatch(setBusinessType(e.target.value))}
                  className="w-full bg-[var(--color-surface-1)] border border-white/5 text-sm text-[var(--color-text-primary)] px-4 py-3 rounded-xl outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
                >
                  <option value="hospitality">Hospitality &amp; Retail (Hotels, Restaurants, Shops)</option>
                  <option value="general">Services &amp; Portals (Clinics, Schools, Salons, Portfolios)</option>
                </select>
              </div>

              {/* Revenue Input */}
              <div className="mb-10 text-left">
                <div className="flex justify-between items-baseline mb-4">
                  <label htmlFor="revenue-slider" className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    Monthly Revenue (INR)
                  </label>
                  <span className="text-2xl font-display font-bold text-[var(--color-text-primary)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    ₹{monthlyRevenue.toLocaleString('en-IN')}<span className="text-sm text-[var(--color-text-muted)] font-normal">/mo</span>
                  </span>
                </div>

                <input
                  id="revenue-slider"
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={monthlyRevenue}
                  onChange={(e) => dispatch(setMonthlyRevenue(e.target.value))}
                  className="custom-slider w-full"
                  aria-label="Monthly business revenue"
                  aria-valuemin={50000}
                  aria-valuemax={5000000}
                  aria-valuenow={monthlyRevenue}
                  aria-valuetext={`₹${monthlyRevenue.toLocaleString('en-IN')} per month`}
                  style={{
                    background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) ${fillPercent}%, var(--color-surface-3) ${fillPercent}%, var(--color-surface-3) 100%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-medium mt-2">
                  <span>₹50,000</span>
                  <span>₹25 Lakhs</span>
                  <span>₹50 Lakhs</span>
                </div>
              </div>

              {/* Calculated Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                <div className="bg-[var(--color-surface-1)] border border-[var(--color-surface-border)] rounded-xl p-5 text-left">
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
                    {businessType === 'hospitality' ? 'Monthly Commission Loss (20%)' : 'Monthly Conversion Leakage (15%)'}
                  </span>
                  <span
                    ref={monthlyValRef}
                    className="text-3xl font-bold text-red-400 font-display"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    ₹0
                  </span>
                </div>

                <div className="bg-[var(--color-surface-1)] border border-[var(--color-surface-border)] rounded-xl p-5 text-left relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
                    {businessType === 'hospitality' ? 'Annual Reinvestable Savings' : 'Annual Recoverable Revenue'}
                  </span>
                  <span
                    ref={annualValRef}
                    className="text-3xl font-bold text-emerald-400 font-display"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    ₹0
                  </span>
                </div>
              </div>

              {/* CTA */}
              <a
                ref={ctaRef}
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/25 text-sm cursor-pointer"
              >
                Grow My Brand Digitally
                <ArrowRight size={16} />
              </a>
              <p className="text-center text-[10px] text-[var(--color-text-muted)] mt-3">
                Zero aggregator commissions. Own your brand value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Calculator;

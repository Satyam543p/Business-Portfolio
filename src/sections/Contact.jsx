import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { submitLead, resetLeadStatus } from '../store/slices/leadsSlice.js';
import { Send, CheckCircle, Clock, MessageSquare, AlertTriangle } from 'lucide-react';

// Input field component for DRY (Defined outside to prevent recreating on parent render)
const InputField = ({ id, label, required, type = 'text', value, onChange, error, placeholder, maxLength = 120, disabled }) => (
  <div className="text-left">
    <label htmlFor={id} className="block text-xs font-semibold text-text-on-light-secondary uppercase tracking-wider mb-2">
      {label} {required && <span className="text-accent">*</span>}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      maxLength={maxLength}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`w-full bg-white border ${
        error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-black/10 focus:border-[var(--color-accent)] focus:ring-orange-200'
      } focus:ring-2 p-3 rounded-xl text-sm text-[var(--color-text-on-light)] placeholder-[var(--color-text-on-light-muted)] focus:outline-none transition-all`}
    />
    {error && (
      <p id={`${id}-error`} role="alert" className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
        <AlertTriangle size={12} />
        {error}
      </p>
    )}
  </div>
);

function Contact() {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.leads);
  const containerRef = useRef(null);
  const successCardRef = useRef(null);

  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => { dispatch(resetLeadStatus()); };
  }, [dispatch]);

  // Success animation
  useGSAP(() => {
    if (!success || !successCardRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.success-el', { opacity: 1, scale: 1 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });
    tl.fromTo(successCardRef.current, { opacity: 0, scale: 0.95, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.6 });
    tl.fromTo('.success-icon', { scale: 0 }, { scale: 1, duration: 0.4 }, '-=0.2');
    tl.fromTo('.success-el', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.2');
  }, { scope: containerRef, dependencies: [success] });

  const validateForm = () => {
    const e = {};
    if (!clientName.trim()) e.clientName = 'Your name is required.';
    if (!businessName.trim()) e.businessName = 'Business name is required.';
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
    if (!whatsappNumber.trim()) {
      e.whatsappNumber = 'WhatsApp number is required.';
    } else if (!phoneRegex.test(whatsappNumber)) {
      e.whatsappNumber = 'Enter a valid number (e.g. +919876543210).';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (honeypot) return; // Silently drop spam
    if (!validateForm()) return;
    dispatch(submitLead({
      client_name: clientName,
      business_name: businessName,
      whatsapp_number: whatsappNumber,
      business_type: businessType,
      message: message,
    }));
  };

  const handleReset = () => {
    dispatch(resetLeadStatus());
    setClientName(''); setBusinessName(''); setWhatsappNumber('');
    setBusinessType(''); setMessage(''); setErrors({});
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="bg-[var(--color-light-0)] py-24 px-6 scroll-mt-20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-on-light)] mb-4">
            Let's Grow <span className="text-gradient">Your Brand</span>
          </h2>
          <p className="text-[var(--color-text-on-light-secondary)] text-base max-w-2xl mx-auto">
            Ready to skyrocket your brand value and build a premium website that drives direct, scalable growth? Send your details for a custom brand growth strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column — Persuasion */}
          <div className="lg:col-span-5 text-left">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-on-light)] mb-1">Fast WhatsApp Turnaround</h3>
                  <p className="text-xs text-[var(--color-text-on-light-muted)] leading-relaxed">I connect directly on WhatsApp within 2 hours. Let's discuss your business growth.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-on-light)] mb-1">Premium Brand Blueprint</h3>
                  <p className="text-xs text-[var(--color-text-on-light-muted)] leading-relaxed">Get a custom design roadmap. Build only when you feel it increases your brand value.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-on-light)] mb-1">1-on-1 Growth Strategy</h3>
                  <p className="text-xs text-[var(--color-text-on-light-muted)] leading-relaxed">Work directly with an experienced developer. No communication gaps, no outsourced code.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="lg:col-span-7">
            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <input type="text" name="website_url" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex="-1" autoComplete="off" />
            </div>

             {success ? (
              <div ref={successCardRef} className="glass-card-light rounded-2xl p-10 text-center">
                <div className="success-icon w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500">
                  <CheckCircle size={32} />
                </div>
                <h3 className="success-el text-xl font-display font-bold text-[var(--color-text-on-light)] mb-3">
                  Request Submitted!
                </h3>
                <p className="success-el text-sm text-[var(--color-text-on-light-secondary)] max-w-sm mx-auto mb-8 leading-relaxed">
                  Your inquiry has been recorded securely in Appwrite. I will reach out shortly.
                </p>
                <div className="success-el flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}?text=${encodeURIComponent(
                      `Hi Satyam,\n\nI just submitted an inquiry on your portfolio.\n` +
                      `*Name:* ${clientName}\n` +
                      `*Business:* ${businessName}\n` +
                      `*Category:* ${businessType || 'Not specified'}\n` +
                      `*Message:* ${message || 'No details provided.'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-green-500/20"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    Fast-Track via WhatsApp
                  </a>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border border-black/10 hover:bg-black/[0.04] text-[var(--color-text-on-light)] text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card-light rounded-2xl p-6 sm:p-8 space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600">
                      <strong>Submission failed:</strong> {error} — Please try again.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField id="client-name" label="Your Name" required placeholder="e.g. Satyam Pandey" value={clientName} onChange={(e) => setClientName(e.target.value)} error={errors.clientName} disabled={loading} />
                  <InputField id="business-name" label="Business Name" required placeholder="e.g. Grand Resort" value={businessName} onChange={(e) => setBusinessName(e.target.value)} error={errors.businessName} disabled={loading} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField id="whatsapp-number" label="WhatsApp Number" required type="tel" placeholder="e.g. +919876543210" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} error={errors.whatsappNumber} disabled={loading} />
                  <div className="text-left">
                    <label htmlFor="business-type" className="block text-xs font-semibold text-[var(--color-text-on-light-secondary)] uppercase tracking-wider mb-2">
                      Business Type
                    </label>
                    <select
                      id="business-type"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      disabled={loading}
                      className="w-full bg-white border border-black/10 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-200 p-3 rounded-xl text-sm text-[var(--color-text-on-light)] focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select industry...</option>
                      <option value="hotel">Hotel / Resort</option>
                      <option value="restaurant">Restaurant / F&B</option>
                      <option value="salon">Salon / Spa</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="other">Other Business</option>
                    </select>
                  </div>
                </div>

                <div className="text-left">
                  <label htmlFor="message" className="block text-xs font-semibold text-[var(--color-text-on-light-secondary)] uppercase tracking-wider mb-2">
                    Additional Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Describe your current web setup, brand goals, or growth pain points..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    maxLength={1000}
                    className="w-full bg-white border border-black/10 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-200 p-3 rounded-xl text-sm text-[var(--color-text-on-light)] placeholder-[var(--color-text-on-light-muted)] focus:outline-none transition-all h-28 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer ${
                    loading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white active:scale-95 shadow-lg shadow-orange-500/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Start Scaling My Brand
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

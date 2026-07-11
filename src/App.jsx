import { useState, useEffect, Component, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfile } from './store/slices/profileSlice.js';
import Navbar from './components/Navbar.jsx';
import Hero from './sections/Hero.jsx';
import Capabilities from './sections/Capabilities.jsx';
import Services from './sections/Services.jsx';
import Showcase from './sections/Showcase.jsx';
import Process from './sections/Process.jsx';
import Calculator from './sections/Calculator.jsx';
import Pricing from './sections/Pricing.jsx';
import FAQ from './sections/FAQ.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './components/Footer.jsx';

const Admin = lazy(() => import('./sections/Admin.jsx'));

/* ── Error Boundary ── */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-surface-0)] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              Something went wrong
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm mb-6">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:bg-[var(--color-accent-dark)] transition-colors cursor-pointer"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ── App Shell ── */
function App() {
  const dispatch = useDispatch();
  const [isAdminRoute, setIsAdminRoute] = useState(
    window.location.pathname === '/admin' || window.location.hash === '#/admin'
  );

  useEffect(() => {
    dispatch(fetchProfile());

    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname === '/admin' || window.location.hash === '#/admin');
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [dispatch]);

  if (isAdminRoute) {
    return (
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen bg-[var(--color-surface-0)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] rounded-full animate-spin" />
              <span className="text-xs text-[var(--color-text-secondary)] font-medium">Loading Admin Panel...</span>
            </div>
          </div>
        }>
          <Admin />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--color-surface-0)] text-[var(--color-text-primary)] flex flex-col font-body">
        <Navbar />

        {/* Section Rhythm: Dark → Light → Dark → Light → Dark → Light → Dark → Light → Dark */}
        <main id="main-content" className="flex-grow pt-20">
          {/* DARK — Aurora Mesh Hero */}
          <Hero />

          {/* LIGHT — Technical Capabilities */}
          <Capabilities />

          {/* LIGHT — Services Offered */}
          <Services />

          {/* DARK — Showcase Bento Grid */}
          <Showcase />

          {/* LIGHT — How I Work Process */}
          <Process />

          {/* DARK — Calculator with Dot Grid */}
          <Calculator />

          {/* LIGHT — Pricing & Packages */}
          <Pricing />

          {/* DARK — FAQ Accordion */}
          <FAQ />

          {/* LIGHT — Contact Form */}
          <Contact />
        </main>

        {/* DARK — Rich Footer */}
        <Footer />

        {/* Global Floating WhatsApp Button */}
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}?text=${encodeURIComponent("Hi, I'd like to discuss a project.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform shadow-green-500/30"
          aria-label="Chat on WhatsApp"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </ErrorBoundary>
  );
}

export default App;

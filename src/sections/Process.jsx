import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Map, Palette, Code, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    icon: <Map size={20} />,
    stepNum: '01',
    title: 'Strategy & Mapping',
    desc: 'We map out your business objectives, target audience demographics, and clear growth metrics. No guessing—just strategic planning.',
  },
  {
    icon: <Palette size={20} />,
    stepNum: '02',
    title: 'Visual Mockups',
    desc: 'You receive custom premium UI designs in Figma. We refine them based on your feedback. You sign off on the design before code begins.',
  },
  {
    icon: <Code size={20} />,
    stepNum: '03',
    title: 'Clean Engineering',
    desc: 'I convert the approved design into modern, high-performance React code. I integrate your database, Appwrite cloud systems, and WhatsApp hooks.',
  },
  {
    icon: <Rocket size={20} />,
    stepNum: '04',
    title: 'Optimization & Launch',
    desc: 'We test across devices (iPhone, Android, desktops), check loading speeds under Indian networks, check accessibility, and launch.',
  },
];

function Process() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set('.process-step', { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      '.process-step',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
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
      id="process"
      ref={containerRef}
      className="bg-[var(--color-light-1)] py-24 px-6 scroll-mt-20 border-t border-[var(--color-light-border)]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full">
            Our Roadmap
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-on-light)] mt-4 mb-4">
            How I Build <span className="text-gradient">Your Platform</span>
          </h2>
          <p className="text-[var(--color-text-on-light-secondary)] text-sm sm:text-base max-w-xl mx-auto">
            A transparent, milestone-driven development process with zero surprises. You stay in the loop at every stage.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-black/[0.04] z-0" />

          {STEPS.map((step, i) => (
            <div
              key={i}
              className="process-step glass-card-light rounded-2xl p-6 text-left relative z-10 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                {/* Step Top */}
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-display font-black text-black/5">
                    {step.stepNum}
                  </span>
                </div>

                {/* Step Content */}
                <h3 className="font-display text-md font-bold text-[var(--color-text-on-light)] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-on-light-secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;

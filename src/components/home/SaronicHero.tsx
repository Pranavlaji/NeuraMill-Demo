import { useEffect, useMemo, useRef, useState } from 'react';
import './SaronicHero.css';

type CapabilityTab = {
  id: string;
  label: string;
  description: string;
};

const capabilityTabs: CapabilityTab[] = [
  {
    id: 'launch',
    label: 'How it works',
    description: 'From CAD to shop floor in three simple steps',
  },
  {
    id: 'maneuver',
    label: 'Loro ipsum',
    description: 'Loro ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 'perceive',
    label: 'Loro ipsum',
    description: 'Loro ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 'communicate',
    label: 'Loro ipsum',
    description: 'Loro ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 'execute',
    label: 'Loro ipsum',
    description: 'Loro ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 'enable',
    label: 'Loro ipsum',
    description: 'Loro ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 'recover',
    label: 'Loro ipsum',
    description: 'Loro ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

export function SaronicHero() {
  const [activeCapability, setActiveCapability] = useState('launch');
  const heroRef = useRef<HTMLDivElement | null>(null);
  const capabilitiesRef = useRef<HTMLElement | null>(null);
  const activeTab = useMemo(
    () => capabilityTabs.find((tab) => tab.id === activeCapability) ?? capabilityTabs[0],
    [activeCapability]
  );

  useEffect(() => {
    const updateFade = () => {
      const hero = heroRef.current;
      const capabilities = capabilitiesRef.current;
      if (!hero || !capabilities) return;

      const rect = capabilities.getBoundingClientRect();
      const start = window.innerHeight * 0.92;
      const end = window.innerHeight * 0.16;
      const raw = (start - rect.top) / (start - end);
      const progress = Math.max(0, Math.min(1, raw));
      hero.style.setProperty('--hero-fade', progress.toFixed(3));
    };

    updateFade();
    window.addEventListener('scroll', updateFade, { passive: true });
    window.addEventListener('resize', updateFade);
    return () => {
      window.removeEventListener('scroll', updateFade);
      window.removeEventListener('resize', updateFade);
    };
  }, []);

  return (
    <div className="saronic-homepage">
      <div className="saronic-hero-sticky" ref={heroRef}>
        <header className="saronic-topbar" aria-label="Primary menu">
          <button className="saronic-menu" type="button">
            <span>MENU</span>
            <span className="saronic-hamburger" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </header>

        <div className="saronic-brandline" aria-label="Saronic logo">
          <h1>NEURAMILL</h1>
        </div>
      </div>

      <section className="saronic-hero">
        <article className="saronic-copy">
          <p className="saronic-kicker">REDEFINING MANUFACTURING</p>
          <p className="saronic-headline">AI-powered CAM that captures your machinists' tribal knowledge and makes it repeatable.</p>
          <div className="saronic-actions">
            <a className="action action-primary" href="#capabilities-section" aria-label="Capabilities">
              <span>Book a demo!</span>
            </a>
          </div>
        </article>
      </section>

      <section className="capabilities-section" id="capabilities-section" ref={capabilitiesRef}>
        <div className="capabilities-shell">
          <header className="capabilities-header">
            <h2>Capabilities</h2>
            <p className="capabilities-intro">
              <span aria-hidden="true" />
              From CAD to the machine in minutes, not days. AI-powered CAM that captures your machinists' tribal knowledge and makes it repeatable.
            </p>
          </header>

          <div className="capability-tabs-row">
            <div className="capability-tabs" role="tablist" aria-label="Capabilities">
              {capabilityTabs.map((tab) => (
                <button
                  aria-selected={tab.id === activeTab.id}
                  className={`capability-tab ${tab.id === activeTab.id ? 'is-active' : ''}`}
                  id={`tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveCapability(tab.id)}
                  role="tab"
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="capability-body" role="tabpanel" aria-labelledby={`tab-${activeTab.id}`}>
            <p>{activeTab.description}</p>
            <div className="capability-media" aria-hidden="true" />
          </div>
        </div>

        <section className="testimonial-section">
          <div className="testimonial-copy">
            <p>TESTIMONIAL</p>
            <h3>
              “Neuramill tackles key decision making processes for machining saving my machinists time and will power”
            </h3>
            <small>Barrett Ames</small>
          </div>
          <div className="testimonial-media" aria-hidden="true" />
        </section>

        <section className="spec-highlight-section">
          <div className="spec-highlight-overlay" aria-hidden="true" />
          <article className="spec-card">
            <p>Specifications</p>
            <h4>View our hardware and software specifications.</h4>
            <a href="#" aria-label="Specifications">
              <span>Book a demo!</span>
            </a>
          </article>
        </section>
      </section>
    </div>
  );
}

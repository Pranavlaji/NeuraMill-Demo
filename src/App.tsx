import { Hero } from './components/home/Hero';
import { SaronicHero } from './components/home/SaronicHero';
import { HazardStrip } from './components/layout/HazardStrip';
import { Navbar } from './components/layout/Navbar';
import { CncSequencePage } from './pages/CncSequencePage';
import { MachPage } from './pages/MachPage';

type ActiveRoute = {
  href: string;
  label: string;
  description: string;
};

const ACTIVE_ROUTES: ActiveRoute[] = [
  {
    href: '/originaldesign',
    label: 'OriginalDesign',
    description: 'Legacy NeuraMill baseline interface.',
  },
  {
    href: '/saronic-home',
    label: 'Saronic Home',
    description: 'Saronic-inspired hero experience.',
  },
  {
    href: '/mach-home',
    label: 'Mach Home',
    description: 'Industrial homepage variant with mission and newsroom.',
  },
  {
    href: '/cnc-questions',
    label: 'CNC Questions',
    description: 'Scroll-linked CNC walkthrough and timeline.',
  },
];

function LegacyPage() {
  return (
    <main className="legacy-page">
      <div className="app-frame">
        <Navbar />
        <HazardStrip className="aligned-strip" />
        <Hero />
      </div>
    </main>
  );
}

function SaronicHeroPage() {
  return (
    <main className="saronic-page">
      <SaronicHero />
    </main>
  );
}

function Home() {
  return (
    <main className="minimal-home">
      <section className="minimal-shell">
        <p className="minimal-brand">NeuraMill</p>
        <h1> Route Index</h1>

        <div className="minimal-route-list">
          {ACTIVE_ROUTES.map((route) => (
            <a className="minimal-route-card" href={route.href} key={route.href}>
              <div>
                <h2>{route.label}</h2>
                <p>{route.description}</p>
              </div>
              <span>{route.href}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function App() {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

  if (slug === 'originaldesign' || slug === 'original-design') {
    return <LegacyPage />;
  }
  if (slug === 'saronic-home' || slug === 'saronichome') {
    return <SaronicHeroPage />;
  }
  if (slug === 'mach-home' || slug === 'machhome' || slug === 'mach') {
    return <MachPage />;
  }
  if (slug === 'cnc-questions' || slug === 'cncquestions' || slug === 'mach-sequence') {
    return <CncSequencePage />;
  }

  if (!slug) {
    return <Home />;
  }

  return (
    <main className="minimal-home">
      <section className="minimal-shell">
        <p className="minimal-brand">NeuraMill</p>
        <h1>Route Not Found</h1>
        <p className="minimal-lead">Only four routes are active in this build.</p>
        <a className="minimal-back" href="/">
          Back to index
        </a>
      </section>
    </main>
  );
}

export default App;

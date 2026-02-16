import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './mach.css';

type NewsItem = {
  title: string;
  source: string;
  href: string;
};

const heroMedia = {
  videoSrc: '',
  posterSrc: '/mach/hero-poster.webp',
};

const newsItems: NewsItem[] = [
  {
    title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    source: 'lorem ipsum',
    href: '#',
  },
  {
    title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    source: 'lorem ipsum',
    href: '#',
  },
  {
    title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    source: 'lorem ipsum',
    href: '#',
  },
];

const missionText =
  'NeuraMill exists to make design to cut 10x faster. AI-powered CAM that captures your machinists\' tribal knowledge and makes it repeatable.';
const missionWords = missionText.split(' ');

function getWordOpacity(index: number, totalWords: number, progress: number) {
  const boostedProgress = Math.min(1, Math.max(0, progress * 1.18 + 0.02));
  const threshold = totalWords > 1 ? (index / (totalWords - 1)) * 0.84 : 0;
  const denom = Math.max(0.0001, 1 - threshold);
  const linear = Math.min(1, Math.max(0, (boostedProgress - threshold) / denom));
  const eased = linear * linear * (3 - 2 * linear);
  return 0.08 + eased * 0.92;
}

function MediaSurface({
  videoSrc,
  posterSrc,
  className,
  showFallbackPlay = true,
}: {
  videoSrc: string;
  posterSrc: string;
  className?: string;
  showFallbackPlay?: boolean;
}) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className={`mach-media-surface ${className ?? ''}`.trim()}>
      {!videoFailed && videoSrc ? (
        <video
          className="mach-media-video"
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          onError={() => setVideoFailed(true)}
          aria-label="Decorative background media"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div className={`mach-media-placeholder ${showFallbackPlay ? '' : 'mach-media-placeholder-plain'}`.trim()} aria-hidden="true">
          {showFallbackPlay ? <span /> : null}
        </div>
      )}
    </div>
  );
}

export function MachPage() {
  const missionSectionRef = useRef<HTMLElement | null>(null);
  const [missionProgress, setMissionProgress] = useState(0);

  useEffect(() => {
    const node = missionSectionRef.current;
    if (!node) return;

    const updateProgress = () => {
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const fadeStart = viewport * 0.98;
      const fadeEnd = viewport * 0.04;
      const rawProgress = (fadeStart - rect.top) / (fadeStart - fadeEnd);
      const clamped = Math.min(1, Math.max(0, rawProgress));
      setMissionProgress((prev) => (Math.abs(prev - clamped) > 0.01 ? clamped : prev));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <main className="mach-page">
      <header className="mach-nav" aria-label="NeuraMill navigation">
        <a className="mach-logo-text" href="/">
          <span>NEURAMILL</span>
        </a>

        <div className="mach-nav-actions">
          <a href="#" className="mach-demo-btn">
            Book a demo!
          </a>
          <div className="mach-menu-icon" aria-hidden="true">
            <span />
            <span />
          </div>
        </div>
      </header>

      <section className="mach-hero" aria-label="Hero">
        <MediaSurface
          videoSrc={heroMedia.videoSrc}
          posterSrc={heroMedia.posterSrc}
          className="mach-hero-media"
          showFallbackPlay={false}
        />
      </section>

      <section
        ref={missionSectionRef}
        className="mach-mission"
        aria-label="Mission statement"
        style={{ '--mission-progress': missionProgress } as CSSProperties}
      >
        <span className="mach-mission-line mach-mission-line-top" aria-hidden="true" />
        <span className="mach-mission-line mach-mission-line-bottom" aria-hidden="true" />
        <span className="mach-mission-line mach-mission-line-left" aria-hidden="true" />
        <span className="mach-mission-line mach-mission-line-right" aria-hidden="true" />
        <p className="mach-mission-label">MISSION</p>
        <div className="mach-mission-content">
          <p>
            {missionWords.map((word, index) => (
              <span key={`${word}-${index}`} style={{ opacity: getWordOpacity(index, missionWords.length, missionProgress) }}>
                {word}
                {index < missionWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          <a href="#" className="mach-outline-btn">
            <span>Read Thesis</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3 8h9M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </section>

      <section className="mach-newsroom" aria-label="Newsroom">
        <h2>NEWSROOM</h2>
        <div className="mach-news-grid">
          {newsItems.map((item) => (
            <a className="mach-news-card" key={item.title} href={item.href} target="_blank" rel="noreferrer">
              <div className="mach-news-media-placeholder" aria-hidden="true" />
              <p>{item.title}</p>
              <span>{item.source}</span>
            </a>
          ))}
        </div>
        <a href="#" className="mach-outline-btn">
          <span>See All Articles</span>
        </a>
      </section>

      <section className="mach-wordmark-footer" aria-label="NeuraMill wordmark">
        <h2>NEURAMILL</h2>
      </section>
    </main>
  );
}

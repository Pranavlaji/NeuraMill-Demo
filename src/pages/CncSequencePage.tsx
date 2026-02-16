import { useEffect, useMemo, useRef, useState } from 'react';
import { CNC_FRAMES, resolveStage, SEQUENCE_STAGES } from './machSequence';
import { useCncSequence } from './useCncSequence';
import './cnc-sequence.css';

function useSequenceEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const viewportQuery = window.matchMedia('(max-width: 900px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateEnabled = () => {
      setEnabled(!viewportQuery.matches && !motionQuery.matches);
    };

    updateEnabled();

    viewportQuery.addEventListener('change', updateEnabled);
    motionQuery.addEventListener('change', updateEnabled);

    return () => {
      viewportQuery.removeEventListener('change', updateEnabled);
      motionQuery.removeEventListener('change', updateEnabled);
    };
  }, []);

  return enabled;
}

export function CncSequencePage() {
  const sequenceSectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sequenceEnabled = useSequenceEnabled();

  const { ready, stageId, loadingPercent, failed } = useCncSequence({
    sectionRef: sequenceSectionRef,
    canvasRef,
    frames: CNC_FRAMES,
    enabled: sequenceEnabled,
  });

  const activeStage = useMemo(
    () => SEQUENCE_STAGES.find((stage) => stage.id === stageId) ?? resolveStage(0),
    [stageId],
  );

  const showSequence = sequenceEnabled && !failed;
  const timelineItems = useMemo(
    () => [
      {
        id: 'ready',
        title: 'Loro ipsum',
        date: 'Step 01',
        summary: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      },
      {
        id: 'lock',
        title: 'Loro ipsum',
        date: 'Step 02',
        summary: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      },
      {
        id: 'rough',
        title: 'Loro ipsum',
        date: 'Step 03',
        summary: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      },
      {
        id: 'precision',
        title: 'Loro ipsum',
        date: 'Step 04',
        summary: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      },
      {
        id: 'integration',
        title: 'Loro ipsum',
        date: 'Step 05',
        summary: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      },
      {
        id: 'deploy',
        title: 'Loro ipsum',
        date: 'Step 06',
        summary: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      },
    ],
    [],
  );

  return (
    <main className="cnc-page">
      <header className="cnc-nav" aria-label="CNC sequence navigation">
        <a className="cnc-brand" href="/">
          Neuramill
        </a>
        <nav className="cnc-nav-links" aria-label="Primary">
          <a href="/">How it works</a>
          <a href="/cnc-questions">Contact</a>
          <a href="/cnc-questions">Join Us</a>
          <a className="cnc-demo-btn" href="/cnc-questions">
            Book a demo!
          </a>
        </nav>
      </header>

      <section className="cnc-scroll-section" ref={sequenceSectionRef} aria-label="Scroll-linked CNC sequence">
        <div className="cnc-sticky-shell">
          <div className="cnc-copy-pane">
            <p className="cnc-intro">
              Neuramill is a techonology first manufacturing company, that makes design to cut 10x faster. <br /> AI-powered CAM that captures your machinists' tribal knowledge and makes it repeatable.
            </p>

            <div className="cnc-timeline" aria-label="Operation timeline">
              {timelineItems.map((item) => {
                const isActive = item.id === activeStage.id;
                return (
                  <div className={`cnc-timeline-item ${isActive ? 'active' : ''}`} key={item.id}>
                    <span className="cnc-timeline-dot" aria-hidden="true" />

                    <article className="cnc-timeline-card">
                      <div className="cnc-timeline-row">
                        <p>{item.title}</p>
                        <span>{item.date}</span>
                      </div>
                      <small>{item.summary}</small>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cnc-visual-pane">
            <div className="cnc-canvas-shell">
              <img
                className={`cnc-poster ${showSequence && ready ? 'hidden' : ''}`}
                src="/ezgif-frame-001.jpg"
                alt="CNC machine poster frame"
              />

              {showSequence && (
                <canvas
                  ref={canvasRef}
                  className={`cnc-canvas ${ready ? 'visible' : ''}`}
                  aria-label="Scroll-linked CNC machine sequence"
                />
              )}

              {showSequence && !ready && (
                <div className="cnc-loading-state" aria-live="polite">
                  <span className="cnc-spinner" />
                  <p>Loading sequence {loadingPercent}%</p>
                </div>
              )}

              {!showSequence && (
                <div className="cnc-fallback-note">
                  Sequence playback is disabled on mobile or reduced-motion settings.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

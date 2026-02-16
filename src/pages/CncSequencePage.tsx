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
        title: 'Raw Material Intake',
        date: 'Step 01',
        summary: 'Billet is staged and the cell sits in a ready baseline.',
      },
      {
        id: 'lock',
        title: 'Datum Lock and Setup',
        date: 'Step 02',
        summary: 'Workholding secures the stock and verifies fixture alignment.',
      },
      {
        id: 'rough',
        title: 'Rough Machining Pass',
        date: 'Step 03',
        summary: 'Primary cuts establish macro geometry for the part envelope.',
      },
      {
        id: 'precision',
        title: 'Precision Toolpath',
        date: 'Step 04',
        summary: 'Finishing paths tighten tolerances and final edge definition.',
      },
      {
        id: 'integration',
        title: 'Calibration Sweep',
        date: 'Step 05',
        summary: 'System checks alignment repeatability and process confidence.',
      },
      {
        id: 'deploy',
        title: 'Validation and Deployment',
        date: 'Step 06',
        summary: 'Output is verified and the machine returns production-ready.',
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
              Neuramill brings AI into the physical manufacturing loop. As you scroll, the machine sequence advances
              and each operating step is highlighted in the process timeline.
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

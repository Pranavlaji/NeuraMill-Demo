export type SequenceFrame = {
  index: number;
  src: string;
};

export type SequenceStage = {
  id: string;
  label: string;
  start: number;
  end: number;
  title: string;
  body: string;
};

const TARGET_FRAME_COUNT = 72;

const MISSING_FRAME_NUMBERS = new Set([17]);

const FRAME_NUMBERS = Array.from({ length: 108 }, (_, index) => index + 1).filter(
  (frameNumber) => !MISSING_FRAME_NUMBERS.has(frameNumber),
);

const ALL_CNC_FRAMES: SequenceFrame[] = FRAME_NUMBERS.map((frameNumber, index) => ({
  index,
  src: `/ezgif-frame-${String(frameNumber).padStart(3, '0')}.jpg`,
}));

function sampleFrames(frames: SequenceFrame[], targetCount: number): SequenceFrame[] {
  if (targetCount >= frames.length) {
    return frames;
  }

  const sampled: SequenceFrame[] = [];
  for (let i = 0; i < targetCount; i += 1) {
    const sourceIndex = Math.round((i / (targetCount - 1)) * (frames.length - 1));
    sampled.push(frames[sourceIndex]);
  }
  return sampled;
}

export const CNC_FRAMES: SequenceFrame[] = sampleFrames(ALL_CNC_FRAMES, TARGET_FRAME_COUNT);

export const SEQUENCE_STAGES: SequenceStage[] = [
  {
    id: 'ready',
    label: '01',
    start: 0,
    end: 0.16,
    title: 'Ready Baseline',
    body: 'Machine is in a stable idle posture: spindle parked, fixture open, and raw material aligned for the cycle start.',
  },
  {
    id: 'lock',
    label: '02',
    start: 0.16,
    end: 0.3,
    title: 'Datum Lock',
    body: 'Workholding secures the billet against the fixture datum and confirms positional integrity before cutting begins.',
  },
  {
    id: 'rough',
    label: '03',
    start: 0.3,
    end: 0.48,
    title: 'Rough Pass',
    body: 'Primary toolpaths remove bulk stock to establish macro geometry and prepare the part envelope for precision finishing.',
  },
  {
    id: 'precision',
    label: '04',
    start: 0.48,
    end: 0.66,
    title: 'Precision Pass',
    body: 'Fine-path operations tighten tolerances, establish edge definition, and resolve final surface-critical geometry.',
  },
  {
    id: 'integration',
    label: '05',
    start: 0.66,
    end: 0.84,
    title: 'Integration + Calibration',
    body: 'The cell performs alignment checks and calibration sweeps to verify fit, repeatability, and process confidence.',
  },
  {
    id: 'deploy',
    label: '06',
    start: 0.84,
    end: 1,
    title: 'Validation to Deployment',
    body: 'Final verification closes the loop: validated output, stable status, and production-ready machine state.',
  },
];

export function resolveStage(progress: number): SequenceStage {
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    SEQUENCE_STAGES.find((stage) => clamped >= stage.start && clamped <= stage.end) ??
    SEQUENCE_STAGES[SEQUENCE_STAGES.length - 1]
  );
}

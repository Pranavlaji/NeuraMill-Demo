import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import type { RefObject } from 'react';
import { resolveStage } from './machSequence';
import type { SequenceFrame } from './machSequence';

const DESKTOP_SMOOTHING = 0.1;
const MAX_LOAD_RETRIES = 2;
const MAX_CONCURRENT_LOADS = 6;
const READY_FRAME_THRESHOLD = 8;
const JUMP_START_PROGRESS = 0.28;
const JUMP_BLEND_SPAN = 0.14;
const JUMP_SEGMENTS = 44;
const JUMP_HOLD_RATIO = 0.74;
const INITIAL_STAGE_ID = resolveStage(0).id;

type UseCncSequenceArgs = {
  sectionRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  frames: SequenceFrame[];
  enabled: boolean;
};

export type UseCncSequenceResult = {
  ready: boolean;
  progress: number;
  stageId: string;
  frameIndex: number;
  loadingPercent: number;
  failed: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothStep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function findNearestLoadedFrame(images: (HTMLImageElement | null)[], target: number) {
  if (images[target]) {
    return target;
  }

  const maxDistance = images.length - 1;
  for (let distance = 1; distance <= maxDistance; distance += 1) {
    const left = target - distance;
    const right = target + distance;

    if (left >= 0 && images[left]) {
      return left;
    }
    if (right < images.length && images[right]) {
      return right;
    }
  }

  return -1;
}

function mapProgressToJumpedFrame(progress: number, totalFrames: number) {
  if (totalFrames <= 1) {
    return 0;
  }

  const clampedProgress = clamp(progress, 0, 1);
  const linearFrame = clampedProgress * (totalFrames - 1);

  const normalized = clamp((clampedProgress - JUMP_START_PROGRESS) / (1 - JUMP_START_PROGRESS), 0, 1);
  const segmentSize = 1 / JUMP_SEGMENTS;
  const segment = Math.min(JUMP_SEGMENTS - 1, Math.floor(normalized / segmentSize));
  const segmentProgress = (normalized - segment * segmentSize) / segmentSize;

  const fromFrame = (segment / JUMP_SEGMENTS) * (totalFrames - 1);
  const toFrame = ((segment + 1) / JUMP_SEGMENTS) * (totalFrames - 1);

  // Hold most of the segment, then move quickly near the end for a deliberate "jump" feel.
  if (segmentProgress < JUMP_HOLD_RATIO) {
    const jumpBlend = smoothStep(JUMP_START_PROGRESS, JUMP_START_PROGRESS + JUMP_BLEND_SPAN, clampedProgress);
    return lerp(linearFrame, fromFrame, jumpBlend);
  }

  const burst = (segmentProgress - JUMP_HOLD_RATIO) / (1 - JUMP_HOLD_RATIO);
  const jumpedFrame = fromFrame + (toFrame - fromFrame) * burst;
  const jumpBlend = smoothStep(JUMP_START_PROGRESS, JUMP_START_PROGRESS + JUMP_BLEND_SPAN, clampedProgress);
  return lerp(linearFrame, jumpedFrame, jumpBlend);
}

function drawContainImage(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const cssWidth = Math.max(1, canvas.clientWidth);
  const cssHeight = Math.max(1, canvas.clientHeight);
  const pixelRatio = window.devicePixelRatio || 1;

  const nextWidth = Math.floor(cssWidth * pixelRatio);
  const nextHeight = Math.floor(cssHeight * pixelRatio);

  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, cssWidth, cssHeight);

  const scale = Math.min(cssWidth / image.naturalWidth, cssHeight / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const offsetX = (cssWidth - drawWidth) * 0.5;
  const offsetY = (cssHeight - drawHeight) * 0.5;

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

export function useCncSequence({ sectionRef, canvasRef, frames, enabled }: UseCncSequenceArgs): UseCncSequenceResult {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const currentFrameRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const targetFrameRef = useRef(0);
  const progressRef = useRef(0);
  const stageRef = useRef(INITIAL_STAGE_ID);
  const reportedProgressRef = useRef(0);
  const reportedFrameRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageId, setStageId] = useState(INITIAL_STAGE_ID);

  useMotionValueEvent(scrollYProgress, 'change', (next) => {
    if (!enabled) {
      return;
    }

    const clamped = clamp(next, 0, 1);
    progressRef.current = clamped;
    targetFrameRef.current = mapProgressToJumpedFrame(clamped, frames.length);

    if (Math.abs(clamped - reportedProgressRef.current) >= 0.004) {
      reportedProgressRef.current = clamped;
      setProgress(clamped);
    }

    const nextStage = resolveStage(clamped).id;
    if (nextStage !== stageRef.current) {
      stageRef.current = nextStage;
      setStageId(nextStage);
    }
  });

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      setFailed(false);
      setLoadingPercent(0);
      setFrameIndex(0);
      setProgress(0);
      stageRef.current = INITIAL_STAGE_ID;
      setStageId(stageRef.current);
      currentFrameRef.current = 0;
      targetFrameRef.current = 0;
      renderedFrameRef.current = -1;
      imagesRef.current = [];
      return;
    }

    let cancelled = false;
    let loadedCount = 0;
    let hasFailed = false;
    let inFlight = 0;
    let cursor = 0;
    let firstFrameLoaded = false;
    let readyEmitted = false;

    setReady(false);
    setFailed(false);
    setLoadingPercent(0);

    const loadedImages: (HTMLImageElement | null)[] = new Array(frames.length).fill(null);
    imagesRef.current = loadedImages;
    const readyTarget = Math.min(READY_FRAME_THRESHOLD, frames.length);
    const loadOrder = Array.from({ length: frames.length }, (_, index) => index);

    const markReadyIfPossible = () => {
      if (readyEmitted || !firstFrameLoaded || loadedCount < readyTarget) {
        return;
      }

      readyEmitted = true;
      setReady(true);
      setFrameIndex(0);
      renderedFrameRef.current = -1;
      const firstCanvas = canvasRef.current;
      const firstImage = loadedImages[0];
      if (firstCanvas && firstImage) {
        drawContainImage(firstCanvas, firstImage);
        renderedFrameRef.current = 0;
      }
    };

    const launchNextBatch = () => {
      while (!cancelled && !hasFailed && inFlight < MAX_CONCURRENT_LOADS && cursor < loadOrder.length) {
        const nextFrameIndex = loadOrder[cursor];
        cursor += 1;
        inFlight += 1;
        loadFrame(nextFrameIndex, 0);
      }
    };

    const loadFrame = (frameIndexToLoad: number, attempt: number) => {
      const frame = frames[frameIndexToLoad];
      const image = new Image();
      image.decoding = 'async';

      image.onload = async () => {
        if (cancelled || hasFailed) {
          inFlight -= 1;
          return;
        }

        if (typeof image.decode === 'function') {
          try {
            await image.decode();
          } catch {
            // No-op: draw is still safe after onload for most browsers.
          }
        }

        loadedImages[frameIndexToLoad] = image;
        loadedCount += 1;
        setLoadingPercent(Math.round((loadedCount / frames.length) * 100));
        firstFrameLoaded = firstFrameLoaded || frameIndexToLoad === 0;
        markReadyIfPossible();

        inFlight -= 1;
        if (loadedCount === frames.length && !readyEmitted && firstFrameLoaded) {
          markReadyIfPossible();
          if (!readyEmitted) {
            setReady(true);
          }
        }
        launchNextBatch();
      };

      image.onerror = () => {
        if (cancelled) {
          inFlight -= 1;
          return;
        }

        if (attempt < MAX_LOAD_RETRIES) {
          inFlight -= 1;
          window.setTimeout(() => {
            if (cancelled || hasFailed) {
              return;
            }
            inFlight += 1;
            loadFrame(frameIndexToLoad, attempt + 1);
          }, 120 * (attempt + 1));
          return;
        }

        hasFailed = true;
        setFailed(true);
        setReady(false);
        inFlight -= 1;
      };

      image.src = frame.src;
    };

    launchNextBatch();

    return () => {
      cancelled = true;
    };
  }, [enabled, frames, canvasRef]);

  useEffect(() => {
    if (!enabled || !ready || failed) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = () => {
      currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * DESKTOP_SMOOTHING;

      if (Math.abs(targetFrameRef.current - currentFrameRef.current) < 0.02) {
        currentFrameRef.current = targetFrameRef.current;
      }

      const canvas = canvasRef.current;
      const roundedFrame = clamp(Math.round(currentFrameRef.current), 0, frames.length - 1);
      const resolvedFrame = findNearestLoadedFrame(imagesRef.current, roundedFrame);

      if (resolvedFrame !== -1 && resolvedFrame !== reportedFrameRef.current) {
        reportedFrameRef.current = resolvedFrame;
        setFrameIndex(resolvedFrame);
      }

      const image = resolvedFrame !== -1 ? imagesRef.current[resolvedFrame] : null;
      if (canvas && image && resolvedFrame !== renderedFrameRef.current) {
        drawContainImage(canvas, image);
        renderedFrameRef.current = resolvedFrame;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enabled, ready, failed, frames.length, canvasRef]);

  useEffect(() => {
    const onResize = () => {
      if (!ready) {
        return;
      }
      const canvas = canvasRef.current;
      const image = imagesRef.current[frameIndex];
      if (canvas && image) {
        drawContainImage(canvas, image);
      }
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [canvasRef, ready, frameIndex]);

  return {
    ready,
    progress,
    stageId,
    frameIndex,
    loadingPercent,
    failed,
  };
}

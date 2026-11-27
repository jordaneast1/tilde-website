import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const WORDS = ["IMMERSIVE ARTS", "MUSIC", "VIRTUAL PRODUCTION"];

// How long a word stays fully resolved before scrambling to the next (ms)
const HOLD_MS = 2600;
// Max frames a character waits before it starts scrambling / takes to resolve
const MAX_START_FRAMES = 12;
const MAX_SCRAMBLE_FRAMES = 22;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\_~";

type Glyph = { char: string; scrambling: boolean };

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const toGlyphs = (text: string): Glyph[] =>
  text.split("").map((char) => ({ char, scrambling: false }));

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6vw;
  pointer-events: none;
  z-index: 1;
`;

const Title = styled.h1`
  margin: 0;
  max-width: 1200px;
  color: white;
  font-family: "Roboto Mono", monospace;
  font-weight: 400;
  font-size: clamp(11px, 2.1vw, 32px);
  line-height: 1.25;
  letter-spacing: 0.02em;
  text-align: center;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.45);
  opacity: 0;
  /* wait for the canvas loading screen to fade before appearing */
  animation: ${fadeIn} 1s ease 2s forwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

const Cycling = styled.strong`
  font-weight: 700;
  white-space: pre-wrap;
`;

const ScrambleChar = styled.span`
  opacity: 0.55;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const HeroTitle = () => {
  const [glyphs, setGlyphs] = useState<Glyph[]>(() => toGlyphs(WORDS[0]));
  const frameRef = useRef<number>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let index = 0;

    const scrambleTo = (from: string, to: string, onDone: () => void) => {
      const length = Math.max(from.length, to.length);
      const queue = Array.from({ length }, (_, i) => {
        const start = Math.floor(Math.random() * MAX_START_FRAMES);
        return {
          from: from[i] ?? "",
          to: to[i] ?? "",
          start,
          end: start + Math.floor(Math.random() * MAX_SCRAMBLE_FRAMES) + 4,
          glyph: randomGlyph(),
        };
      });

      let frame = 0;
      const tick = () => {
        let complete = 0;
        const next: Glyph[] = queue.map((q) => {
          if (frame >= q.end) {
            complete++;
            return { char: q.to, scrambling: false };
          }
          if (frame >= q.start) {
            // keep word gaps readable while scrambling
            if (q.to === " " && (q.from === " " || q.from === "")) {
              return { char: " ", scrambling: false };
            }
            if (Math.random() < 0.3) q.glyph = randomGlyph();
            return { char: q.glyph, scrambling: true };
          }
          return { char: q.from, scrambling: false };
        });

        setGlyphs(next);

        if (complete === queue.length) {
          onDone();
        } else {
          frame++;
          frameRef.current = requestAnimationFrame(tick);
        }
      };
      tick();
    };

    const cycle = () => {
      timeoutRef.current = setTimeout(() => {
        const from = WORDS[index];
        index = (index + 1) % WORDS.length;
        const to = WORDS[index];

        if (reduceMotion) {
          setGlyphs(toGlyphs(to));
          cycle();
        } else {
          scrambleTo(from, to, cycle);
        }
      }, HOLD_MS);
    };

    // first scramble starts after the title has faded in
    timeoutRef.current = setTimeout(cycle, reduceMotion ? 0 : 1500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <Wrapper>
      <Title>
        <VisuallyHidden>
          We create for immersive arts, music and virtual production in
          real-time.
        </VisuallyHidden>
        <span aria-hidden="true">
          WE CREATE FOR{" "}
          <Cycling>
            {glyphs.map((g, i) =>
              g.scrambling ? (
                <ScrambleChar key={i}>{g.char}</ScrambleChar>
              ) : (
                <React.Fragment key={i}>{g.char}</React.Fragment>
              )
            )}
          </Cycling>{" "}
        ... IN REAL-TIME.
        </span>
      </Title>
    </Wrapper>
  );
};

export default HeroTitle;

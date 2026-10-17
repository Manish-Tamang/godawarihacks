"use client";

import { useEffect, useRef } from "react";

const CELL = 7;
const SQUARE = 176;
const EDGE = 36;

const GLYPHS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";

function hash(col: number, row: number, tick: number) {
  const n = Math.sin(col * 127.1 + row * 311.7 + tick * 17.13) * 43758.5453;
  return n - Math.floor(n);
}

export function HeroEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouse = { x: -9999, y: -9999, inside: false };
    let fade = 0;
    let raf = 0;
    let running = true;
    let tick = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };

    const draw = () => {
      if (!running) return;
      const rect = parent.getBoundingClientRect();
      const dpr = canvas.width / Math.max(rect.width, 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const target = mouse.inside ? 1 : 0;
      fade += (target - fade) * 0.2;
      tick += 0.08;

      if (fade > 0.01) {
        const half = SQUARE / 2;
        const minCol = Math.max(0, Math.floor((mouse.x - half) / CELL));
        const maxCol = Math.min(
          Math.ceil(rect.width / CELL) - 1,
          Math.floor((mouse.x + half) / CELL),
        );
        const minRow = Math.max(0, Math.floor((mouse.y - half) / CELL));
        const maxRow = Math.min(
          Math.ceil(rect.height / CELL) - 1,
          Math.floor((mouse.y + half) / CELL),
        );

        ctx.font = `${CELL - 1}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let col = minCol; col <= maxCol; col++) {
          for (let row = minRow; row <= maxRow; row++) {
            const x = col * CELL + CELL / 2;
            const y = row * CELL + CELL / 2;
            const inset = Math.min(half - Math.abs(x - mouse.x), half - Math.abs(y - mouse.y));
            if (inset <= 0) continue;

            const edge = Math.min(1, inset / EDGE);
            const soft = edge * edge * (3 - 2 * edge);
            const flicker = hash(col, row, Math.floor(tick * 2)) > 0.22 ? 1 : 0.28;
            const alpha = soft * flicker * fade;
            if (alpha < 0.05) continue;

            const glyph =
              GLYPHS[Math.floor(hash(col, row, Math.floor(tick / 3)) * GLYPHS.length)];
            ctx.fillStyle = `rgba(8, 71, 80, ${Math.min(0.95, alpha)})`;
            ctx.fillText(glyph, x, y);
          }
        }
      }

      if (mouse.inside || fade > 0.01) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
      }
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = x;
      mouse.y = y;
      mouse.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      start();
    };

    const onLeave = () => {
      mouse.inside = false;
      start();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full md:block [mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_100%)]"
    />
  );
}

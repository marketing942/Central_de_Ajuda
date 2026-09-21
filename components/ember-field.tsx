"use client";

import { useEffect, useRef } from "react";

// Brasas subindo no fundo da página, no mesmo clima do banner. Canvas fixo
// atrás do conteúdo, sem eventos de mouse. Não roda para quem pede menos
// movimento no sistema e pausa com a aba em segundo plano.

type Ember = {
  x: number;
  y: number;
  size: number;
  rise: number; // px/s
  swayAmp: number;
  swayFreq: number;
  phase: number;
  life: number; // s
  age: number;
  flicker: number;
  sprite: number; // índice em sprites
};

const MAX_EMBERS = 70;
const AREA_PER_EMBER = 22_000; // px² por brasa: telas menores recebem menos

function makeSprite(hue: number) {
  const size = 32;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const ctx = sprite.getContext("2d")!;
  const glow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  glow.addColorStop(0, `hsla(${hue}, 100%, 88%, 1)`);
  glow.addColorStop(0.18, `hsla(${hue}, 95%, 62%, .9)`);
  glow.addColorStop(0.45, `hsla(${hue - 8}, 90%, 45%, .28)`);
  glow.addColorStop(1, `hsla(${hue - 12}, 90%, 35%, 0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

export function EmberField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sprites = [28, 36, 44].map(makeSprite);
    let embers: Ember[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;

    const spawn = (anywhere: boolean): Ember => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 10 + Math.random() * 40,
      size: 4 + Math.random() * 8,
      rise: 14 + Math.random() * 38,
      swayAmp: 6 + Math.random() * 22,
      swayFreq: 0.3 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      life: 7 + Math.random() * 10,
      age: anywhere ? Math.random() * 6 : 0,
      flicker: 2 + Math.random() * 5,
      sprite: Math.floor(Math.random() * sprites.length),
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(MAX_EMBERS, Math.round((width * height) / AREA_PER_EMBER));
      embers = embers.slice(0, target);
      while (embers.length < target) embers.push(spawn(true));
    };

    const draw = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.age += dt;
        e.y -= e.rise * dt;
        if (e.age > e.life || e.y < -20) {
          embers[i] = spawn(false);
          continue;
        }
        const t = e.age / e.life;
        // Acende rápido, apaga devagar, com leve tremulação.
        const fade = Math.min(t / 0.12, 1) * (1 - t) ** 1.4;
        const alpha = fade * (0.55 + 0.45 * Math.sin(e.age * e.flicker + e.phase) ** 2);
        const x = e.x + Math.sin(e.age * e.swayFreq + e.phase) * e.swayAmp;
        const size = e.size * (1 - t * 0.5);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[e.sprite], x - size, e.y - size, size * 2, size * 2);
      }

      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (frame || motion.matches || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const sync = () => {
      if (motion.matches || document.hidden) {
        stop();
        if (motion.matches) ctx.clearRect(0, 0, width, height);
      } else start();
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  return <canvas ref={canvasRef} className="ember-field" aria-hidden />;
}

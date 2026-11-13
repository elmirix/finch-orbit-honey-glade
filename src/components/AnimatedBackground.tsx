
import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!ctx) return;

    const TAU = Math.PI * 2;
    const COLORS = [
      "rgba(255, 235, 205, 0.9)",
      "rgba(255, 160, 75, 0.85)",
      "rgba(255, 100, 40, 0.75)",
      "rgba(65, 225, 215, 0.75)",
      "rgba(145, 245, 235, 0.7)",
    ];

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // PERFORMANCE SETTINGS
    const FPS = reducedMotion ? 20 : 30;
    const FRAME_TIME = 1000 / FPS;
    const MAX_DPR = 1.5;
    const GRID_SIZE = 46;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;

    let holeX = width / 2;
    let holeY = height / 2;
    let targetX = holeX;
    let targetY = holeY;

    let horizon = 58;
    let maxRadius = 1000;

    let particles: Particle[] = [];
    let stars: Star[] = [];

    let animationId = 0;
    let lastFrame = 0;

    // Static grid rendered only on resize
    const gridCanvas = document.createElement("canvas");
    const gridCtx = gridCanvas.getContext("2d");

    if (!gridCtx) return;

    type Star = {
      x: number;
      y: number;
      size: number;
      alpha: number;
      phase: number;
      speed: number;
    };

    class Particle {
      angle: number;
      radius: number;
      speed: number;
      fallSpeed: number;
      size: number;
      color: number;
      x: number;
      y: number;
      oldX: number;
      oldY: number;

      constructor() {
        this.angle = Math.random() * TAU;
        this.radius =
          horizon + 12 + Math.random() * (maxRadius - horizon);

        this.speed = 0.002 + Math.random() * 0.006;
        this.fallSpeed = 0.12 + Math.random() * 0.22;
        this.size = 0.5 + Math.random() * 1.25;
        this.color = Math.floor(Math.random() * COLORS.length);

        this.x = 0;
        this.y = 0;
        this.oldX = 0;
        this.oldY = 0;

        this.position();

        this.oldX = this.x;
        this.oldY = this.y;
      }

      position() {
        const angle = this.angle;
        const r = this.radius;

        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r * 0.3;

        const tilt = -0.12;
        const cos = Math.cos(tilt);
        const sin = Math.sin(tilt);

        this.x = holeX + px * cos - py * sin;
        this.y = holeY + px * sin + py * cos;
      }

      update(delta: number) {
        this.oldX = this.x;
        this.oldY = this.y;

        this.angle +=
          (this.speed +
            0.014 * Math.pow(
              horizon / Math.max(this.radius, horizon),
              0.7
            )) * delta;

        this.radius -= this.fallSpeed * delta;

        if (this.radius < horizon + 8) {
          this.radius = maxRadius * (0.8 + Math.random() * 0.2);
          this.angle = Math.random() * TAU;
          this.position();
          this.oldX = this.x;
          this.oldY = this.y;
          return;
        }

        this.position();
      }
    }

    // ------------------------------------------------
    // RESIZE
    // ------------------------------------------------

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      horizon = Math.min(
        65,
        Math.max(42, Math.min(width, height) * 0.065)
      );

      maxRadius = Math.hypot(width, height) * 1.05;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = "#050811";
      ctx.fillRect(0, 0, width, height);

      // Build static grid
      gridCanvas.width = canvas.width;
      gridCanvas.height = canvas.height;

      gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gridCtx.clearRect(0, 0, width, height);

      for (let x = 0; x <= width; x += GRID_SIZE) {
        const major = Math.round(x / GRID_SIZE) % 4 === 0;

        gridCtx.strokeStyle = major
          ? "rgba(65, 205, 210, 0.075)"
          : "rgba(65, 190, 205, 0.035)";

        gridCtx.lineWidth = major ? 1 : 0.65;

        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, height);
        gridCtx.stroke();
      }

      for (let y = 0; y <= height; y += GRID_SIZE) {
        const major = Math.round(y / GRID_SIZE) % 4 === 0;

        gridCtx.strokeStyle = major
          ? "rgba(65, 205, 210, 0.075)"
          : "rgba(65, 190, 205, 0.035)";

        gridCtx.lineWidth = major ? 1 : 0.65;

        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(width, y);
        gridCtx.stroke();
      }

      // Small grid intersections
      gridCtx.fillStyle = "rgba(95, 220, 225, 0.13)";

      for (let x = 0; x <= width; x += GRID_SIZE * 4) {
        for (let y = 0; y <= height; y += GRID_SIZE * 4) {
          gridCtx.fillRect(x - 1, y - 1, 2, 2);
        }
      }

      // Particles
      const count = reducedMotion
        ? 100
        : Math.min(
            300,
            Math.max(130, Math.floor((width * height) / 5500))
          );

      particles = Array.from(
        { length: count },
        () => new Particle()
      );

      // Stars
      const starCount = Math.min(
        100,
        Math.max(45, Math.floor((width * height) / 18000))
      );

      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.1 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        phase: Math.random() * TAU,
        speed: 0.001 + Math.random() * 0.003,
      }));

      holeX = Math.min(width, Math.max(0, holeX));
      holeY = Math.min(height, Math.max(0, holeY));
    };

    // ------------------------------------------------
    // GRID
    // ------------------------------------------------

    const drawGrid = () => {
      ctx.drawImage(gridCanvas, 0, 0, width, height);
    };

    // ------------------------------------------------
    // STARS
    // ------------------------------------------------

    const drawStars = (time: number) => {
      ctx.fillStyle = "#BCDDEB";

      for (const star of stars) {
        ctx.globalAlpha =
          star.alpha *
          (0.7 + Math.sin(time * star.speed + star.phase) * 0.3);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, TAU);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    // ------------------------------------------------
    // SOFT NEBULA / BLUR
    // ------------------------------------------------

    const drawNebula = () => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      // Large blurred glow
      const outerGlow = ctx.createRadialGradient(
        holeX, holeY, horizon,
        holeX, holeY, Math.min(maxRadius * 0.6, 650)
      );

      outerGlow.addColorStop(0, "rgba(255, 105, 35, 0.12)");
      outerGlow.addColorStop(0.12, "rgba(255, 150, 65, 0.08)");
      outerGlow.addColorStop(0.35, "rgba(45, 210, 205, 0.045)");
      outerGlow.addColorStop(0.65, "rgba(30, 100, 170, 0.02)");
      outerGlow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, width, height);

      // Inner orange glow
      const innerGlow = ctx.createRadialGradient(
        holeX, holeY, horizon * 0.9,
        holeX, holeY, horizon * 3.5
      );

      innerGlow.addColorStop(0, "rgba(255, 180, 100, 0.23)");
      innerGlow.addColorStop(0.35, "rgba(255, 115, 45, 0.1)");
      innerGlow.addColorStop(1, "rgba(255, 70, 20, 0)");

      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(holeX, holeY, horizon * 3.5, 0, TAU);
      ctx.fill();

      ctx.restore();
    };

    // ------------------------------------------------
    // ACCRETION DISK
    // ------------------------------------------------

    const drawDisk = () => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      ctx.translate(holeX, holeY);
      ctx.rotate(-0.12);
      ctx.scale(1, 0.3);

      // Soft, blurry plasma
      const diskGlow = ctx.createRadialGradient(
        0, 0, horizon,
        0, 0, maxRadius * 0.8
      );

      diskGlow.addColorStop(0, "rgba(255, 150, 60, 0.15)");
      diskGlow.addColorStop(0.08, "rgba(255, 100, 35, 0.08)");
      diskGlow.addColorStop(0.3, "rgba(255, 130, 55, 0.035)");
      diskGlow.addColorStop(0.6, "rgba(30, 195, 205, 0.015)");
      diskGlow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = diskGlow;
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.8, 0, TAU);
      ctx.fill();

      ctx.restore();

      // Thin orbital rings
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const rings = [
        { r: 1.2, a: 0.36, w: 2.2 },
        { r: 1.55, a: 0.18, w: 1.5 },
        { r: 2.1, a: 0.12, w: 1 },
        { r: 2.8, a: 0.07, w: 0.8 },
      ];

      for (const ring of rings) {
        ctx.beginPath();

        ctx.ellipse(
          holeX,
          holeY,
          horizon * ring.r,
          horizon * ring.r * 0.3,
          -0.12,
          0,
          TAU
        );

        ctx.strokeStyle = `rgba(255, 150, 85, ${ring.a})`;
        ctx.lineWidth = ring.w;
        ctx.stroke();
      }

      ctx.restore();
    };

    // ------------------------------------------------
    // PLASMA JETS
    // ------------------------------------------------

    const drawJets = () => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const length = Math.max(width, height) * 0.38;

      ctx.translate(holeX, holeY);
      ctx.rotate(Math.PI / 2 - 0.12);

      for (const direction of [-1, 1]) {
        ctx.save();
        ctx.scale(1, direction);

        const gradient = ctx.createLinearGradient(
          0, horizon * 0.7,
          0, length
        );

        gradient.addColorStop(0, "rgba(255, 225, 185, 0.2)");
        gradient.addColorStop(0.12, "rgba(255, 135, 65, 0.12)");
        gradient.addColorStop(0.4, "rgba(50, 195, 210, 0.05)");
        gradient.addColorStop(1, "rgba(40, 130, 230, 0)");

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(-horizon * 0.12, horizon * 0.6);

        ctx.bezierCurveTo(
          -horizon * 0.3, length * 0.3,
          -horizon * 0.12, length * 0.75,
          0, length
        );

        ctx.bezierCurveTo(
          horizon * 0.12, length * 0.75,
          horizon * 0.3, length * 0.3,
          horizon * 0.12, horizon * 0.6
        );

        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();
    };

    // ------------------------------------------------
    // PARTICLES
    // ------------------------------------------------

    const drawParticles = (delta: number) => {
      // Batch all particles by color.
      // No individual shadowBlur and no duplicate updates.
      const batches: Particle[][] = COLORS.map(() => []);

      for (const p of particles) {
        p.update(delta);

        if (p.radius > horizon + 8) {
          batches[p.color].push(p);
        }
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < COLORS.length; i++) {
        const batch = batches[i];

        if (batch.length === 0) continue;

        ctx.fillStyle = COLORS[i];
        ctx.strokeStyle = COLORS[i];

        // Small motion trails, batched
        ctx.globalAlpha = 0.26;
        ctx.lineWidth = 0.8;
        ctx.beginPath();

        for (const p of batch) {
          ctx.moveTo(p.oldX, p.oldY);
          ctx.lineTo(p.x, p.y);
        }

        ctx.stroke();

        // Particle cores
        ctx.globalAlpha = 0.8;
        ctx.beginPath();

        for (const p of batch) {
          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, TAU);
        }

        ctx.fill();
      }

      ctx.restore();
    };

    // ------------------------------------------------
    // EVENT HORIZON
    // ------------------------------------------------

    const drawBlackHole = () => {
      ctx.save();

      // Wide soft shadow
      const shadow = ctx.createRadialGradient(
        holeX, holeY, horizon * 0.75,
        holeX, holeY, horizon * 2.5
      );

      shadow.addColorStop(0, "rgba(0,0,0,1)");
      shadow.addColorStop(0.42, "rgba(0,0,0,0.96)");
      shadow.addColorStop(0.7, "rgba(0,0,0,0.45)");
      shadow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(holeX, holeY, horizon * 2.5, 0, TAU);
      ctx.fill();

      // Completely black center
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(holeX, holeY, horizon, 0, TAU);
      ctx.fill();

      ctx.restore();
    };

    // ------------------------------------------------
    // PHOTON RING
    // ------------------------------------------------

    const drawPhotonRing = () => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const r = horizon + 4;

      // Wide orange blurred aura
      ctx.beginPath();
      ctx.arc(holeX, holeY, r + 3, 0, TAU);
      ctx.strokeStyle = "rgba(255, 115, 40, 0.16)";
      ctx.lineWidth = 21;
      ctx.stroke();

      // Secondary aura
      ctx.beginPath();
      ctx.arc(holeX, holeY, r + 1, 0, TAU);
      ctx.strokeStyle = "rgba(255, 185, 105, 0.3)";
      ctx.lineWidth = 8;
      ctx.stroke();

      // White photon ring
      ctx.beginPath();
      ctx.arc(holeX, holeY, r, 0, TAU);
      ctx.strokeStyle = "rgba(255, 243, 220, 0.92)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cyan outer ring
      ctx.beginPath();
      ctx.arc(holeX, holeY, r + 10, 0, TAU);
      ctx.strokeStyle = "rgba(75, 220, 215, 0.22)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.restore();
    };

    // ------------------------------------------------
    // MAIN LOOP
    // ------------------------------------------------

    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);

      if (document.hidden) return;

      if (time - lastFrame < FRAME_TIME) return;

      const delta = lastFrame
        ? Math.min(2, (time - lastFrame) / 16.667)
        : 1;

      lastFrame = time;

      // Soft particle trails
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(5, 8, 17, 0.3)";
      ctx.fillRect(0, 0, width, height);

      // Smooth movement
      const easing = reducedMotion ? 0.025 : 0.055;

      holeX += (targetX - holeX) * easing * delta;
      holeY += (targetY - holeY) * easing * delta;

      // Render layers
      drawGrid();
      drawStars(time);
      drawNebula();
      drawJets();
      drawDisk();
      drawParticles(delta);
      drawBlackHole();
      drawPhotonRing();

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    // ------------------------------------------------
    // INTERACTION
    // ------------------------------------------------

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onPointerLeave = () => {
      targetX = width / 2;
      targetY = height / 2;
    };

    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);

    resize();

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    />
  );
}

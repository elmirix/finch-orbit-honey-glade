import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let animationId: number;
    let lastFrame = 0;
    
    // Настройки
    const FPS = 30; 
    const FRAME_TIME = 1000 / FPS;
    const TAU = Math.PI * 2;
    
    let horizon = 55;
    let maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 1.1;
    const DISK_TILT = -0.12;
    const DISK_Y_SCALE = 0.3;
    const COLORS = [
      "rgba(255, 235, 205, 0.9)",
      "rgba(255, 160, 75, 0.85)",
      "rgba(255, 100, 40, 0.75)",
      "rgba(65, 225, 215, 0.75)",
      "rgba(145, 245, 235, 0.7)",
    ];

    let width = window.innerWidth;
    let height = window.innerHeight;
    let holeX = width / 2;
    let holeY = height / 2;
    let targetX = holeX;
    let targetY = holeY;

    // --- ИСПРАВЛЕННЫЙ КЛАСС ЧАСТИЦЫ ---
    class Particle {
      angle: number;
      radius: number;
      speed: number;
      fallSpeed: number;
      size: number;
      color: string;

      constructor() {
        this.angle = Math.random() * TAU;
        this.radius = horizon + 12 + Math.random() * (maxRadius - horizon);
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.speed = 0.002 + Math.random() * 0.006;
        this.fallSpeed = 0.12 + Math.random() * 0.22;
        this.size = 0.5 + Math.random() * 1.25;
      }

      update(delta: number) {
        this.angle += (this.speed + 0.014 * Math.pow(horizon / Math.max(this.radius, horizon), 0.7)) * delta;
        this.radius -= this.fallSpeed * delta;

        if (this.radius < horizon + 8) {
          this.radius = maxRadius * (0.8 + Math.random() * 0.2);
          this.angle = Math.random() * TAU;
        }
      }

      draw() {
        if (!ctx) return;
        const x = holeX + Math.cos(this.angle) * this.radius;
        const y = holeY + Math.sin(this.angle) * this.radius * DISK_Y_SCALE;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, TAU);
        ctx.fill();
      }
    }

    let particles: Particle[] = [];
    let stars: { x: number; y: number; size: number; alpha: number; phase: number; speed: number }[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, width, height);

      horizon = Math.min(65, Math.max(42, Math.min(width, height) * 0.065));
      maxRadius = Math.hypot(width, height) * 1.05;

      const count = Math.min(800, Math.max(300, Math.floor((width * height) / 3000)));
      particles = Array.from({ length: count }, () => new Particle());

      stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.1 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        phase: Math.random() * TAU,
        speed: 0.001 + Math.random() * 0.003,
      }));
    };

    const drawStars = (time: number) => {
      ctx.fillStyle = "#BCDDEB";
      for (const star of stars) {
        ctx.globalAlpha = star.alpha * (0.7 + Math.sin(time * star.speed + star.phase) * 0.3);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawJets = () => {
      const length = Math.max(width, height) * 0.38;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.translate(holeX, holeY);
      ctx.rotate(Math.PI / 2 + DISK_TILT);

      for (const direction of [-1, 1]) {
        ctx.save();
        ctx.scale(1, direction);
        const gradient = ctx.createLinearGradient(0, horizon * 0.7, 0, length);
        gradient.addColorStop(0, "rgba(255, 225, 185, 0.2)");
        gradient.addColorStop(0.12, "rgba(255, 135, 65, 0.12)");
        gradient.addColorStop(0.4, "rgba(50, 195, 210, 0.05)");
        gradient.addColorStop(1, "rgba(40, 130, 230, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(-horizon * 0.12, horizon * 0.6);
        ctx.bezierCurveTo(-horizon * 0.3, length * 0.3, -horizon * 0.12, length * 0.75, 0, length);
        ctx.bezierCurveTo(horizon * 0.12, length * 0.75, horizon * 0.3, length * 0.3, horizon * 0.12, horizon * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    };

    const drawDisk = () => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.translate(holeX, holeY);
      ctx.rotate(DISK_TILT);
      ctx.scale(1, DISK_Y_SCALE);

      const diskGlow = ctx.createRadialGradient(0, 0, horizon, 0, 0, maxRadius * 0.8);
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
    };

    const drawBlackHole = () => {
      ctx.save();
      const shadow = ctx.createRadialGradient(holeX, holeY, horizon * 0.75, holeX, holeY, horizon * 2.5);
      shadow.addColorStop(0, "rgba(0,0,0,1)");
      shadow.addColorStop(0.42, "rgba(0,0,0,0.96)");
      shadow.addColorStop(0.7, "rgba(0,0,0,0.45)");
      shadow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(holeX, holeY, horizon * 2.5, 0, TAU);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(holeX, holeY, horizon, 0, TAU);
      ctx.fill();
      ctx.restore();
    };

    const drawPhotonRing = () => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const r = horizon + 4;
      
      ctx.beginPath();
      ctx.arc(holeX, holeY, r + 3, 0, TAU);
      ctx.strokeStyle = "rgba(255, 115, 40, 0.16)";
      ctx.lineWidth = 21;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(holeX, holeY, r, 0, TAU);
      ctx.strokeStyle = "rgba(255, 243, 220, 0.92)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(holeX, holeY, r + 10, 0, TAU);
      ctx.strokeStyle = "rgba(75, 220, 215, 0.22)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
    };

    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);

      if (document.hidden) return;
      if (time - lastFrame < FRAME_TIME) return;

      const delta = lastFrame ? Math.min(2, (time - lastFrame) / 16.667) : 1;
      lastFrame = time;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(5, 8, 17, 0.3)";
      ctx.fillRect(0, 0, width, height);

      holeX += (targetX - holeX) * 0.05 * delta;
      holeY += (targetY - holeY) * 0.05 * delta;

      drawStars(time);
      drawJets();
      drawDisk();

      // Отрисовка частиц (именно здесь была ошибка, теперь она исправлена)
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.update(delta);
        p.draw();
      }

      drawBlackHole();
      drawPhotonRing();
      
      ctx.globalCompositeOperation = "source-over";
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const handlePointerLeave = () => {
      targetX = width / 2;
      targetY = height / 2;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);

    resize();
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-50] bg-[#050811] pointer-events-none"
    />
  );
}
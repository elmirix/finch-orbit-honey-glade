
import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });

    if (!canvas || !ctx) return;

    const TAU = Math.PI * 2;
    const BACKGROUND = "#050811";
    const DISK_TILT = -0.12;
    const DISK_Y_SCALE = 0.29;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let eventHorizon = Math.min(
      76,
      Math.max(46, Math.min(width, height) * 0.065)
    );

    let maxRadius = Math.hypot(width, height) * 1.1;

    let holeX = width / 2;
    let holeY = height / 2;

    let targetX = holeX;
    let targetY = holeY;

    let animationFrameId = 0;
    let lastTime = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const colors = [
      "rgba(255, 245, 225, 0.96)",
      "rgba(255, 190, 105, 0.92)",
      "rgba(255, 115, 45, 0.9)",
      "rgba(255, 75, 25, 0.82)",
      "rgba(85, 240, 225, 0.86)",
      "rgba(160, 250, 245, 0.8)",
    ];

    type Star = {
      x: number;
      y: number;
      size: number;
      opacity: number;
      phase: number;
      speed: number;
    };

    class Particle {
      angle: number;
      radius: number;
      drift: number;
      size: number;
      alpha: number;
      color: string;
      x: number;
      y: number;
      previousX: number;
      previousY: number;

      constructor() {
        this.angle = Math.random() * TAU;

        this.radius =
          eventHorizon + 15 + Math.pow(Math.random(), 1.15) *
            (maxRadius - eventHorizon);

        this.drift = Math.random() * 0.42 + 0.12;
        this.size = Math.random() * 1.7 + 0.45;
        this.alpha = Math.random() * 0.5 + 0.42;

        this.color =
          colors[Math.floor(Math.random() * colors.length)];

        this.x = 0;
        this.y = 0;
        this.previousX = 0;
        this.previousY = 0;

        this.updatePosition();

        this.previousX = this.x;
        this.previousY = this.y;
      }

      updatePosition() {
        const rawX = Math.cos(this.angle) * this.radius;
        const rawY =
          Math.sin(this.angle) * this.radius * DISK_Y_SCALE;

        const cos = Math.cos(DISK_TILT);
        const sin = Math.sin(DISK_TILT);

        this.x = holeX + rawX * cos - rawY * sin;
        this.y = holeY + rawX * sin + rawY * cos;
      }

      update(delta: number) {
        this.previousX = this.x;
        this.previousY = this.y;

        const orbitalSpeed =
          0.002 +
          0.027 *
            Math.pow(
              eventHorizon / Math.max(this.radius, eventHorizon),
              0.8
            );

        this.angle += orbitalSpeed * delta;

        this.radius -= this.drift * delta;

        if (this.radius < eventHorizon + 9) {
          this.radius =
            maxRadius * (0.82 + Math.random() * 0.18);

          this.angle = Math.random() * TAU;

          this.updatePosition();

          this.previousX = this.x;
          this.previousY = this.y;

          return;
        }

        this.updatePosition();
      }

      draw() {
        const distanceFade =
          1 - Math.min(1, this.radius / maxRadius);

        const brightness = 0.35 + distanceFade * 0.9;

        ctx!.globalAlpha = this.alpha * brightness;

        ctx!.strokeStyle = this.color;
        ctx!.fillStyle = this.color;

        ctx!.lineWidth =
          this.size * (0.55 + distanceFade * 0.7);

        if (this.size > 1.1) {
          ctx!.shadowBlur = 7 + distanceFade * 15;
          ctx!.shadowColor = this.color;
        } else {
          ctx!.shadowBlur = 2;
          ctx!.shadowColor = this.color;
        }

        // Световой след
        ctx!.beginPath();
        ctx!.moveTo(this.previousX, this.previousY);
        ctx!.lineTo(this.x, this.y);
        ctx!.stroke();

        // Яркое ядро частицы
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, TAU);
        ctx!.fill();

        ctx!.shadowBlur = 0;
        ctx!.globalAlpha = 1;
      }
    }

    let particles: Particle[] = [];
    let stars: Star[] = [];

    // --------------------------------------------------
    // CANVAS INITIALIZATION
    // --------------------------------------------------

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      eventHorizon = Math.min(
        76,
        Math.max(46, Math.min(width, height) * 0.065)
      );

      maxRadius = Math.hypot(width, height) * 1.1;

      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);

      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx!.fillStyle = BACKGROUND;
      ctx!.fillRect(0, 0, width, height);

      holeX = Math.min(width, Math.max(0, holeX));
      holeY = Math.min(height, Math.max(0, holeY));

      particles = [];

      const particleCount = reducedMotion
        ? 260
        : Math.min(
            1100,
            Math.max(500, Math.floor((width * height) / 2500))
          );

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      stars = [];

      const starCount = Math.min(
        300,
        Math.max(100, Math.floor((width * height) / 8500))
      );

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.25 + 0.25,
          opacity: Math.random() * 0.55 + 0.12,
          phase: Math.random() * TAU,
          speed: Math.random() * 0.025 + 0.005,
        });
      }
    };

    // --------------------------------------------------
    // STAR FIELD
    // --------------------------------------------------

    const drawStars = (time: number) => {
      ctx!.save();
      ctx!.globalCompositeOperation = "screen";

      for (const star of stars) {
        const twinkle =
          0.65 +
          Math.sin(time * star.speed + star.phase) * 0.35;

        ctx!.globalAlpha = star.opacity * twinkle;
        ctx!.fillStyle = "#B9D9F5";

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size, 0, TAU);
        ctx!.fill();
      }

      ctx!.restore();
    };

    // --------------------------------------------------
    // RELATIVISTIC JETS
    // --------------------------------------------------

    const drawJets = () => {
      const jetLength = Math.max(width, height) * 0.52;

      ctx!.save();

      ctx!.globalCompositeOperation = "lighter";

      ctx!.translate(holeX, holeY);
      ctx!.rotate(DISK_TILT + Math.PI / 2);

      const drawJet = (direction: number) => {
        ctx!.save();
        ctx!.scale(1, direction);

        const gradient = ctx!.createLinearGradient(
          0,
          eventHorizon * 0.45,
          0,
          jetLength
        );

        gradient.addColorStop(0, "rgba(255,255,255,0.45)");
        gradient.addColorStop(0.08, "rgba(255,185,100,0.3)");
        gradient.addColorStop(0.35, "rgba(65,220,220,0.09)");
        gradient.addColorStop(1, "rgba(45,140,230,0)");

        ctx!.fillStyle = gradient;

        ctx!.beginPath();
        ctx!.moveTo(-eventHorizon * 0.15, eventHorizon * 0.45);

        ctx!.bezierCurveTo(
          -eventHorizon * 0.5,
          jetLength * 0.3,
          -eventHorizon * 0.12,
          jetLength * 0.83,
          0,
          jetLength
        );

        ctx!.bezierCurveTo(
          eventHorizon * 0.12,
          jetLength * 0.83,
          eventHorizon * 0.5,
          jetLength * 0.3,
          eventHorizon * 0.15,
          eventHorizon * 0.45
        );

        ctx!.closePath();
        ctx!.fill();

        // Центральное ядро струи
        const core = ctx!.createLinearGradient(
          0,
          eventHorizon * 0.5,
          0,
          jetLength * 0.65
        );

        core.addColorStop(0, "rgba(255,245,220,0.7)");
        core.addColorStop(0.12, "rgba(255,180,110,0.24)");
        core.addColorStop(1, "rgba(70,190,255,0)");

        ctx!.strokeStyle = core;
        ctx!.lineWidth = 3;
        ctx!.shadowBlur = 20;
        ctx!.shadowColor = "#FFB36B";

        ctx!.beginPath();
        ctx!.moveTo(0, eventHorizon * 0.5);
        ctx!.lineTo(0, jetLength * 0.58);
        ctx!.stroke();

        ctx!.restore();
      };

      drawJet(-1);
      drawJet(1);

      ctx!.restore();
    };

    // --------------------------------------------------
    // NEBULA GLOW
    // --------------------------------------------------

    const drawNebula = () => {
      const haloRadius = Math.min(
        Math.max(width, height) * 0.55,
        900
      );

      const gradient = ctx!.createRadialGradient(
        holeX,
        holeY,
        eventHorizon * 0.7,
        holeX,
        holeY,
        haloRadius
      );

      gradient.addColorStop(0, "rgba(255,120,35,0.18)");
      gradient.addColorStop(0.16, "rgba(255,145,55,0.12)");
      gradient.addColorStop(0.38, "rgba(35,185,195,0.045)");
      gradient.addColorStop(0.7, "rgba(35,100,180,0.018)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx!.save();
      ctx!.globalCompositeOperation = "screen";

      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.arc(holeX, holeY, haloRadius, 0, TAU);
      ctx!.fill();

      ctx!.restore();
    };

    // --------------------------------------------------
    // ACCRETION DISK
    // --------------------------------------------------

    const drawAccretionDisk = () => {
      ctx!.save();

      ctx!.globalCompositeOperation = "lighter";

      // Широкое атмосферное свечение диска
      ctx!.translate(holeX, holeY);
      ctx!.rotate(DISK_TILT);
      ctx!.scale(1, DISK_Y_SCALE);

      const diskGlow = ctx!.createRadialGradient(
        0,
        0,
        eventHorizon * 0.85,
        0,
        0,
        maxRadius
      );

      diskGlow.addColorStop(0, "rgba(255,125,35,0)");
      diskGlow.addColorStop(0.08, "rgba(255,120,40,0.13)");
      diskGlow.addColorStop(0.2, "rgba(255,170,80,0.065)");
      diskGlow.addColorStop(0.42, "rgba(255,105,45,0.035)");
      diskGlow.addColorStop(0.72, "rgba(35,205,205,0.025)");
      diskGlow.addColorStop(1, "rgba(0,0,0,0)");

      ctx!.fillStyle = diskGlow;
      ctx!.beginPath();
      ctx!.arc(0, 0, maxRadius, 0, TAU);
      ctx!.fill();

      ctx!.restore();

      // Орбитальные слои
      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";

      const ringRadii = [
        eventHorizon * 1.18,
        eventHorizon * 1.38,
        eventHorizon * 1.75,
        eventHorizon * 2.2,
        eventHorizon * 3.0,
      ];

      for (let i = 0; i < ringRadii.length; i++) {
        const r = ringRadii[i];

        const gradient = ctx!.createLinearGradient(
          holeX - r,
          holeY,
          holeX + r,
          holeY
        );

        gradient.addColorStop(0, "rgba(40,220,215,0.02)");
        gradient.addColorStop(0.22, "rgba(255,125,40,0.22)");
        gradient.addColorStop(0.45, "rgba(255,235,200,0.38)");
        gradient.addColorStop(0.65, "rgba(255,120,45,0.2)");
        gradient.addColorStop(1, "rgba(45,200,220,0.025)");

        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = i < 2 ? 3 : 1.6;
        ctx!.shadowColor = "#FF8B45";
        ctx!.shadowBlur = i < 2 ? 22 : 12;

        ctx!.beginPath();
        ctx!.ellipse(
          holeX,
          holeY,
          r,
          r * DISK_Y_SCALE,
          DISK_TILT,
          0,
          TAU
        );
        ctx!.stroke();
      }

      ctx!.restore();
    };

    // --------------------------------------------------
    // BLACK HOLE SHADOW
    // --------------------------------------------------

    const drawEventHorizon = () => {
      ctx!.save();

      // Тёмный внешний ореол
      const shadow = ctx!.createRadialGradient(
        holeX,
        holeY,
        eventHorizon * 0.7,
        holeX,
        holeY,
        eventHorizon * 2.2
      );

      shadow.addColorStop(0, "rgba(0,0,0,1)");
      shadow.addColorStop(0.45, "rgba(0,0,0,0.95)");
      shadow.addColorStop(0.72, "rgba(0,0,0,0.35)");
      shadow.addColorStop(1, "rgba(0,0,0,0)");

      ctx!.fillStyle = shadow;
      ctx!.beginPath();
      ctx!.arc(holeX, holeY, eventHorizon * 2.2, 0, TAU);
      ctx!.fill();

      // Абсолютно чёрный горизонт событий
      const core = ctx!.createRadialGradient(
        holeX - eventHorizon * 0.22,
        holeY - eventHorizon * 0.25,
        eventHorizon * 0.05,
        holeX,
        holeY,
        eventHorizon
      );

      core.addColorStop(0, "#000000");
      core.addColorStop(0.7, "#000000");
      core.addColorStop(1, "#010204");

      ctx!.fillStyle = core;
      ctx!.beginPath();
      ctx!.arc(holeX, holeY, eventHorizon, 0, TAU);
      ctx!.fill();

      ctx!.restore();
    };

    // --------------------------------------------------
    // PHOTON RING
    // --------------------------------------------------

    const drawPhotonRing = () => {
      ctx!.save();

      ctx!.globalCompositeOperation = "lighter";

      const r = eventHorizon + 5;

      // Большое внешнее свечение
      ctx!.beginPath();
      ctx!.arc(holeX, holeY, r + 3, 0, TAU);

      ctx!.strokeStyle = "rgba(255,125,35,0.55)";
      ctx!.lineWidth = 10;
      ctx!.shadowBlur = 35;
      ctx!.shadowColor = "#FF762B";
      ctx!.stroke();

      // Белое раскалённое ядро
      ctx!.beginPath();
      ctx!.arc(holeX, holeY, r, 0, TAU);

      ctx!.strokeStyle = "rgba(255,240,215,0.92)";
      ctx!.lineWidth = 2.5;
      ctx!.shadowBlur = 23;
      ctx!.shadowColor = "#FFFFFF";
      ctx!.stroke();

      // Внешнее бирюзовое линзирование
      ctx!.beginPath();
      ctx!.arc(holeX, holeY, r + 9, 0, TAU);

      ctx!.strokeStyle = "rgba(70,220,220,0.25)";
      ctx!.lineWidth = 1.5;
      ctx!.shadowBlur = 15;
      ctx!.shadowColor = "#34D9D0";
      ctx!.stroke();

      // Неравномерные горячие участки фотонного кольца
      const arcColors = [
        "rgba(255,255,245,0.95)",
        "rgba(255,155,75,0.95)",
        "rgba(255,225,180,0.9)",
      ];

      for (let i = 0; i < 3; i++) {
        const start = i * (TAU / 3) + 0.2;
        const end = start + 0.7 + i * 0.12;

        ctx!.beginPath();
        ctx!.arc(holeX, holeY, r + 1, start, end);

        ctx!.strokeStyle = arcColors[i];
        ctx!.lineWidth = 4;
        ctx!.shadowBlur = 20;
        ctx!.shadowColor = arcColors[i];

        ctx!.stroke();
      }

      ctx!.restore();
    };

    // --------------------------------------------------
    // PARTICLES: BACK AND FRONT SIDES
    // --------------------------------------------------

    const drawParticles = (front: boolean, delta: number) => {
      ctx!.save();

      ctx!.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        particle.update(delta);

        // Передняя и задняя половины диска
        const isFront = Math.sin(particle.angle) > 0;

        if (isFront !== front) continue;

        // За горизонтом событий ничего не видно
        if (particle.radius < eventHorizon + 7) continue;

        particle.draw();
      }

      ctx!.restore();
    };

    // --------------------------------------------------
    // MAIN ANIMATION
    // --------------------------------------------------

    const animate = (time: number) => {
      const delta = Math.min(
        2.2,
        lastTime ? (time - lastTime) / 16.667 : 1
      );

      lastTime = time;

      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Fade вместо полной очистки — создаёт длинные световые следы
      ctx!.globalCompositeOperation = "source-over";
      ctx!.globalAlpha = 1;

      ctx!.fillStyle = "rgba(5,8,17,0.24)";
      ctx!.fillRect(0, 0, width, height);

      // Плавное следование за курсором
      const followSpeed = reducedMotion ? 0.035 : 0.055;

      holeX += (targetX - holeX) * followSpeed * delta;
      holeY += (targetY - holeY) * followSpeed * delta;

      // 1. Звёздное пространство
      drawStars(time);

      // 2. Релятивистские струи
      drawJets();

      // 3. Общая туманность
      drawNebula();

      // 4. Светящийся аккреционный диск
      drawAccretionDisk();

      // 5. Задняя часть диска
      drawParticles(false, delta);

      // 6. Чёрная дыра
      drawEventHorizon();

      // 7. Фотонное кольцо
      drawPhotonRing();

      // 8. Передняя часть диска
      drawParticles(true, delta);

      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(animate);
    };

    // --------------------------------------------------
    // MOUSE / POINTER INTERACTION
    // --------------------------------------------------

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

    animationFrameId = requestAnimationFrame(animate);

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------

    return () => {
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
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

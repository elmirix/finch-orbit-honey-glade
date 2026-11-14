
import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  size: number;
  alpha: number;
  speedX: number;
  speedY: number;
  phase: number;
  twinkle: number;
  color: string;
};

const random = (min: number, max: number) =>
  min + Math.random() * (max - min);

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!canvas || !ctx) return;

    // ----------------------------------------
    // SETTINGS
    // ----------------------------------------

    const FPS = 30;
    const FRAME_INTERVAL = 1000 / FPS;
    const MAX_DPR = 1.35;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const TAU = Math.PI * 2;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;

    let farStars: Star[] = [];
    let nearStars: Star[] = [];

    let frameId = 0;
    let lastFrame = 0;
    let isRunning = true;

    let galaxyCanvas = document.createElement("canvas");
    let galaxyCtx = galaxyCanvas.getContext("2d");

    if (!galaxyCtx) return;

    // ----------------------------------------
    // STAR COLORS
    // ----------------------------------------

    const starColors = [
      "#DCEAFF",
      "#A8CFFF",
      "#FFFFFF",
      "#FFE2C2",
      "#A4B9FF",
    ];

    // ----------------------------------------
    // CREATE STARS
    // ----------------------------------------

    const createStars = (
      count: number,
      foreground: boolean
    ): Star[] => {
      return Array.from({ length: count }, () => {
        const depth = foreground ? random(0.7, 1.5) : random(0.25, 0.8);

        const x = Math.random() * width;
        const y = Math.random() * height;

        return {
          x,
          y,
          oldX: x,
          oldY: y,

          size: foreground
            ? random(0.65, 1.65)
            : random(0.3, 1.05),

          alpha: foreground
            ? random(0.3, 0.9)
            : random(0.15, 0.65),

          // Very slow natural space drift
          speedX: prefersReducedMotion
            ? 0
            : -random(0.025, 0.12) * depth,

          speedY: prefersReducedMotion
            ? 0
            : random(0.005, 0.045) * depth,

          phase: random(0, TAU),
          twinkle: random(0.0005, 0.0018),

          color:
            starColors[
              Math.floor(Math.random() * starColors.length)
            ],
        };
      });
    };

    // ----------------------------------------
    // BUILD PROCEDURAL GALAXY
    // ----------------------------------------

    const buildGalaxy = () => {
      const gc = galaxyCtx!;

      galaxyCanvas.width = Math.round(width * dpr);
      galaxyCanvas.height = Math.round(height * dpr);

      gc.setTransform(dpr, 0, 0, dpr, 0, 0);
      gc.clearRect(0, 0, width, height);

      const centerX = width * 0.51;
      const centerY = height * 0.5;

      // Galaxy proportions
      const radiusX = Math.min(
        width * 0.44,
        height * 0.85
      );

      const radiusY = radiusX * 0.3;
      const tilt = -0.47;

      gc.save();

      gc.translate(centerX, centerY);
      gc.rotate(tilt);

      // Flatten galaxy like a real spiral disk
      gc.scale(1, 0.58);

      // ----------------------------------------
      // OUTER GALAXY HALO
      // ----------------------------------------

      const halo = gc.createRadialGradient(
        0, 0, radiusX * 0.03,
        0, 0, radiusX * 1.08
      );

      halo.addColorStop(0, "rgba(255,238,220,0.23)");
      halo.addColorStop(0.13, "rgba(230,186,160,0.15)");
      halo.addColorStop(0.35, "rgba(112,139,205,0.085)");
      halo.addColorStop(0.62, "rgba(70,105,180,0.04)");
      halo.addColorStop(1, "rgba(0,0,0,0)");

      gc.fillStyle = halo;
      gc.beginPath();
      gc.ellipse(
        0, 0,
        radiusX * 1.08,
        radiusY * 2.4,
        0, 0, TAU
      );
      gc.fill();

      // ----------------------------------------
      // INNER ACCRETION / GALAXY GLOW
      // ----------------------------------------

      const inner = gc.createRadialGradient(
        0, 0, 2,
        0, 0, radiusX * 0.55
      );

      inner.addColorStop(0, "rgba(255,255,245,0.95)");
      inner.addColorStop(0.035, "rgba(255,235,205,0.55)");
      inner.addColorStop(0.12, "rgba(255,193,140,0.25)");
      inner.addColorStop(0.3, "rgba(180,155,205,0.12)");
      inner.addColorStop(0.65, "rgba(80,130,210,0.06)");
      inner.addColorStop(1, "rgba(0,0,0,0)");

      gc.fillStyle = inner;
      gc.beginPath();
      gc.ellipse(
        0, 0,
        radiusX * 0.78,
        radiusY * 1.8,
        0, 0, TAU
      );
      gc.fill();

      // ----------------------------------------
      // SPIRAL ARMS
      // ----------------------------------------

      const armColors = [
        "rgba(165,195,255,0.48)",
        "rgba(220,180,205,0.42)",
        "rgba(255,207,165,0.46)",
        "rgba(120,165,235,0.4)",
      ];

      const pointCount = Math.min(
        2300,
        Math.max(1000, Math.floor((width * height) / 900))
      );

      // The particles are generated only once.
      for (let i = 0; i < pointCount; i++) {
        const arm = i % 2;

        const r =
          Math.pow(Math.random(), 0.72) * radiusX * 0.94;

        const angle =
          arm * Math.PI +
          (r / radiusX) * 5.2 +
          random(-0.48, 0.48);

        const thickness = random(-0.09, 0.09) * radiusX;

        const x = Math.cos(angle) * r;
        const y =
          Math.sin(angle) * r * 0.47 +
          thickness;

        const pointSize =
          r < radiusX * 0.2
            ? random(0.5, 1.8)
            : random(0.35, 1.35);

        gc.globalAlpha = random(0.15, 0.85);

        gc.fillStyle =
          armColors[Math.floor(Math.random() * armColors.length)];

        gc.beginPath();
        gc.arc(
          x,
          y,
          pointSize,
          0,
          TAU
        );
        gc.fill();
      }

      gc.globalAlpha = 1;

      // ----------------------------------------
      // DUST LANES
      // ----------------------------------------

      // Dark subtle lanes give the galaxy depth.
      gc.save();

      gc.globalCompositeOperation = "source-over";

      gc.strokeStyle = "rgba(43,29,34,0.22)";
      gc.lineWidth = radiusX * 0.022;
      gc.lineCap = "round";

      gc.beginPath();
      gc.moveTo(-radiusX * 0.87, -radiusY * 0.1);

      gc.bezierCurveTo(
        -radiusX * 0.43,
        -radiusY * 0.27,
        radiusX * 0.15,
        -radiusY * 0.05,
        radiusX * 0.87,
        radiusY * 0.14
      );

      gc.stroke();

      gc.strokeStyle = "rgba(35,29,40,0.14)";
      gc.lineWidth = radiusX * 0.013;

      gc.beginPath();
      gc.moveTo(-radiusX * 0.72, radiusY * 0.24);

      gc.bezierCurveTo(
        -radiusX * 0.22,
        radiusY * 0.06,
        radiusX * 0.35,
        radiusY * 0.35,
        radiusX * 0.77,
        radiusY * 0.2
      );

      gc.stroke();

      gc.restore();

      // ----------------------------------------
      // CENTRAL CORE
      // ----------------------------------------

      const core = gc.createRadialGradient(
        0, 0, 0,
        0, 0, radiusX * 0.19
      );

      core.addColorStop(0, "rgba(255,255,248,0.95)");
      core.addColorStop(0.04, "rgba(255,239,218,0.7)");
      core.addColorStop(0.16, "rgba(255,203,160,0.25)");
      core.addColorStop(0.5, "rgba(255,168,130,0.07)");
      core.addColorStop(1, "rgba(0,0,0,0)");

      gc.fillStyle = core;
      gc.beginPath();
      gc.arc(0, 0, radiusX * 0.19, 0, TAU);
      gc.fill();

      // A few bright stars close to the galactic core
      for (let i = 0; i < 65; i++) {
        const a = Math.random() * TAU;
        const r = Math.sqrt(Math.random()) * radiusX * 0.2;

        gc.fillStyle =
          Math.random() > 0.5
            ? "rgba(255,241,220,0.8)"
            : "rgba(166,199,255,0.65)";

        gc.beginPath();
        gc.arc(
          Math.cos(a) * r,
          Math.sin(a) * r * 0.8,
          random(0.4, 1.4),
          0,
          TAU
        );
        gc.fill();
      }

      gc.restore();
    };

    // ----------------------------------------
    // RESIZE
    // ----------------------------------------

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(
        window.devicePixelRatio || 1,
        MAX_DPR
      );

      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);

      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Pre-render the galaxy
      buildGalaxy();

      // Star density scales with the display resolution
      const count = Math.min(
        1400,
        Math.max(400, Math.floor(width * height / 1600))
      );

      farStars = createStars(
        Math.floor(count * 0.78),
        false
      );

      nearStars = createStars(
        Math.floor(count * 0.22),
        true
      );

      ctx!.fillStyle = "#02040B";
      ctx!.fillRect(0, 0, width, height);
    };

    // ----------------------------------------
    // DRAW BACKGROUND
    // ----------------------------------------

    const drawBackground = () => {
      ctx!.fillStyle = "#02040B";
      ctx!.fillRect(0, 0, width, height);

      // Subtle dark blue ambient light
      const gradient = ctx!.createRadialGradient(
        width * 0.5,
        height * 0.48,
        0,
        width * 0.5,
        height * 0.48,
        Math.max(width, height) * 0.8
      );

      gradient.addColorStop(0, "rgba(15,24,48,0.23)");
      gradient.addColorStop(0.65, "rgba(5,12,27,0.12)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, width, height);
    };

    // ----------------------------------------
    // DRAW STARS
    // ----------------------------------------

    const drawStars = (
      stars: Star[],
      time: number,
      delta: number,
      foreground: boolean
    ) => {
      for (const star of stars) {
        star.oldX = star.x;
        star.oldY = star.y;

        star.x += star.speedX * delta;
        star.y += star.speedY * delta;

        // Wrap around screen
        if (star.x < -5) star.x = width + 5;
        if (star.x > width + 5) star.x = -5;

        if (star.y > height + 5) star.y = -5;
        if (star.y < -5) star.y = height + 5;

        const shimmer = prefersReducedMotion
          ? 1
          : 0.78 +
            Math.sin(time * star.twinkle + star.phase) * 0.22;

        ctx!.globalAlpha = star.alpha * shimmer;
        ctx!.fillStyle = star.color;

        // Tiny stars are simple rectangles.
        // Larger stars use circles.
        if (star.size < 0.85) {
          ctx!.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
          );
        } else {
          ctx!.beginPath();
          ctx!.arc(
            star.x,
            star.y,
            star.size,
            0,
            TAU
          );
          ctx!.fill();
        }

        // Very subtle motion on foreground stars.
        if (
          foreground &&
          star.size > 1.25 &&
          !prefersReducedMotion
        ) {
          ctx!.globalAlpha = star.alpha * 0.12;

          ctx!.strokeStyle = star.color;
          ctx!.lineWidth = 0.7;

          ctx!.beginPath();
          ctx!.moveTo(star.oldX, star.oldY);
          ctx!.lineTo(star.x, star.y);
          ctx!.stroke();
        }
      }

      ctx!.globalAlpha = 1;
    };

    // ----------------------------------------
    // MAIN ANIMATION
    // ----------------------------------------

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      if (!isRunning || document.hidden) return;

      if (time - lastFrame < FRAME_INTERVAL) return;

      const delta = lastFrame
        ? Math.min((time - lastFrame) / 16.667, 2)
        : 1;

      lastFrame = time;

      // 1. Space background
      drawBackground();

      // 2. Distant stars
      drawStars(farStars, time, delta, false);

      // 3. Static galaxy with extremely subtle breathing
      const galaxyOpacity = prefersReducedMotion
        ? 0.95
        : 0.925 + Math.sin(time * 0.00035) * 0.025;

      ctx!.globalAlpha = galaxyOpacity;

      ctx!.drawImage(
        galaxyCanvas,
        0,
        0,
        width,
        height
      );

      ctx!.globalAlpha = 1;

      // 4. Foreground stars
      drawStars(nearStars, time, delta, true);

      // 5. Subtle cinematic vignette
      const vignette = ctx!.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.2,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.78
      );

      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.65, "rgba(0,0,0,0.08)");
      vignette.addColorStop(1, "rgba(0,0,0,0.43)");

      ctx!.fillStyle = vignette;
      ctx!.fillRect(0, 0, width, height);

      ctx!.globalAlpha = 1;
    };

    // ----------------------------------------
    // VISIBILITY / PERFORMANCE
    // ----------------------------------------

    const handleVisibility = () => {
      isRunning = !document.hidden;
      lastFrame = 0;

      if (isRunning) {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(frameId);
      }
    };

    const handleResize = () => {
      resize();
      lastFrame = 0;
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    resize();

    frameId = requestAnimationFrame(animate);

    // ----------------------------------------
    // CLEANUP
    // ----------------------------------------

    return () => {
      isRunning = false;

      cancelAnimationFrame(frameId);

      window.removeEventListener("resize", handleResize);

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      galaxyCanvas.width = 0;
      galaxyCanvas.height = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}

import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // --- НАСТРОЙКИ ЧЕРНОЙ ДЫРЫ ---
    const particleCount = 600; // Количество частиц газа
    const eventHorizon = 60; // Радиус абсолютно черной дыры (горизонт событий)
    const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.7;

    // Центр черной дыры (плавно следует за мышкой)
    let holeX = window.innerWidth / 2;
    let holeY = window.innerHeight / 2;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      angle: number;
      distance: number;
      speed: number;
      size: number;
      color: string;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * maxRadius + eventHorizon;
        // Скорость вращения (зависит от расстояния)
        this.speed = (Math.random() * 0.02 + 0.01);
        this.size = Math.random() * 1.5 + 0.5;
        
        // Цвета: Оранжевый, Желтый, Бирюзовый (космический газ)
        const colors = [
          'rgba(255, 140, 0, 0.8)',  // Оранжевый
          'rgba(255, 200, 50, 0.8)', // Желтый
          'rgba(45, 212, 191, 0.8)', // Teal (под стиль сайта)
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Вращение
        this.angle += this.speed * (150 / this.distance);
        
        // Притяжение к центру (падает в дыру)
        this.distance -= 0.8;

        // Если частица достигла горизонта событий — возрождаем её на краю
        if (this.distance < eventHorizon) {
          this.distance = maxRadius;
          this.angle = Math.random() * Math.PI * 2;
        }
      }

      draw() {
        if (!ctx) return;
        
        // Координаты частицы (делаем орбиту слегка эллиптичной для объема)
        const x = holeX + Math.cos(this.angle) * this.distance;
        const y = holeY + Math.sin(this.angle) * (this.distance * 0.6); // 0.6 создает эффект наклона

        // Чем ближе к центру, тем ярче
        const opacity = 1 - (this.distance / maxRadius);
        
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10 * opacity;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Сброс для других элементов
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Очищаем экран (фон)
      ctx.fillStyle = '#050B14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Плавное движение дыры за мышкой
      holeX += (targetX - holeX) * 0.05;
      holeY += (targetY - holeY) * 0.05;

      // --- 1. Рисуем свечение вокруг черной дыры ---
      const glowGradient = ctx.createRadialGradient(
        holeX, holeY, eventHorizon, 
        holeX, holeY, eventHorizon + 100
      );
      glowGradient.addColorStop(0, 'rgba(255, 140, 0, 0.4)'); // Оранжевое свечение
      glowGradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.1)'); // Бирюзовое
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(holeX, holeY, eventHorizon + 100, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // --- 2. Рисуем частицы (Аккреционный диск) ---
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // --- 3. Рисуем Горизонт Событий (Абсолютно Черный круг) ---
      ctx.beginPath();
      ctx.arc(holeX, holeY, eventHorizon, 0, Math.PI * 2);
      ctx.fillStyle = '#000000'; // Чистый черный
      ctx.fill();
      
      // Тонкая яркая обводка вокруг горизонта
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-50] bg-[#050B14] pointer-events-none"
    />
  );
}
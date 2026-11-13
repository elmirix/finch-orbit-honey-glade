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

    // Настройки вихря
    const particleCount = 400; // Много частиц для плотной воронки
    const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.8;

    // Центр вихря (плавно следует за мышкой)
    let vortexX = window.innerWidth / 2;
    let vortexY = window.innerHeight / 2;
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
        // Случайный угол (от 0 до 2Пи)
        this.angle = Math.random() * Math.PI * 2;
        // Случайное расстояние от центра (от 50 до maxRadius)
        this.distance = Math.random() * maxRadius + 50;
        // Скорость вращения (чем ближе к центру, тем быстрее)
        this.speed = (Math.random() * 0.02 + 0.01);
        this.size = Math.random() * 1.5 + 0.5;
        
        // Цвета: бирюзовый, синий и белый
        const colors = [
          'rgba(45, 212, 191, 0.8)', // Teal
          'rgba(96, 165, 250, 0.8)', // Blue
          'rgba(255, 255, 255, 0.6)' // White
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Вращение (закручивание)
        this.angle += this.speed * (100 / this.distance); // Ускоряем ближе к центру
        
        // Притяжение к центру (падение в воронку)
        this.distance -= 1.5;

        // Если частица достигла центра, возрождаем её на краю
        if (this.distance < 10) {
          this.distance = maxRadius;
          this.angle = Math.random() * Math.PI * 2;
        }
      }

      draw() {
        if (!ctx) return;
        
        // Вычисляем координаты частицы относительно центра вихря
        const x = vortexX + Math.cos(this.angle) * this.distance;
        const y = vortexY + Math.sin(this.angle) * this.distance;

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
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

      // Эффект шлейфа (вместо полной очистки заливаем полупрозрачным цветом)
      // Это создает смазанный след за частицами
      ctx.fillStyle = 'rgba(5, 11, 20, 0.2)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Плавное движение центра вихря за мышкой (Lerp)
      vortexX += (targetX - vortexX) * 0.05;
      vortexY += (targetY - vortexY) * 0.05;

      // Отрисовка центрального свечения (ядра вихря)
      const gradient = ctx.createRadialGradient(vortexX, vortexY, 0, vortexX, vortexY, 150);
      gradient.addColorStop(0, 'rgba(45, 212, 191, 0.1)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

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
import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Темный фон с легким шлейфом
      ctx.fillStyle = 'rgba(5, 11, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      // Рисуем несколько слоев волн
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        const color = i === 0 ? 'rgba(45, 212, 191, 0.2)' : i === 1 ? 'rgba(96, 165, 250, 0.2)' : 'rgba(168, 85, 247, 0.2)';
        ctx.fillStyle = color;

        for (let x = 0; x <= canvas.width; x += 20) {
          // Базовая волна
          let y = Math.sin(x * 0.003 + time + i) * 100 + canvas.height / 2;
          
          // Искажение от мыши
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 300) {
            // Волна вытягивается к мышке
            y -= (300 - dist) * 0.5; 
          }

          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        
        // Размытие для эффекта "жидкости"
        ctx.shadowBlur = 50;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0; // Сброс
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-50] bg-[#050B14] pointer-events-none" />;
}
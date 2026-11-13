import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function AnimatedBackground() {
  const elements = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const type = i % 3;
      const size = Math.random() * 30 + 10;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * -20;
      return { id: i, type, size, left, top, duration, delay };
    });
  }, []);

  return (
    // z-0 вместо z-[-50]
    <div className="fixed inset-0 z-0 bg-[#050B14] overflow-hidden pointer-events-none">
      
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-teal/10 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, -40, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[130px]"
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[100px]"
      />

      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)'
        }}
      />

      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{ left: `${el.left}%`, top: `${el.top}%` }}
          animate={{
            y: [0, Math.random() * 100 - 50, 0],
            x: [0, Math.random() * 100 - 50, 0],
            rotate: [0, Math.random() * 180, 0],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        >
          {el.type === 0 && (
            <div className="rounded-full bg-teal/20 blur-[2px] shadow-[0_0_15px_rgba(45,212,191,0.5)]" style={{ width: el.size, height: el.size }} />
          )}
          {el.type === 1 && (
            <div className="rounded-full border border-blue-400/30" style={{ width: el.size, height: el.size }} />
          )}
          {el.type === 2 && (
            <div className="text-white/20 blur-[1px] select-none" style={{ fontSize: el.size }}>
              {['✦', '△', '◇', '○'][el.id % 4]}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export function AnimatedBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="nebula-background"
      >
        {/* Base */}
        <div className="nebula-base" />

        {/* Soft ambient lights */}
        <div className="nebula-glow nebula-glow-cyan" />
        <div className="nebula-glow nebula-glow-blue" />
        <div className="nebula-glow nebula-glow-warm" />

        {/* Technology grid */}
        <div className="nebula-grid" />

        {/* Static tiny stars */}
        <div className="nebula-stars" />

        {/* Depth and vignette */}
        <div className="nebula-vignette" />
      </div>

      <style>{`
        .nebula-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          isolation: isolate;
          background: #050914;
        }

        .nebula-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse at 50% 0%,
              rgba(20, 65, 85, 0.16),
              transparent 60%
            ),
            linear-gradient(
              145deg,
              #050914 0%,
              #07121e 50%,
              #050914 100%
            );
        }

        /* Soft glowing clouds */

        .nebula-glow {
          position: absolute;
          width: 65vw;
          height: 65vw;
          max-width: 850px;
          max-height: 850px;
          border-radius: 50%;
          filter: blur(65px);
          pointer-events: none;
          will-change: transform;
        }

        .nebula-glow-cyan {
          top: -35%;
          left: -15%;
          background: radial-gradient(
            circle,
            rgba(27, 190, 190, 0.17) 0%,
            rgba(20, 130, 155, 0.08) 38%,
            transparent 70%
          );
          animation: nebula-float-1 38s ease-in-out infinite alternate;
        }

        .nebula-glow-blue {
          right: -20%;
          top: 15%;
          background: radial-gradient(
            circle,
            rgba(55, 95, 210, 0.15) 0%,
            rgba(55, 70, 160, 0.07) 40%,
            transparent 70%
          );
          animation: nebula-float-2 46s ease-in-out infinite alternate;
        }

        .nebula-glow-warm {
          bottom: -50%;
          left: 25%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(
            circle,
            rgba(210, 115, 65, 0.09) 0%,
            rgba(180, 90, 55, 0.035) 40%,
            transparent 70%
          );
          animation: nebula-float-3 52s ease-in-out infinite alternate;
        }

        /* Subtle futuristic grid */

        .nebula-grid {
          position: absolute;
          inset: 0;

          background-image:
            linear-gradient(
              rgba(94, 205, 215, 0.055) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(94, 205, 215, 0.055) 1px,
              transparent 1px
            );

          background-size: 56px 56px;

          mask-image: radial-gradient(
            ellipse at 50% 45%,
            black 0%,
            rgba(0,0,0,0.7) 40%,
            transparent 85%
          );

          -webkit-mask-image: radial-gradient(
            ellipse at 50% 45%,
            black 0%,
            rgba(0,0,0,0.7) 40%,
            transparent 85%
          );

          opacity: 0.65;
        }

        /* Tiny static particles */

        .nebula-stars {
          position: absolute;
          inset: 0;

          background-image:
            radial-gradient(
              circle,
              rgba(145, 230, 235, 0.65) 1px,
              transparent 1.5px
            ),
            radial-gradient(
              circle,
              rgba(120, 165, 220, 0.45) 1px,
              transparent 1.5px
            );

          background-size: 137px 137px, 211px 211px;
          background-position: 15px 25px, 80px 105px;

          opacity: 0.23;
        }

        /* Dark edges for depth */

        .nebula-vignette {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              90deg,
              rgba(3, 7, 14, 0.25),
              transparent 25%,
              transparent 75%,
              rgba(3, 7, 14, 0.25)
            ),
            radial-gradient(
              ellipse at center,
              transparent 35%,
              rgba(2, 5, 12, 0.38) 100%
            );
        }

        /* Very slow atmospheric motion */

        @keyframes nebula-float-1 {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(8vw, 5vh, 0);
          }
        }

        @keyframes nebula-float-2 {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-7vw, 8vh, 0);
          }
        }

        @keyframes nebula-float-3 {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(5vw, -6vh, 0);
          }
        }

        /* Mobile optimization */

        @media (max-width: 768px) {
          .nebula-glow {
            filter: blur(40px);
          }

          .nebula-grid {
            background-size: 42px 42px;
            opacity: 0.45;
          }
        }

        /* Accessibility */

        @media (prefers-reduced-motion: reduce) {
          .nebula-glow {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

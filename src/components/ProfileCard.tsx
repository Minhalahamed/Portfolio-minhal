import { useEffect, useState } from "react";

const PROFILE_REF_FRAME = "/Moonlit Solitude.jpeg";

export const ProfileCard = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [glitchPulse, setGlitchPulse] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isHovering) return;
    const id = setInterval(() => {
      setGlitchPulse(true);
      setTimeout(() => setGlitchPulse(false), 120);
    }, 4200);
    return () => clearInterval(id);
  }, [isHovering]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !dragStart) return;
      setDragOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };
    const onPointerUp = () => {
      setIsDragging(false);
      setDragStart(null);
      const decay = setInterval(() => {
        setDragOffset((p) => {
          const nx = p.x * 0.88;
          const ny = p.y * 0.88;
          if (Math.abs(nx) < 0.5 && Math.abs(ny) < 0.5) {
            clearInterval(decay);
            return { x: 0, y: 0 };
          }
          return { x: nx, y: ny };
        });
      }, 16);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, dragStart]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && dragStart) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const rx = Math.max(-12, Math.min(12, (-y / cy) * 8));
    const ry = Math.max(-12, Math.min(12, (x / cx) * 8));
    setRotation({ x: rx, y: ry });
  };

  const handleLeave = () => {
    if (!isDragging) setRotation({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <div className="flex justify-center items-start p-8 pt-20">
      <style>{`
        @keyframes strap-swing {
          0% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
          100% { transform: rotate(-2deg); }
        }

        @keyframes holo-sweep {
          0% { background-position: -60% 50%; }
          100% { background-position: 160% 50%; }
        }

        @keyframes scan {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(150%); }
        }

        @keyframes micro-glitch {
          0% { transform: translate(0); opacity: 1; }
          25% { transform: translate(-1px, 1px); opacity: .95; }
          50% { transform: translate(1px, -1px); opacity: .97; }
          75% { transform: translate(-1px, -1px); opacity: .96; }
          100% { transform: translate(0); opacity: 1; }
        }

        .strap-swing { animation: strap-swing 3.6s ease-in-out infinite; transform-origin: top center; }
        .holo-sweep {
          background: linear-gradient(120deg,
            rgba(0,255,140,0.06) 0%,
            rgba(0,200,255,0.09) 35%,
            rgba(255,255,255,0.06) 50%,
            rgba(255,0,200,0.04) 75%,
            rgba(0,255,140,0.06) 100%);
          background-size: 220% 100%;
          animation: holo-sweep 4.6s linear infinite;
          mix-blend-mode: screen;
          pointer-events: none;
        }
      `}</style>

      <div className="relative " style={{ perspective: 1400 }}>
        {/* Strap & Clip */}
        <div className="absolute left-1/2 -top-24 -translate-x-1/2 flex flex-col  items-center z-[-10] ">
          <div className="relative w-6 h-24 flex flex-col items-center">
            <div
              className="absolute w-1.5 h-24 rounded-full bg-gradient-to-b from-green-400 to-cyan-300 shadow-[0_0_20px_rgba(0,255,150,0.7)] strap-swing"
              style={{ left: "25%" }}
            />
            <div
              className="absolute w-1.5 h-24 rounded-full bg-gradient-to-b from-cyan-300 to-green-400 shadow-[0_0_18px_rgba(0,200,255,0.55)] strap-swing"
              style={{ right: "25%" }}
            />
            <div className="absolute top-6 w-8 h-1 rounded-full bg-gradient-to-r from-green-300 to-cyan-300 opacity-90 shadow-[0_0_10px_rgba(0,255,160,0.45)] strap-swing" />
          </div>

          <div
            className="mt-[-8px] w-12 h-10 rounded-md bg-gradient-to-br from-gray-300 to-gray-600 border border-gray-500 shadow-lg flex items-center justify-center strap-swing"
            style={{ transformOrigin: "top center" }}
          >
            <div className="w-6 h-5 rounded-sm bg-gradient-to-tr from-green-400/70 to-cyan-400/70 border border-gray-400 shadow-inner" />
          </div>

          <div className="mt-1 w-16 h-2 rounded-md bg-black border border-green-500/35 shadow-inner" />
        </div>

        {/* Card */}
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLeave}
          onMouseEnter={() => setIsHovering(true)}
          className="relative w-72 md:w-80 h-[26rem] md:h-[24rem] rounded-3xl overflow-hidden"
          style={{
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isDragging ? "none" : "transform 280ms cubic-bezier(.2,1,.25,1)",
            willChange: "transform",
            boxShadow: isHovering
              ? "0 30px 80px rgba(0,255,160,0.12), inset 0 0 40px rgba(0,255,120,0.02)"
              : "0 20px 50px rgba(0,0,0,0.35)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b0b0b] via-[#0a1010] to-[#020202]" />
          <div className="absolute inset-0 holo-sweep opacity-60 pointer-events-none" />

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute left-0 top-[-40%] w-full h-32 opacity-6"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(0,255,150,0.06) 50%, transparent 100%)",
                animation: "scan 6s linear infinite",
              }}
            />
          </div>

          <div
            className="absolute inset-0 opacity-12 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0,255,140,0.02) 25%, rgba(0,255,140,0.02) 26%, transparent 27%) , linear-gradient(90deg, transparent 24%, rgba(0,255,140,0.02) 25%, rgba(0,255,140,0.02) 26%, transparent 27%)`,
              backgroundSize: "60px 60px",
            }}
          />

          <div
            className="absolute inset-2 rounded-2xl pointer-events-none"
            style={{
              borderRadius: "1rem",
              boxShadow: isHovering
                ? "0 0 60px rgba(0,255,160,0.14), inset 0 0 30px rgba(0,255,160,0.04)"
                : "0 0 28px rgba(0,255,160,0.08), inset 0 0 12px rgba(0,255,160,0.02)",
              border: "1px solid rgba(0,255,160,0.06)",
            }}
          />

          {/* Content - Compact spacing */}
          <div className="relative z-10 flex flex-col h-full backdrop-blur-[2px] p-4">
            {/* Header */}
            <div className="relative text-center mb-3">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400/60" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400/60" />
              <span
                className={`text-[10px] text-green-300/90 uppercase tracking-widest font-semibold ${
                  glitchPulse ? "animate-[micro-glitch_0.14s_linear]" : ""
                }`}
              >
                [CLEARANCE: UNRESTRICTED]
              </span>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400/60" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400/60" />
            </div>

            {/* Profile photo */}
            <div className="flex justify-center mb-3">
              <div className="relative group w-24 h-32 rounded-xl overflow-hidden border-2 border-green-400/60 shadow-[0_0_28px_rgba(0,255,140,0.18)]">
                <img
                  src={PROFILE_REF_FRAME}
                  alt="profile"
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    glitchPulse ? "animate-[micro-glitch_0.14s_linear]" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent via-green-400/18 to-transparent mix-blend-screen animate-[scan_4s_linear_infinite]" />
              </div>
            </div>

            {/* Name & Role */}
            <div className="text-center mb-3">
              <h2 className="text-lg md:text-xl font-mono font-bold text-green-300 tracking-tight">
                MINHAL AHMED
              </h2>
              <p className="text-[10px] md:text-xs text-cyan-200/70 uppercase tracking-wide mt-1">
                &gt; Full Stack Developer
              </p>
              <p className="text-[10px] text-green-200/60 mt-0.5">ID: #0xMA2025001</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/22 rounded-lg p-2">
                <div className="text-[9px] text-green-300/60 uppercase tracking-wider mb-0.5">
                  Department
                </div>
                <div className="text-[10px] text-green-200 font-mono">Full Stack</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-green-500/22 rounded-lg p-2">
                <div className="text-[9px] text-green-300/60 uppercase tracking-wider mb-0.5">
                  Status
                </div>
                <div className="text-[10px] text-green-200 font-mono">Available</div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto">
              <div className="bg-gradient-to-r from-green-400/6 via-cyan-300/6 to-green-400/6 border border-green-500/18 rounded-lg p-2">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-green-300 font-mono animate-pulse">&gt;_</span>
                    <span className="text-green-200/70 font-mono">INTERACTIVE</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/70 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/40 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Corner accents */}
          <div className="pointer-events-none">
            <div className="absolute top-0 left-0 w-10 h-10">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-300 to-transparent" />
              <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-green-300 to-transparent" />
            </div>
            <div className="absolute top-0 right-0 w-10 h-10">
              <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-green-300 to-transparent" />
              <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-green-300 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 w-10 h-10">
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-300 to-transparent" />
              <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-green-300 to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-10 h-10">
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-green-300 to-transparent" />
              <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-green-300 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
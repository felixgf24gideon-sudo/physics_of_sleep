import { motion, useAnimation } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { generateCircadianCurve, dataToSVGSmoothPath, HOUR_LABELS } from '../utils/circadianData';
import { wavelengthToHex } from '../utils/colorConversion';
import { Moon, Sun } from 'lucide-react';

const WIDTH = 600;
const HEIGHT = 160;
const PAD = 24;

export default function CircadianWave({ melatoninLevel, wavelength }) {
  const hex = wavelengthToHex(wavelength);
  const controls = useAnimation();

  const curveData = useMemo(
    () => generateCircadianCurve(melatoninLevel / 100, 120),
    [melatoninLevel]
  );

  const pathD = useMemo(
    () => dataToSVGSmoothPath(curveData, WIDTH, HEIGHT, PAD),
    [curveData]
  );

  // Animate path on change
  useEffect(() => {
    controls.start({ opacity: 1 });
  }, [melatoninLevel]);

  // Wave color: blue when suppressed, teal/green when healthy
  const waveColor = melatoninLevel < 30
    ? '#818cf8'
    : melatoninLevel < 60
    ? '#34d399'
    : '#a78bfa';

  const suppressed = melatoninLevel < 35;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
          Ritme Sirkadian — Kurva Melatonin 24 Jam
        </h3>
      </div>

      <div className="relative glass rounded-2xl p-4 overflow-hidden">
        {/* Grid lines */}
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          style={{ height: 'auto', maxHeight: '160px' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={waveColor} stopOpacity="0.6" />
              <stop offset="50%" stopColor={waveColor} stopOpacity="1" />
              <stop offset="100%" stopColor={waveColor} stopOpacity="0.6" />
            </linearGradient>
            <filter id="waveGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="waveGlowStrong">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((v) => {
            const y = PAD + (HEIGHT - PAD * 2) * (1 - v);
            return (
              <line
                key={v}
                x1={PAD}
                y1={y}
                x2={WIDTH - PAD}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            );
          })}

          {/* Hour tick lines */}
          {HOUR_LABELS.map(({ hour }) => {
            const x = PAD + (hour / 24) * (WIDTH - PAD * 2);
            return (
              <line
                key={hour}
                x1={x}
                y1={PAD}
                x2={x}
                y2={HEIGHT - PAD}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            );
          })}

          {/* Night shading (21:00–07:00) */}
          {(() => {
            const nightStart = PAD + (21 / 24) * (WIDTH - PAD * 2);
            const nightEnd = WIDTH - PAD;
            const dayStart = PAD;
            const dayEnd = PAD + (7 / 24) * (WIDTH - PAD * 2);
            return (
              <>
                <rect
                  x={nightStart}
                  y={PAD}
                  width={nightEnd - nightStart}
                  height={HEIGHT - PAD * 2}
                  fill="rgba(99, 102, 241, 0.08)"
                  rx="4"
                />
                <rect
                  x={dayStart}
                  y={PAD}
                  width={dayEnd - dayStart}
                  height={HEIGHT - PAD * 2}
                  fill="rgba(99, 102, 241, 0.08)"
                  rx="4"
                />
              </>
            );
          })()}

          {/* Glow shadow of wave */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={waveColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.15}
            animate={{ d: pathD, stroke: waveColor }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            filter="url(#waveGlowStrong)"
          />

          {/* Main wave path */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ d: pathD, stroke: waveColor }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />

          {/* Fill under curve */}
          <motion.path
            d={`${pathD} L ${WIDTH - PAD} ${HEIGHT - PAD} L ${PAD} ${HEIGHT - PAD} Z`}
            fill={waveColor}
            opacity={0.04}
            animate={{ d: `${pathD} L ${WIDTH - PAD} ${HEIGHT - PAD} L ${PAD} ${HEIGHT - PAD} Z`, fill: waveColor }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />

          {/* Current time marker — midnight (0h) */}
          {(() => {
            const x = PAD + (2.5 / 24) * (WIDTH - PAD * 2);
            return (
              <>
                <line
                  x1={x}
                  y1={PAD}
                  x2={x}
                  y2={HEIGHT - PAD}
                  stroke={waveColor}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity={0.5}
                />
                <text x={x + 4} y={PAD + 10} fill={waveColor} fontSize="8" opacity={0.7}>
                  Puncak 02.30
                </text>
              </>
            );
          })()}
        </svg>

        {/* Hour labels below chart */}
        <div className="flex justify-between px-4 mt-1">
          {HOUR_LABELS.map(({ hour, label }) => (
            <span key={hour} className="text-[9px] text-white/30 font-medium font-mono">
              {label}
            </span>
          ))}
        </div>

        {/* Night zone indicators */}
        <div className="flex justify-between px-4 mt-1 text-[9px] text-indigo-400/60 font-medium">
          <span className="flex items-center gap-1"><Moon size={10} strokeWidth={1.5} /> Malam</span>
          <span className="flex items-center gap-1"><Sun size={10} strokeWidth={1.5} /> Siang</span>
          <span className="flex items-center gap-1"><Moon size={10} strokeWidth={1.5} /> Malam</span>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { wavelengthToHex } from '../utils/colorConversion';
import { Moon, Zap, Scale } from 'lucide-react';

/**
 * Circular gauge showing melatonin production level.
 * melatoninLevel: 0.0 (suppressed) to 1.0 (full production)
 */
export default function MelatoninGauge({ melatoninLevel, wavelength }) {
  const hex = wavelengthToHex(wavelength);

  // SVG arc parameters
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degree arc

  // Melatonin level controls how much of the arc is filled
  const fillLength = arcLength * melatoninLevel;
  const gapLength = arcLength - fillLength;

  // Color gradient: red (danger) → amber → green (good for sleep)
  const gaugeColor = melatoninLevel < 0.3
    ? '#ef4444'
    : melatoninLevel < 0.55
      ? '#f59e0b'
      : '#4ade80';

  const percent = Math.round(melatoninLevel * 100);
  const status = melatoninLevel < 0.3 ? 'Supresi Kritis' : melatoninLevel < 0.55 ? 'Terdisrupsi' : 'Optimal';

  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
        Produksi Melatonin
      </h3>

      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(135deg)' }}
        >
          {/* Background arc (track) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeDashoffset={0}
          />

          {/* Glow layer */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth + 8}
            strokeLinecap="round"
            strokeDasharray={`${fillLength} ${circumference - fillLength}`}
            strokeDashoffset={0}
            opacity={0.15}
            animate={{ strokeDasharray: `${fillLength} ${circumference - fillLength}` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* Filled arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeDashoffset={0}
            style={{
              stroke: gaugeColor,
              strokeDasharray: `${fillLength} ${circumference - fillLength}`,
            }}
            animate={{
              stroke: gaugeColor,
              strokeDasharray: `${fillLength} ${circumference - fillLength}`,
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ paddingBottom: '18px' }}
        >
          {/* Moon icon */}
          <motion.div
            animate={{ color: gaugeColor }}
            className="mb-1"
          >
            <Moon size={32} strokeWidth={1.5} color={gaugeColor} />
          </motion.div>

          <motion.span
            animate={{ color: gaugeColor }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold leading-none font-mono"
            style={{
              textShadow: `0 0 20px ${gaugeColor}88`,
            }}
          >
            {percent}%
          </motion.span>

          <motion.span
            animate={{ color: gaugeColor }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-90"
          >
            {status}
          </motion.span>
        </div>
      </div>

      {/* Tick labels */}
      <div className="flex justify-between w-full px-6 -mt-6 text-xs text-white/30 font-medium font-mono">
        <span>0%</span>
        <span className="font-sans">Optimal tidur</span>
        <span>100%</span>
      </div>

      {/* Sub-info - Simplified (No background/border) */}
      <motion.div
        animate={{ color: gaugeColor }}
        transition={{ duration: 0.5 }}
        className="mt-4 flex items-center gap-2 text-xs font-semibold"
      >
        {melatoninLevel < 0.3 ? (
          <>
            <Zap size={14} strokeWidth={2} />
            <span>Melatonin ditekan oleh cahaya pendek</span>
          </>
        ) : melatoninLevel < 0.55 ? (
          <>
            <Scale size={14} strokeWidth={2} />
            <span>Produksi melatonin  terganggu</span>
          </>
        ) : (
          <>
            <Moon size={14} strokeWidth={2} />
            <span className="opacity-80">Melatonin Optimal. Amigdala dalam mode istirahat, tubuh siap memasuki fase pemulihan saraf</span>
          </>
        )}
      </motion.div>
    </div>
  );
}

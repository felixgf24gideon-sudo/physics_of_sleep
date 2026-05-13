import { motion } from 'framer-motion';
import { wavelengthToRGB, wavelengthToHex } from '../utils/colorConversion';
import { useMemo } from 'react';

/**
 * Full-screen animated background with a cosmic universe theme.
 * Includes twinkling stars, planets, and wavelength-based glowing nebulae.
 */
export default function BackgroundGlow({ wavelength }) {
  const { r, g, b } = wavelengthToRGB(wavelength);
  const hex = wavelengthToHex(wavelength);

  // Background colors based on wavelength
  const bgColor = `rgba(${Math.round(r * 0.08)}, ${Math.round(g * 0.08)}, ${Math.round(b * 0.12)}, 1)`;
  const nebulaColor = `rgba(${r}, ${g}, ${b}, 0.08)`;
  const orbColor = `rgba(${r}, ${g}, ${b}, 0.15)`;

  // Generate stable random stars
  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <motion.div
      className="fixed inset-0 -z-10 overflow-hidden bg-[#020208]"
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 1.2 }}
    >
      {/* Nebulae / Glow Clouds */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[120px]"
        animate={{ backgroundColor: nebulaColor }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full blur-[100px]"
        animate={{ backgroundColor: orbColor }}
        transition={{ duration: 1.5 }}
      />

      {/* Starfield */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Ringed Planet (Saturn Style) */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute top-[15%] right-[10%] w-16 h-16 pointer-events-none"
      >
        {/* The Planet Body */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-900 shadow-xl z-10" />
        
        {/* The Ring */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[30%] border-[3px] border-zinc-500/40 rounded-[100%] rotate-[25deg] z-20"
          style={{ boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[20%] border border-zinc-400/20 rounded-[100%] rotate-[25deg] z-0"
        />

        {/* Subtle glow */}
        <div className="absolute inset-[-10px] rounded-full bg-white/5 blur-md" />
      </motion.div>

      {/* Small Distant Planet */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.6,
          y: [0, -15, 0],
          x: [0, 5, 0]
        }}
        transition={{
          opacity: { duration: 2 },
          y: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 20, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-[25%] left-[15%] w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-900 via-slate-800 to-zinc-700 pointer-events-none"
      >
        <div className="absolute inset-0 rounded-full shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.8)]" />
      </motion.div>

      {/* Distant Nebula Dust */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </motion.div>
  );
}


import { motion, useSpring, useTransform } from 'framer-motion';
import { wavelengthToRGBString, wavelengthToHex } from '../utils/colorConversion';
import { useEffect, useRef } from 'react';

export default function WavelengthSlider({ wavelength, onChange }) {
  const sliderRef = useRef(null);
  const color = wavelengthToRGBString(wavelength);
  const hex = wavelengthToHex(wavelength);

  // Update CSS custom properties for thumb color and glow
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--thumb-color', hex);
      sliderRef.current.style.setProperty('--thumb-glow', `${hex}cc`);
    }
  }, [hex]);

  const percent = ((wavelength - 380) / (750 - 380)) * 100;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Large wavelength display */}
      <div className="text-center">
        <motion.div
          key={Math.round(wavelength)}
          initial={{ scale: 0.92, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="inline-flex flex-col items-center"
        >
          <motion.span
            className="text-8xl font-extrabold leading-none tracking-tight font-mono"
            style={{ color, textShadow: `0 0 40px ${hex}99, 0 0 80px ${hex}44` }}
          >
            {Math.round(wavelength)}
          </motion.span>
          <span className="text-2xl font-semibold text-white/50 mt-1 tracking-widest font-mono">nm</span>
        </motion.div>

        {/* Wavelength label */}
        <motion.p
          animate={{ color }}
          transition={{ duration: 0.4 }}
          className="text-sm font-medium mt-3 tracking-wider uppercase opacity-80"
          style={{ color }}
        >
          λ — Panjang Gelombang Cahaya
        </motion.p>
      </div>

      {/* Slider container */}
      <div className="relative px-2">
        {/* Glow backdrop under slider */}
        <motion.div
          animate={{ backgroundColor: `${hex}25` }}
          transition={{ duration: 0.5 }}
          className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-8 rounded-full blur-xl"
        />

        {/* Track labels */}
        <div className="flex justify-between text-xs text-white/30 mb-2 font-medium px-1">
          <span>380 nm</span>
          <span></span>
          <span>750 nm</span>
        </div>

        {/* The slider itself */}
        <input
          ref={sliderRef}
          type="range"
          min="380"
          max="750"
          step="1"
          value={wavelength}
          onChange={(e) => onChange(Number(e.target.value))}
          className="spectrum-slider w-full relative z-10"
        />

        {/* Position indicator dot below slider */}
        <div className="relative mt-3 h-1">
          <motion.div
            animate={{ left: `calc(${percent}% - 6px)` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="absolute top-0 w-3 h-3 rounded-full"
            style={{ backgroundColor: hex, boxShadow: `0 0 10px 4px ${hex}88` }}
          />
        </div>

        {/* Key markers */}
        <div className="flex justify-between text-xs mt-4 px-1">
          {[
            { nm: 380, label: 'UV', color: '#8b00ff' },
            { nm: 450, label: 'Blue Peak', color: '#4488ff' },
            { nm: 550, label: 'Hijau', color: '#44ff88' },
            { nm: 650, label: 'Merah', color: '#ff4444' },
            { nm: 750, label: 'IR', color: '#880000' },
          ].map(({ nm, label, color: c }) => {
            const pos = ((nm - 380) / (750 - 380)) * 100;
            const isActive = Math.abs(wavelength - nm) < 30;
            return (
              <div key={nm} className="flex flex-col items-center gap-1">
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.35, scale: isActive ? 1.1 : 1 }}
                  className="w-px h-2 rounded-full"
                  style={{ backgroundColor: c }}
                />
                <motion.span
                  animate={{ opacity: isActive ? 1 : 0.35, color: isActive ? c : '#ffffff55' }}
                  className="text-[10px] font-semibold"
                >
                  {label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

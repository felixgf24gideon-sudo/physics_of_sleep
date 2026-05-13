import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import BackgroundGlow from './components/BackgroundGlow';
import WavelengthSlider from './components/WavelengthSlider';
import MelatoninGauge from './components/MelatoninGauge';
import CircadianWave from './components/CircadianWave';
import InfoBox from './components/InfoBox';
import { getMelatoninLevel, wavelengthToHex } from './utils/colorConversion';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [wavelength, setWavelength] = useState(450);

  const melatoninLevel = useMemo(() => getMelatoninLevel(wavelength), [wavelength]);
  const hex = useMemo(() => wavelengthToHex(wavelength), [wavelength]);

  return (
    <div className="min-h-screen font-sans text-white selection:bg-white/10">
      {/* Animated background */}
      <BackgroundGlow wavelength={wavelength} />

      {/* === HEADER === */}
      <header className="relative z-10 pt-10 pb-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <motion.div
              animate={{ backgroundColor: hex }}
              className="w-1.5 h-1.5 rounded-full"
              transition={{ duration: 0.5 }}
            />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-white/40">
              Psikoedukasi Interaktif
            </span>
            <motion.div
              animate={{ backgroundColor: hex }}
              className="w-1.5 h-1.5 rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            <span className="text-white">The </span>
            <motion.span
              animate={{ color: hex, textShadow: `0 0 30px ${hex}66` }}
              transition={{ duration: 0.5 }}
            >
              Physics
            </motion.span>
            <span className="text-white"> of Sleep</span>
          </h1>
          <p className="text-sm text-white/40 font-medium max-w-md mx-auto leading-relaxed">
            Geser slider untuk mengeksplorasi bagaimana panjang gelombang cahaya
            mempengaruhi ritme sirkadian dan produksi melatonin.
          </p>
        </motion.div>
      </header>

      {/* === MAIN CONTENT (BENTO GRID) === */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === ROW 1: SLIDER CARD (Glassmorphism) === */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3 glass-control p-8 md:p-10"
          >
            {/* Colored top border */}
            <motion.div
              animate={{ background: `linear-gradient(90deg, transparent, ${hex}88, transparent)` }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-12 right-12 h-px rounded-full"
            />
            <WavelengthSlider wavelength={wavelength} onChange={setWavelength} />
          </motion.section>

          {/* === ROW 2: GAUGE + INFO BOX (Bento Cards - Equal Height) === */}
          {/* Melatonin Gauge */}
          <motion.section
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bento-card p-8 flex flex-col items-center justify-center relative overflow-hidden h-full"
          >
            {/* Subtle glow corner */}
            <motion.div
              animate={{ backgroundColor: hex }}
              className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none"
              transition={{ duration: 0.5 }}
            />
            <MelatoninGauge melatoninLevel={melatoninLevel} wavelength={wavelength} />
          </motion.section>

          {/* Info Box */}
          <motion.section
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 bento-card p-8 flex flex-col h-full"
          >
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
              Efek Neurologis
            </h3>
            <div className="flex-1">
              <InfoBox wavelength={wavelength} />
            </div>
          </motion.section>

          {/* === ROW 3: CIRCADIAN WAVE (Bento Cards) === */}
          {/* Circadian Wave */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bento-card p-8 flex flex-col justify-center relative overflow-hidden"
          >
             {/* Subtle glow corner */}
             <motion.div
              animate={{ backgroundColor: hex }}
              className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
              transition={{ duration: 0.5 }}
            />
            <CircadianWave melatoninLevel={melatoninLevel} wavelength={wavelength} />
          </motion.section>



        </div>

        {/* === FOOTER === */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center pt-8 pb-4"
        >
          <p className="text-xs text-white/30 font-medium">
            The Physics of Sleep · Tugas Psikoedukasi · Dibuat dengan React + Framer Motion
          </p>
          <p className="text-xs text-white/20 mt-1.5">
            Referensi Brainard et al. (2001), melanopsin peak sensitivity ~480 nm
          </p>
        </motion.footer>

      </main>
    </div>
  );
}

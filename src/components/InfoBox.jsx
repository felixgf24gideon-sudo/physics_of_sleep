import { motion, AnimatePresence } from 'framer-motion';
import { getZoneInfo, getLightSource } from '../utils/colorConversion';
import * as LucideIcons from 'lucide-react';

export default function InfoBox({ wavelength }) {
  const info = getZoneInfo(wavelength);
  const lightSource = getLightSource(wavelength);
  const isDanger = info.level === 'DANGER';
  const IconComponent = LucideIcons[info.iconName] || LucideIcons.Info;
  const Lightbulb = LucideIcons.Lightbulb;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={info.title + lightSource.key}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col items-start text-left"
      >
        {/* Header - Dynamic Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <IconComponent size={24} color={info.color} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
            {info.title}
          </h3>
        </div>

        {/* 1. Main Content: Scientific Description */}
        <div className="space-y-5">
          <p className="text-base text-zinc-300 leading-relaxed font-medium">
            {info.body}
          </p>

          {/* Danger Indicator - Minimalist */}
          {isDanger && (
            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-2 h-2 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <p className="text-sm text-red-400 font-semibold uppercase tracking-wider">
                Amigdala aktif • Respons stres meningkat
              </p>
            </div>
          )}
        </div>

        {/* 2. Saran Section - Subtle Box Style */}
        <div className="w-full mt-8">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/[0.03]">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-yellow-500/10 mt-0.5">
                <Lightbulb size={20} className="text-yellow-500/70" strokeWidth={2} />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-zinc-200">Saran</p>
                <p className="text-base font-bold text-zinc-200 leading-relaxed">
                  {info.tip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Metadata Footer: Data Source */}
        <div className="mt-auto pt-8 w-full">
          <hr className="border-zinc-800/50 mb-4" />
          <div className="space-y-3">
            <p className="text-base font-bold text-zinc-400">
              <span className="text-zinc-500 uppercase tracking-wider text-xs block mb-1">Sumber Cahaya</span>
              {lightSource.source}
            </p>
            <p className="text-sm font-bold text-zinc-500 leading-relaxed border-l-2 border-zinc-700 pl-4 py-1">
              Simulasi ini mengasumsikan intensitas cahaya 100 lux (setara ruang tamu terang) dan durasi pajanan ~1-2 jam. Hasil bersifat estimasi edukasi, bukan presisi klinis.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}




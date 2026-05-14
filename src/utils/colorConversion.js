/**
 * Converts a visible light wavelength (nm) to an approximate RGB color.
 * Based on the classic Bruton's algorithm adapted for smooth rendering.
 * @param {number} wavelength - in nanometers (380–750)
 * @returns {{ r: number, g: number, b: number }} - values 0–255
 */
export function wavelengthToRGB(wavelength) {
  let r, g, b;
  const gamma = 0.8;
  let factor;

  const w = wavelength;

  if (w >= 380 && w < 440) {
    r = -(w - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (w >= 440 && w < 490) {
    r = 0.0;
    g = (w - 440) / (490 - 440);
    b = 1.0;
  } else if (w >= 490 && w < 510) {
    r = 0.0;
    g = 1.0;
    b = -(w - 510) / (510 - 490);
  } else if (w >= 510 && w < 580) {
    r = (w - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (w >= 580 && w < 645) {
    r = 1.0;
    g = -(w - 645) / (645 - 580);
    b = 0.0;
  } else if (w >= 645 && w <= 750) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else {
    r = 0.0;
    g = 0.0;
    b = 0.0;
  }

  // Intensity correction (fade at edges of spectrum)
  if (w >= 380 && w < 420) {
    factor = 0.3 + 0.7 * (w - 380) / (420 - 380);
  } else if (w >= 420 && w <= 700) {
    factor = 1.0;
  } else if (w > 700 && w <= 750) {
    factor = 0.3 + 0.7 * (750 - w) / (750 - 700);
  } else {
    factor = 0.0;
  }

  const toInt = (v) => v <= 0 ? 0 : Math.round(255 * Math.pow(v * factor, gamma));

  return {
    r: toInt(r),
    g: toInt(g),
    b: toInt(b),
  };
}

/**
 * @param {number} wavelength
 * @returns {string} CSS hex color
 */
export function wavelengthToHex(wavelength) {
  const { r, g, b } = wavelengthToRGB(wavelength);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Returns a CSS rgb() string for use in styles.
 */
export function wavelengthToRGBString(wavelength) {
  const { r, g, b } = wavelengthToRGB(wavelength);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Melatonin production efficiency (0% = fully suppressed, 100% = normal/high production).
 * Based on Brainard et al. (2001) action spectrum and Phillips et al. (2019) dose-response model.
 * 
 * DISCLAIMER:
 * Intensitas diasumsikan tetap 100 lux (asumsi ruangan tipikal).
 * Hasil ini adalah estimasi untuk tujuan edukasi saja, bukan saran medis.
 * 
 * @param {number} wavelength - in nanometers (nm)
 * @returns {number} 0–100 (percentage)
 */
export function getMelatoninLevel(wavelength) {
  const ACTION_SPECTRUM = [
    { nm: 400, sens: 0.02 }, { nm: 420, sens: 0.08 }, { nm: 440, sens: 0.27 },
    { nm: 460, sens: 0.74 }, { nm: 480, sens: 1.00 }, { nm: 500, sens: 0.50 },
    { nm: 520, sens: 0.12 }, { nm: 540, sens: 0.02 }, { nm: 560, sens: 0.01 },
    { nm: 580, sens: 0.005 }, { nm: 600, sens: 0.001 }
  ];

  let sens;

  // Interpolation logic
  if (wavelength < 400) {
    sens = 0.02;
  } else if (wavelength <= 600) {
    // Find the range in ACTION_SPECTRUM
    let i = 0;
    while (i < ACTION_SPECTRUM.length - 1 && wavelength > ACTION_SPECTRUM[i + 1].nm) {
      i++;
    }
    const p1 = ACTION_SPECTRUM[i];
    const p2 = ACTION_SPECTRUM[i + 1];
    
    // Linear interpolation
    const t = (wavelength - p1.nm) / (p2.nm - p1.nm);
    sens = p1.sens + t * (p2.sens - p1.sens);
  } else if (wavelength <= 700) {
    // Boundary rule: Linear decrease to 0 at 700nm
    const t = (wavelength - 600) / 100;
    sens = 0.001 * (1 - t);
  } else {
    sens = 0;
  }

  /**
   * Dose-response model (Phillips et al. 2019)
   * efficiency = 100 / (1 + (I_eff / I50)^b)
   * I_eff = intensity * relative_sensitivity
   */
  const intensity = 100; // Fixed assumption (lux)
  const I50 = 70; // Half-maximal suppression (melanopic lux)
  const b = 1.5; // Slope parameter

  const I_eff = intensity * sens;
  const efficiency = 100 / (1 + Math.pow(I_eff / I50, b));

  // Clamp output between 0-100
  return Math.max(0, Math.min(100, efficiency));
}

/**
 * Returns a descriptive zone for the current wavelength.
 */
export function getLightZone(wavelength) {
  if (wavelength >= 380 && wavelength < 420) return 'violet';
  if (wavelength >= 420 && wavelength < 500) return 'blue';
  if (wavelength >= 500 && wavelength < 550) return 'green';
  if (wavelength >= 550 && wavelength < 590) return 'yellow';
  if (wavelength >= 590 && wavelength < 620) return 'orange';
  if (wavelength >= 620 && wavelength <= 750) return 'red';
  return 'infrared';
}

/**
 * Returns info content for each zone.
 */
export function getZoneInfo(wavelength) {
  const zone = getLightZone(wavelength);
  const infos = {
    violet: {
      level: 'SAFE',
      iconName: 'Shield',
      color: '#c084fc',
      title: 'Cahaya Violet — Efek Minimal',
      body: 'Paparan violet dalam intensitas ruangan normal memiliki efek sangat kecil pada melatonin. Namun pada intensitas tinggi (misal sinar UV), dapat memicu stres oksidatif pada mata. Untuk tidur, violet tidak mengganggu signifikan.',
      tip: 'Hindari paparan violet intensitas tinggi (misal lampu UV) di malam hari.',
      vibrate: false,
    },
    blue: {
      level: 'DANGER',
      iconName: 'TriangleAlert',
      color: '#60a5fa',
      title: 'Cahaya Biru — Disrupsi Melanopsin',
      body: 'Cahaya biru (450–500 nm) adalah musuh utama tidur. Fotoreseptor melanopsin di retina sangat sensitif di rentang ini, mengirim sinyal ke SCN (Suprachiasmatic Nucleus) untuk menghentikan produksi melatonin. Efek paling kuat pada panjang gelombang ~480 nm.',
      tip: 'Matikan layar 2 jam sebelum tidur atau gunakan mode malam.',
      vibrate: true,
    },
    green: {
      level: 'CAUTION',
      iconName: 'AlertCircle',
      color: '#4ade80',
      title: 'Cahaya Hijau — Efek Rendah-Sedang',
      body: 'Cahaya hijau memiliki efek rendah hingga sedang tergantung panjang gelombang (500 nm masih cukup sensitif, 530 nm sudah sangat rendah). Pada intensitas ruangan biasa, gangguan melatonin minimal.',
      tip: 'Kurangi kecerahan layar dan aktifkan warm tone filter.',
      vibrate: false,
    },
    yellow: {
      level: 'NEUTRAL',
      iconName: 'SunDim',
      color: '#facc15',
      title: 'Cahaya Kuning — Zona Aman Malam',
      body: 'Cahaya kuning dengan intensitas ruangan normal hampir tidak menekan melatonin. Cocok untuk pencahayaan malam asalkan tidak terlalu terang.',
      tip: 'Gunakan lampu kuning redup sebagai pencahayaan malam.',
      vibrate: false,
    },
    orange: {
      level: 'SAFE',
      iconName: 'Moon',
      color: '#fb923c',
      title: 'Cahaya Oranye — Ideal Malam',
      body: 'Cahaya oranye tidak mengganggu produksi melatonin yang sudah berlangsung. Ideal untuk pencahayaan malam karena tidak menekan ritme alami tubuh.',
      tip: 'Cahaya lilin atau lampu amber sangat ideal untuk ritual sebelum tidur.',
      vibrate: false,
    },
    red: {
      level: 'SAFE',
      iconName: 'MoonStar',
      color: '#f87171',
      title: 'Spektrum Merah — Induksi Tidur',
      body: 'Cahaya merah adalah yang paling tidak mengganggu ritme sirkadian. Paparan cahaya inframerah-merah justru membantu relaksasi otot dan memperdalam kualitas tidur restoratif. Namun hindari cahaya merah yang terlalu terang (>500 lux) karena tetap dapat memberi efek kecil.',
      tip: 'Terapi cahaya merah terbukti meningkatkan kualitas tidur atlet secara signifikan.',
      vibrate: false,
    },
    infrared: {
      level: 'SAFE',
      iconName: 'Thermometer',
      color: '#ff4444',
      title: 'Spektrum Inframerah — Termal',
      body: 'Tidak terdeteksi oleh fotoreseptor manusia. Tidak mempengaruhi melatonin. Cocok untuk terapi panas, namun tidak terkait tidur.',
      tip: 'Tidak berpengaruh pada ritme sirkadian.',
      vibrate: false,
    },
  };
  return infos[zone];
}

/**
 * Returns dynamic light source info based on wavelength.
 */
export function getLightSource(wavelength) {
  if (wavelength >= 380 && wavelength < 420) {
    return { key: 'violet', label: 'Violet', source: 'Lampu Blacklight, Sterilisator UV, Lampu Laboratorium Spesialis.' };
  } else if (wavelength >= 420 && wavelength < 500) {
    return { key: 'blue', label: 'Biru', source: 'Layar Smartphone, Monitor Laptop, Lampu LED Cool White, Langit Siang Hari.' };
  } else if (wavelength >= 500 && wavelength < 570) {
    return { key: 'green', label: 'Hijau', source: 'Lampu Indikator Elektronik, Laser Hijau, Pantulan Klorofil Daun.' };
  } else if (wavelength >= 570 && wavelength < 620) {
    return { key: 'yellow/warm', label: 'Kuning/Hangat', source: 'Lampu Pijar (Incandescent), Cahaya Lilin, Lampu Jalan Natrium, Sinar Matahari Sore.' };
  } else if (wavelength >= 620 && wavelength <= 750) {
    return { key: 'red', label: 'Merah', source: 'Lampu Terapi Inframerah, Sinar Matahari Terbenam (Sunset), Lampu Belakang Kendaraan.' };
  } else {
    return { key: 'infrared', label: 'Inframerah', source: 'Remote Kontrol, Lampu Terapi Panas, CCTV Night Vision.' };
  }
}

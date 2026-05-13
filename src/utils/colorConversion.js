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
 * Melatonin suppression level (0 = fully suppressed, 1 = normal/high production).
 * Based on physiological research:
 * - 400–500 nm (blue/violet): High suppression → low melatonin
 * - 500–600 nm (green/yellow): Moderate suppression
 * - 600–750 nm (warm/red): Low suppression → high melatonin
 * @param {number} wavelength
 * @returns {number} 0.0–1.0
 */
export function getMelatoninLevel(wavelength) {
  if (wavelength >= 400 && wavelength < 500) {
    // Blue zone: strong suppression, scale 0.05–0.25
    const t = (wavelength - 400) / 100;
    return 0.05 + t * 0.20;
  } else if (wavelength >= 500 && wavelength < 600) {
    // Transition zone: moderate, scale 0.25–0.65
    const t = (wavelength - 500) / 100;
    return 0.25 + t * 0.40;
  } else if (wavelength >= 600 && wavelength <= 750) {
    // Warm/red zone: low suppression, scale 0.65–0.95
    const t = (wavelength - 600) / 150;
    return 0.65 + t * 0.30;
  } else if (wavelength < 400) {
    return 0.05;
  }
  return 0.95;
}

/**
 * Returns a descriptive zone for the current wavelength.
 */
export function getLightZone(wavelength) {
  if (wavelength >= 380 && wavelength < 450) return 'violet';
  if (wavelength >= 450 && wavelength < 500) return 'blue';
  if (wavelength >= 500 && wavelength < 560) return 'green';
  if (wavelength >= 560 && wavelength < 590) return 'yellow';
  if (wavelength >= 590 && wavelength < 625) return 'orange';
  return 'red';
}

/**
 * Returns info content for each zone.
 */
export function getZoneInfo(wavelength) {
  const zone = getLightZone(wavelength);
  const infos = {
    violet: {
      level: 'DANGER',
      iconName: 'TriangleAlert',
      color: '#c084fc',
      title: 'Cahaya Violet — Amigdala Terstimulasi',
      body: 'Panjang gelombang sangat pendek ini mengaktifkan respons stres di amigdala. Paparan malam hari menekan melatonin secara agresif, mengganggu siklus tidur REM.',
      tip: 'Hindari layar dengan filter biru mati pada malam hari.',
      vibrate: true,
    },
    blue: {
      level: 'DANGER',
      iconName: 'TriangleAlert',
      color: '#60a5fa',
      title: 'Cahaya Biru — Disrupsi Amigdala',
      body: 'Cahaya biru (450–500 nm) adalah musuh utama tidur. Fotoreseptor melanopsin di retina sangat sensitif di rentang ini, mengirim sinyal ke SCN (Suprachiasmatic Nucleus) untuk menghentikan produksi melatonin.',
      tip: 'Matikan layar 2 jam sebelum tidur atau gunakan mode malam.',
      vibrate: true,
    },
    green: {
      level: 'CAUTION',
      iconName: 'AlertCircle',
      color: '#4ade80',
      title: 'Cahaya Hijau — Transisi Sirkadian',
      body: 'Cahaya hijau memiliki efek sedang terhadap sistem sirkadian. Produksi melatonin mulai meningkat, namun belum optimal untuk mempersiapkan tubuh tidur.',
      tip: 'Kurangi kecerahan layar dan aktifkan warm tone filter.',
      vibrate: false,
    },
    yellow: {
      level: 'NEUTRAL',
      iconName: 'SunDim',
      color: '#facc15',
      title: 'Cahaya Kuning — Zona Transisi',
      body: 'Spektrum kuning memberikan sinyal ambivalen pada hipotalamus. Tubuh mulai mempersiapkan fase pre-sleep, namun ritme sirkadian belum sepenuhnya sinkron.',
      tip: 'Gunakan lampu kuning redup sebagai pencahayaan malam.',
      vibrate: false,
    },
    orange: {
      level: 'SAFE',
      iconName: 'Moon',
      color: '#fb923c',
      title: 'Cahaya Oranye — Inisiasi Kantuk',
      body: 'Panjang gelombang oranye mengaktifkan produksi melatonin. Kelenjar pineal mulai menyekresikan hormon ini ke aliran darah, mempersiapkan tubuh untuk masuk ke tidur N-REM.',
      tip: 'Cahaya lilin atau lampu amber sangat ideal untuk ritual sebelum tidur.',
      vibrate: false,
    },
    red: {
      level: 'SAFE',
      iconName: 'MoonStar',
      color: '#f87171',
      title: 'Spektrum Merah — Induksi Tidur',
      body: 'Cahaya merah adalah yang paling tidak mengganggu ritme sirkadian. Paparan cahaya inframerah-merah justru membantu relaksasi otot dan memperdalam kualitas tidur restoratif.',
      tip: 'Terapi cahaya merah terbukti meningkatkan kualitas tidur atlet secara signifikan.',
      vibrate: false,
    },
  };
  return infos[zone];
}

/**
 * Returns dynamic light source info based on wavelength.
 */
export function getLightSource(wavelength) {
  if (wavelength >= 380 && wavelength < 450) {
    return { key: 'violet', label: 'Violet', source: 'Lampu Blacklight, Sterilisator UV, Lampu Laboratorium Spesialis.' };
  } else if (wavelength >= 450 && wavelength < 500) {
    return { key: 'blue', label: 'Biru', source: 'Layar Smartphone, Monitor Laptop, Lampu LED Cool White, Langit Siang Hari.' };
  } else if (wavelength >= 500 && wavelength < 570) {
    return { key: 'green', label: 'Hijau', source: 'Lampu Indikator Elektronik, Laser Hijau, Pantulan Klorofil Daun.' };
  } else if (wavelength >= 570 && wavelength < 620) {
    return { key: 'yellow/warm', label: 'Kuning/Hangat', source: 'Lampu Pijar (Incandescent), Cahaya Lilin, Lampu Jalan Natrium, Sinar Matahari Sore.' };
  } else {
    return { key: 'red', label: 'Merah', source: 'Lampu Terapi Inframerah, Sinar Matahari Terbenam (Sunset), Lampu Belakang Kendaraan.' };
  }
}

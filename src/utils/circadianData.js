/**
 * Generates circadian rhythm (melatonin secretion) curve data over 24 hours.
 * Normal melatonin: peaks around 2–3 AM, lowest at noon.
 * 
 * @param {number} suppressionFactor - 0.0 (fully suppressed) to 1.0 (normal)
 * @param {number} points - number of data points to generate
 * @returns {Array<{hour: number, value: number}>}
 */
export function generateCircadianCurve(suppressionFactor = 1.0, points = 200) {
  const data = [];
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * 24; // hours 0–24
    
    // Base melatonin curve: cosine centered at 2:30 AM (2.5h)
    // Peaks at ~2.5h and ~26.5h (next day), lowest at ~14.5h
    const baseAngle = ((t - 2.5) / 24) * 2 * Math.PI;
    const baseMelatonin = 0.5 - 0.5 * Math.cos(baseAngle);
    
    // Only melatonin is secreted at night (roughly 9PM–7AM)
    let nightFactor;
    if (t >= 21 || t <= 7) {
      // Nighttime — full melatonin window
      nightFactor = 1.0;
    } else if (t > 7 && t <= 9) {
      // Morning taper
      nightFactor = 1.0 - (t - 7) / 2;
    } else if (t > 19 && t < 21) {
      // Evening rise
      nightFactor = (t - 19) / 2;
    } else {
      // Daytime — minimal
      nightFactor = 0.05;
    }
    
    const naturalValue = baseMelatonin * nightFactor;
    
    // Apply suppression: high suppression = flat, low amplitude
    const finalValue = naturalValue * suppressionFactor;
    
    data.push({ hour: t, value: finalValue });
  }
  return data;
}

/**
 * Converts circadian data array to an SVG polyline points string.
 * @param {Array<{hour: number, value: number}>} data
 * @param {number} width - SVG viewbox width
 * @param {number} height - SVG viewbox height
 * @param {number} padding - padding from edges
 */
export function dataToSVGPath(data, width, height, padding = 20) {
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = data.map(({ hour, value }) => {
    const x = padding + (hour / 24) * innerW;
    const y = padding + innerH - value * innerH; // invert Y
    return `${x},${y}`;
  });

  return points.join(' ');
}

/**
 * Converts circadian data to a smooth SVG cubic bezier path string.
 */
export function dataToSVGSmoothPath(data, width, height, padding = 20) {
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const coords = data.map(({ hour, value }) => ({
    x: padding + (hour / 24) * innerW,
    y: padding + innerH - value * innerH,
  }));

  if (coords.length < 2) return '';

  let d = `M ${coords[0].x} ${coords[0].y}`;
  
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  return d;
}

/**
 * Get hour labels for display on chart.
 */
export const HOUR_LABELS = [
  { hour: 0, label: '00.00' },
  { hour: 6, label: '06.00' },
  { hour: 12, label: '12.00' },
  { hour: 18, label: '18.00' },
  { hour: 24, label: '24.00' },
];

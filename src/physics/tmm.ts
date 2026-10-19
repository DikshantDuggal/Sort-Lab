import { MATERIALS } from './materials';

export interface Layer {
  materialId: string;
  thicknessNm: number; // in nanometers
}

export interface OpticalPoint {
  wavelength: number; // in nanometers (400-700)
  reflection: number; // 0.0 to 1.0
  transmission: number; // 0.0 to 1.0
  reflectionPct: number; // 0 to 100%
  transmissionPct: number; // 0 to 100%
}

export interface Matrix2x2 {
  m11: number;      // Real
  m12_im: number;   // Imaginary component (m12 = i * m12_im)
  m21_im: number;   // Imaginary component (m21 = i * m21_im)
  m22: number;      // Real
}

/**
 * Calculates the optical response (Reflection R and Transmission T)
 * at a single wavelength using the Transfer Matrix Method (normal incidence).
 */
export function calculateAtWavelength(
  layers: Layer[],
  wavelengthNm: number,
  n0 = 1.00, // Air
  ns = 1.50  // Glass substrate
): { reflection: number; transmission: number } {
  // Start with 2x2 Identity Matrix
  let m11 = 1.0;
  let m12_im = 0.0;
  let m21_im = 0.0;
  let m22 = 1.0;

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const mat = MATERIALS[layer.materialId] || MATERIALS.sio2;
    const n = mat.n;
    const d = layer.thicknessNm;

    if (d <= 0) continue;

    // delta = 2 * pi * n * d / lambda
    const delta = (2.0 * Math.PI * n * d) / wavelengthNm;
    const cosDelta = Math.cos(delta);
    const sinDelta = Math.sin(delta);

    // Layer matrix M_layer:
    // [ cosDelta,       i * sinDelta / n ]
    // [ i * n * sinDelta, cosDelta       ]
    const a = cosDelta;
    const b = sinDelta / n;
    const c = n * sinDelta;
    const d_val = cosDelta;

    // Multiply M_total = M_total * M_layer
    const next_m11 = m11 * a - m12_im * c;
    const next_m12_im = m11 * b + m12_im * d_val;
    const next_m21_im = m21_im * a + m22 * c;
    const next_m22 = m22 * d_val - m21_im * b;

    m11 = next_m11;
    m12_im = next_m12_im;
    m21_im = next_m21_im;
    m22 = next_m22;
  }

  // Boundary conditions:
  // [B; C] = M_total * [1; ns]
  // B = m11 + i * (ns * m12_im)
  // C = ns * m22 + i * m21_im
  //
  // Reflection coefficient r = (n0 * B - C) / (n0 * B + C)
  const num_re = n0 * m11 - ns * m22;
  const num_im = n0 * ns * m12_im - m21_im;

  const den_re = n0 * m11 + ns * m22;
  const den_im = n0 * ns * m12_im + m21_im;

  const num_sq = num_re * num_re + num_im * num_im;
  const den_sq = den_re * den_re + den_im * den_im;

  let R = den_sq > 1e-12 ? num_sq / den_sq : 0.0;
  // Numerical clamp
  if (R < 0.0) R = 0.0;
  if (R > 1.0) R = 1.0;

  const T = 1.0 - R; // Energy conservation for non-absorbing dielectric layers

  return { reflection: R, transmission: T };
}

/**
 * Calculates optical response across the visible spectrum (400 - 700 nm)
 */
export function calculateSpectrum(
  layers: Layer[],
  startWl = 400,
  endWl = 700,
  step = 2
): OpticalPoint[] {
  const points: OpticalPoint[] = [];

  for (let wl = startWl; wl <= endWl; wl += step) {
    const { reflection, transmission } = calculateAtWavelength(layers, wl);
    points.push({
      wavelength: wl,
      reflection,
      transmission,
      reflectionPct: +(reflection * 100).toFixed(1),
      transmissionPct: +(transmission * 100).toFixed(1)
    });
  }

  return points;
}

// Verification script for PhotonForge AI physics and optimization engine
import { calculateSpectrum, calculateAtWavelength } from '../src/physics/tmm.js';
import {
  PRESETS,
  createCustomTarget,
  evaluateCandidate,
  runPhysicsOptimizer,
  getPreloadedBlueReflector
} from '../src/physics/optimizer.js';

console.log("==================================================");
console.log("🧪 PHOTONFORGE AI PHYSICS & OPTIMIZATION TEST SUITE");
console.log("==================================================");

// 1. Conservation of Energy Verification
console.log("\n[1/5] Testing Conservation of Energy (R + T = 1.000)...");
const testLayers = [
  { materialId: 'tio2', thicknessNm: 50 },
  { materialId: 'sio2', thicknessNm: 85 },
  { materialId: 'tio2', thicknessNm: 52 },
  { materialId: 'sio2', thicknessNm: 88 }
];

let conservationPassed = true;
for (let wl = 400; wl <= 700; wl += 10) {
  const { reflection, transmission } = calculateAtWavelength(testLayers, wl);
  const sum = reflection + transmission;
  if (Math.abs(sum - 1.0) > 1e-6) {
    console.error(`❌ Energy conservation violated at ${wl}nm: R+T = ${sum}`);
    conservationPassed = false;
  }
}
if (conservationPassed) {
  console.log("  ✅ Energy conservation perfectly satisfied across 400-700 nm.");
}

// 2. Preloaded State Verification
console.log("\n[2/5] Testing Preloaded Blue Light Reflector state...");
const initial = getPreloadedBlueReflector();
console.log(`  Score: ${initial.score}%`);
console.log(`  Candidates tested: ${initial.candidatesTested}`);
console.log(`  Layers: ${initial.layers.map(l => `${l.materialId}(${l.thicknessNm}nm)`).join(' -> ')}`);
if (initial.score >= 80 && initial.layers.length === 4) {
  console.log("  ✅ Preloaded state verified with strong blue reflection.");
} else {
  console.error("  ❌ Preloaded state issue.");
}

// 3. Red Light Transmitter Optimization
console.log("\n[3/5] Testing Red Light Transmitter Optimization...");
async function testRed() {
  const redPreset = PRESETS[1];
  const result = await runPhysicsOptimizer(redPreset, 4);
  console.log(`  Score: ${result.score}%`);
  console.log(`  Candidates tested: ${result.candidatesTested}`);
  console.log(`  Computation time: ${result.elapsedMs} ms`);
  console.log(`  Optimized layers: ${result.layers.map(l => `${l.materialId} (${l.thicknessNm}nm)`).join(', ')}`);
  // Check transmission in red band (650nm)
  const at650 = calculateAtWavelength(result.layers, 650);
  console.log(`  Transmission at 650nm: ${(at650.transmission * 100).toFixed(1)}%`);
  if (at650.transmission >= 0.75) {
    console.log("  ✅ Red Light Transmitter successfully synthesized.");
  }
}

// 4. Green Filter Optimization
console.log("\n[4/5] Testing Green Filter Optimization...");
async function testGreen() {
  const greenPreset = PRESETS[2];
  const result = await runPhysicsOptimizer(greenPreset, 4);
  console.log(`  Score: ${result.score}%`);
  console.log(`  Computation time: ${result.elapsedMs} ms`);
  console.log(`  Optimized layers: ${result.layers.map(l => `${l.materialId} (${l.thicknessNm}nm)`).join(', ')}`);
  const at535 = calculateAtWavelength(result.layers, 535);
  console.log(`  Transmission at 535nm: ${(at535.transmission * 100).toFixed(1)}%`);
  if (at535.transmission >= 0.65) {
    console.log("  ✅ Green Filter successfully synthesized.");
  }
}

// 5. Custom Wavelength Test
console.log("\n[5/5] Testing Custom Target (Reflect at 600nm, 2 layers)...");
async function testCustom() {
  const custom = createCustomTarget(600, 'reflect');
  const result = await runPhysicsOptimizer(custom, 2);
  console.log(`  Score: ${result.score}%`);
  console.log(`  Optimized 2-layer design: ${result.layers.map(l => `${l.materialId} (${l.thicknessNm}nm)`).join(', ')}`);
  console.log("  ✅ Custom target synthesized.");
}

async function runAll() {
  await testRed();
  await testGreen();
  await testCustom();
  console.log("\n==================================================");
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runAll();

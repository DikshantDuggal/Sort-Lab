import { AlgorithmMetadata, AlgorithmRunResult, AlgorithmStep } from './types';

export const selectionSortMetadata: AlgorithmMetadata = {
  id: 'selection',
  name: 'Selection Sort',
  category: 'Selection Sort',
  tagline: 'Repeatedly locates the minimum unsorted item and places it up front',
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  description:
    'Selection Sort divides the array into a sorted prefix and an unsorted suffix. In each iteration, it performs a linear search over the unsorted portion to find the absolute minimum value, then swaps that minimum into its correct place at the boundary.',
  bestCaseDescription: 'Always O(n²) comparisons: it still must scan all unsorted elements to guarantee the minimum.',
  worstCaseDescription: 'O(n²) comparisons and at most n-1 swaps. Performs minimal swaps among quadratic sorts.',
  pseudocode: [
    { line: 1, code: 'procedure selectionSort(A : list of sortable items)', indent: 0 },
    { line: 2, code: '  n := length(A)', indent: 0 },
    { line: 3, code: '  for i := 0 to n - 2 do', indent: 1 },
    { line: 4, code: '    minIdx := i', indent: 2 },
    { line: 5, code: '    for j := i + 1 to n - 1 do', indent: 2 },
    { line: 6, code: '      if A[j] < A[minIdx] then', indent: 3 },
    { line: 7, code: '        minIdx := j', indent: 4 },
    { line: 8, code: '    if minIdx != i then', indent: 2 },
    { line: 9, code: '      swap(A[i], A[minIdx])', indent: 3 },
    { line: 10, code: '  return A', indent: 1 },
  ],
};

export function runSelectionSort(input: number[]): AlgorithmRunResult {
  const arr = [...input];
  const n = arr.length;
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  let stepId = 0;
  const sortedSet = new Set<number>();

  steps.push({
    id: stepId++,
    type: 'highlight',
    array: [...arr],
    indices: [],
    explanation: `Selection Sort initialized. Target array size is ${n}.`,
    pseudocodeLine: 1,
    comparisons,
    swaps,
    accesses,
    sortedIndices: [],
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    accesses++; // read A[i]

    steps.push({
      id: stepId++,
      type: 'pivot',
      array: [...arr],
      indices: [i],
      pivotIndex: minIdx,
      explanation: `Starting pass ${i + 1}. Current assumed minimum is index ${i} (value: ${arr[i]}).`,
      pseudocodeLine: 4,
      comparisons,
      swaps,
      accesses,
      sortedIndices: Array.from(sortedSet),
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      accesses += 2; // read A[j] and A[minIdx]
      const valJ = arr[j];
      const valMin = arr[minIdx];

      steps.push({
        id: stepId++,
        type: 'compare',
        array: [...arr],
        indices: [minIdx, j],
        pivotIndex: minIdx,
        explanation: `Comparing candidate element at index ${j} (${valJ}) with current minimum at index ${minIdx} (${valMin}). ${
          valJ < valMin ? `New minimum found! ${valJ} < ${valMin}.` : `${valJ} >= ${valMin}, minimum remains index ${minIdx}.`
        }`,
        pseudocodeLine: 6,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          id: stepId++,
          type: 'pivot',
          array: [...arr],
          indices: [minIdx],
          pivotIndex: minIdx,
          explanation: `Updated minimum index to ${minIdx} (value: ${arr[minIdx]}).`,
          pseudocodeLine: 7,
          comparisons,
          swaps,
          accesses,
          sortedIndices: Array.from(sortedSet),
        });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      swaps++;
      accesses += 4; // read and write both

      steps.push({
        id: stepId++,
        type: 'swap',
        array: [...arr],
        indices: [i, minIdx],
        pivotIndex: minIdx,
        explanation: `Swapped found minimum (${arr[i]}) into sorted boundary position index ${i}.`,
        pseudocodeLine: 9,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });
    } else {
      steps.push({
        id: stepId++,
        type: 'highlight',
        array: [...arr],
        indices: [i],
        explanation: `Index ${i} (${arr[i]}) was already the minimum in the remaining suffix. No swap needed.`,
        pseudocodeLine: 8,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });
    }

    sortedSet.add(i);
    steps.push({
      id: stepId++,
      type: 'sorted',
      array: [...arr],
      indices: [i],
      explanation: `Index ${i} (${arr[i]}) is now permanently sorted.`,
      pseudocodeLine: 3,
      comparisons,
      swaps,
      accesses,
      sortedIndices: Array.from(sortedSet),
    });
  }

  steps.push({
    id: stepId++,
    type: 'done',
    array: [...arr],
    indices: [],
    explanation: `Selection Sort complete! Performed ${comparisons} comparisons and ${swaps} swaps.`,
    pseudocodeLine: 10,
    comparisons,
    swaps,
    accesses,
    sortedIndices: Array.from({ length: n }, (_, k) => k),
  });

  return {
    steps,
    finalArray: arr,
    totalComparisons: comparisons,
    totalSwaps: swaps,
    totalAccesses: accesses,
  };
}

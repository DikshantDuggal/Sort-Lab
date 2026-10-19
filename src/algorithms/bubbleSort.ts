import { AlgorithmMetadata, AlgorithmRunResult, AlgorithmStep } from './types';

export const bubbleSortMetadata: AlgorithmMetadata = {
  id: 'bubble',
  name: 'Bubble Sort',
  category: 'Exchange Sort',
  tagline: 'Iteratively floats the largest unsorted element to the end',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  description:
    'Bubble Sort repeatedly scans adjacent pairs of elements from left to right, comparing them and swapping their positions if they are inverted. With each pass, the largest remaining unsorted value "bubbles up" to its correct position at the end of the array.',
  bestCaseDescription: 'Array already sorted: early exit after 1 pass of n-1 comparisons with 0 swaps.',
  worstCaseDescription: 'Array reverse sorted: requires n*(n-1)/2 comparisons and n*(n-1)/2 swaps.',
  pseudocode: [
    { line: 1, code: 'procedure bubbleSort(A : list of sortable items)', indent: 0 },
    { line: 2, code: '  n := length(A)', indent: 0 },
    { line: 3, code: '  for i := 0 to n - 1 do', indent: 1 },
    { line: 4, code: '    swapped := false', indent: 2 },
    { line: 5, code: '    for j := 0 to n - i - 2 do', indent: 2 },
    { line: 6, code: '      if A[j] > A[j + 1] then', indent: 3 },
    { line: 7, code: '        swap(A[j], A[j + 1])', indent: 4 },
    { line: 8, code: '        swapped := true', indent: 4 },
    { line: 9, code: '    if not swapped then break', indent: 2 },
    { line: 10, code: '  return A', indent: 1 },
  ],
};

export function runBubbleSort(input: number[]): AlgorithmRunResult {
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
    explanation: `Initialized array with ${n} elements. Ready to execute Bubble Sort.`,
    pseudocodeLine: 1,
    comparisons,
    swaps,
    accesses,
    sortedIndices: [],
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;

    steps.push({
      id: stepId++,
      type: 'highlight',
      array: [...arr],
      indices: [],
      explanation: `Pass ${i + 1}: Scanning unsorted window [0 to ${n - i - 1}].`,
      pseudocodeLine: 3,
      comparisons,
      swaps,
      accesses,
      sortedIndices: Array.from(sortedSet),
    });

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      accesses += 2; // read A[j] and A[j+1]

      const valA = arr[j];
      const valB = arr[j + 1];

      // Comparison step
      steps.push({
        id: stepId++,
        type: 'compare',
        array: [...arr],
        indices: [j, j + 1],
        explanation: `Comparing element at index ${j} (${valA}) with index ${j + 1} (${valB}). ${
          valA > valB ? `${valA} > ${valB}, so a swap is required.` : `${valA} <= ${valB}, elements are in correct relative order.`
        }`,
        pseudocodeLine: 6,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        accesses += 2; // write A[j] and A[j+1]
        swapped = true;

        steps.push({
          id: stepId++,
          type: 'swap',
          array: [...arr],
          indices: [j, j + 1],
          explanation: `Swapped index ${j} and ${j + 1}. Array is now [${arr.join(', ')}].`,
          pseudocodeLine: 7,
          comparisons,
          swaps,
          accesses,
          sortedIndices: Array.from(sortedSet),
        });
      }
    }

    // Element at n - i - 1 is now locked in its final sorted position
    sortedSet.add(n - i - 1);

    steps.push({
      id: stepId++,
      type: 'sorted',
      array: [...arr],
      indices: [n - i - 1],
      explanation: `Element ${arr[n - i - 1]} at index ${n - i - 1} has reached its final sorted position.`,
      pseudocodeLine: 5,
      comparisons,
      swaps,
      accesses,
      sortedIndices: Array.from(sortedSet),
    });

    if (!swapped) {
      steps.push({
        id: stepId++,
        type: 'highlight',
        array: [...arr],
        indices: [],
        explanation: 'No swaps occurred during this pass. The array is already completely sorted (early break).',
        pseudocodeLine: 9,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from({ length: n }, (_, k) => k),
      });
      break;
    }
  }

  // Final done step
  steps.push({
    id: stepId++,
    type: 'done',
    array: [...arr],
    indices: [],
    explanation: `Bubble Sort complete! Sorted in ${comparisons} comparisons and ${swaps} swaps.`,
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

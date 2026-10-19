import { AlgorithmMetadata, AlgorithmRunResult, AlgorithmStep } from './types';

export const quickSortMetadata: AlgorithmMetadata = {
  id: 'quick',
  name: 'Quick Sort',
  category: 'Divide & Conquer',
  tagline: 'Partitions array around a pivot element into smaller and larger partitions',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(log n)',
  stable: false,
  inPlace: true,
  description:
    'Quick Sort selects a "pivot" element from the array and partitions the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then recursively sorted.',
  bestCaseDescription: 'Balanced partitions at each step produce O(n log n) runtime with minimal recursion depth.',
  worstCaseDescription: 'Already sorted or reverse sorted with naive pivot choice leads to unbalanced partitions and O(n²).',
  pseudocode: [
    { line: 1, code: 'procedure quickSort(A, lo, hi)', indent: 0 },
    { line: 2, code: '  if lo < hi then', indent: 1 },
    { line: 3, code: '    p := partition(A, lo, hi)', indent: 2 },
    { line: 4, code: '    quickSort(A, lo, p - 1)', indent: 2 },
    { line: 5, code: '    quickSort(A, p + 1, hi)', indent: 2 },
    { line: 6, code: 'procedure partition(A, lo, hi)', indent: 0 },
    { line: 7, code: '  pivot := A[hi]', indent: 1 },
    { line: 8, code: '  i := lo - 1', indent: 1 },
    { line: 9, code: '  for j := lo to hi - 1 do', indent: 1 },
    { line: 10, code: '    if A[j] <= pivot then i++; swap(A[i], A[j])', indent: 2 },
    { line: 11, code: '  swap(A[i + 1], A[hi])', indent: 1 },
    { line: 12, code: '  return i + 1', indent: 1 },
  ],
};

export function runQuickSort(input: number[]): AlgorithmRunResult {
  const arr = [...input];
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
    explanation: `Quick Sort initialized with ${arr.length} elements.`,
    pseudocodeLine: 1,
    comparisons,
    swaps,
    accesses,
    sortedIndices: [],
  });

  function partition(lo: number, hi: number): number {
    const pivot = arr[hi];
    accesses++;
    let i = lo - 1;

    steps.push({
      id: stepId++,
      type: 'pivot',
      array: [...arr],
      indices: [hi],
      pivotIndex: hi,
      explanation: `Chosen pivot = ${pivot} at index ${hi} for partition [${lo}..${hi}].`,
      pseudocodeLine: 7,
      comparisons,
      swaps,
      accesses,
      sortedIndices: Array.from(sortedSet),
    });

    for (let j = lo; j < hi; j++) {
      comparisons++;
      accesses++;
      const valJ = arr[j];

      steps.push({
        id: stepId++,
        type: 'compare',
        array: [...arr],
        indices: [j, hi],
        pivotIndex: hi,
        explanation: `Comparing element ${valJ} (index ${j}) against pivot ${pivot}. ${
          valJ <= pivot
            ? `${valJ} <= ${pivot}, swapping into the left partition.`
            : `${valJ} > ${pivot}, stays in the right partition.`
        }`,
        pseudocodeLine: 10,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });

      if (valJ <= pivot) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          swaps++;
          accesses += 4;

          steps.push({
            id: stepId++,
            type: 'swap',
            array: [...arr],
            indices: [i, j],
            pivotIndex: hi,
            explanation: `Swapped index ${i} (${arr[i]}) and ${j} (${arr[j]}) to advance left partition boundary.`,
            pseudocodeLine: 10,
            comparisons,
            swaps,
            accesses,
            sortedIndices: Array.from(sortedSet),
          });
        }
      }
    }

    // Place pivot in correct position
    const pIndex = i + 1;
    if (pIndex !== hi) {
      const temp = arr[pIndex];
      arr[pIndex] = arr[hi];
      arr[hi] = temp;
      swaps++;
      accesses += 4;

      steps.push({
        id: stepId++,
        type: 'swap',
        array: [...arr],
        indices: [pIndex, hi],
        pivotIndex: pIndex,
        explanation: `Swapped pivot (${arr[pIndex]}) into its final partition position at index ${pIndex}.`,
        pseudocodeLine: 11,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });
    }

    sortedSet.add(pIndex);
    steps.push({
      id: stepId++,
      type: 'sorted',
      array: [...arr],
      indices: [pIndex],
      pivotIndex: pIndex,
      explanation: `Pivot element ${arr[pIndex]} at index ${pIndex} is now in its permanently sorted position.`,
      pseudocodeLine: 12,
      comparisons,
      swaps,
      accesses,
      sortedIndices: Array.from(sortedSet),
    });

    return pIndex;
  }

  function quick(lo: number, hi: number) {
    if (lo < hi) {
      const p = partition(lo, hi);
      quick(lo, p - 1);
      quick(p + 1, hi);
    } else if (lo === hi) {
      sortedSet.add(lo);
    }
  }

  quick(0, arr.length - 1);

  steps.push({
    id: stepId++,
    type: 'done',
    array: [...arr],
    indices: [],
    explanation: `Quick Sort completed! Total comparisons: ${comparisons}, swaps: ${swaps}.`,
    pseudocodeLine: 1,
    comparisons,
    swaps,
    accesses,
    sortedIndices: Array.from({ length: arr.length }, (_, k) => k),
  });

  return {
    steps,
    finalArray: arr,
    totalComparisons: comparisons,
    totalSwaps: swaps,
    totalAccesses: accesses,
  };
}

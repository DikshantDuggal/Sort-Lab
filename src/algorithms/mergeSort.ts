import { AlgorithmMetadata, AlgorithmRunResult, AlgorithmStep } from './types';

export const mergeSortMetadata: AlgorithmMetadata = {
  id: 'merge',
  name: 'Merge Sort',
  category: 'Divide & Conquer',
  tagline: 'Recursively divides array into halves and merges sorted sub-arrays',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(n)',
  stable: true,
  inPlace: false,
  description:
    'Merge Sort recursively bisects the list until every sub-list has length 1. It then iteratively weaves (merges) pairs of sorted lists back together in sorted sequence, guaranteeing O(n log n) performance even in the worst case.',
  bestCaseDescription: 'Guaranteed O(n log n) divisions and comparisons regardless of initial array ordering.',
  worstCaseDescription: 'Still strictly O(n log n) time complexity, requiring auxiliary buffer memory proportional to n.',
  pseudocode: [
    { line: 1, code: 'procedure mergeSort(A, left, right)', indent: 0 },
    { line: 2, code: '  if left < right then', indent: 1 },
    { line: 3, code: '    mid := (left + right) / 2', indent: 2 },
    { line: 4, code: '    mergeSort(A, left, mid)', indent: 2 },
    { line: 5, code: '    mergeSort(A, mid + 1, right)', indent: 2 },
    { line: 6, code: '    merge(A, left, mid, right)', indent: 2 },
    { line: 7, code: 'procedure merge(A, left, mid, right)', indent: 0 },
    { line: 8, code: '  copy subarrays into temp arrays L and R', indent: 1 },
    { line: 9, code: '  while i < len(L) and j < len(R) do', indent: 1 },
    { line: 10, code: '    if L[i] <= R[j] then A[k] := L[i]; i++', indent: 2 },
    { line: 11, code: '    else A[k] := R[j]; j++', indent: 2 },
    { line: 12, code: '  copy remaining elements into A', indent: 1 },
  ],
};

export function runMergeSort(input: number[]): AlgorithmRunResult {
  const arr = [...input];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0; // count array writes during merge
  let accesses = 0;
  let stepId = 0;
  const sortedSet = new Set<number>();

  steps.push({
    id: stepId++,
    type: 'highlight',
    array: [...arr],
    indices: [],
    explanation: `Merge Sort initialized on ${arr.length} elements.`,
    pseudocodeLine: 1,
    comparisons,
    swaps,
    accesses,
    sortedIndices: [],
  });

  function merge(left: number, mid: number, right: number) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = new Array(n1);
    const R = new Array(n2);

    for (let x = 0; x < n1; x++) {
      L[x] = arr[left + x];
      accesses++;
    }
    for (let y = 0; y < n2; y++) {
      R[y] = arr[mid + 1 + y];
      accesses++;
    }

    steps.push({
      id: stepId++,
      type: 'highlight',
      array: [...arr],
      indices: [left, right],
      explanation: `Merging sorted segments [${left}..${mid}] and [${mid + 1}..${right}].`,
      pseudocodeLine: 7,
      comparisons,
      swaps,
      accesses,
      sortedIndices: Array.from(sortedSet),
    });

    let i = 0;
    let j = 0;
    let k = left;

    while (i < n1 && j < n2) {
      comparisons++;
      accesses += 2;
      const valL = L[i];
      const valR = R[j];

      steps.push({
        id: stepId++,
        type: 'compare',
        array: [...arr],
        indices: [left + i, mid + 1 + j],
        explanation: `Comparing left element ${valL} with right element ${valR}. ${
          valL <= valR
            ? `${valL} <= ${valR}, placing ${valL} into position ${k}.`
            : `${valR} < ${valL}, placing ${valR} into position ${k}.`
        }`,
        pseudocodeLine: 10,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });

      if (valL <= valR) {
        arr[k] = valL;
        swaps++;
        accesses++;
        i++;
      } else {
        arr[k] = valR;
        swaps++;
        accesses++;
        j++;
      }

      steps.push({
        id: stepId++,
        type: 'overwrite',
        array: [...arr],
        indices: [k],
        explanation: `Array updated at index ${k} with value ${arr[k]}.`,
        pseudocodeLine: 11,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });

      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      swaps++;
      accesses += 2;
      steps.push({
        id: stepId++,
        type: 'overwrite',
        array: [...arr],
        indices: [k],
        explanation: `Copying remaining element ${L[i]} into position ${k}.`,
        pseudocodeLine: 12,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      swaps++;
      accesses += 2;
      steps.push({
        id: stepId++,
        type: 'overwrite',
        array: [...arr],
        indices: [k],
        explanation: `Copying remaining element ${R[j]} into position ${k}.`,
        pseudocodeLine: 12,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from(sortedSet),
      });
      j++;
      k++;
    }

    if (left === 0 && right === arr.length - 1) {
      for (let s = 0; s < arr.length; s++) sortedSet.add(s);
    }
  }

  function sort(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
    }
  }

  sort(0, arr.length - 1);

  steps.push({
    id: stepId++,
    type: 'done',
    array: [...arr],
    indices: [],
    explanation: `Merge Sort complete! Performed ${comparisons} comparisons and ${swaps} write operations.`,
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

import { AlgorithmMetadata, AlgorithmRunResult, AlgorithmStep } from './types';

export const insertionSortMetadata: AlgorithmMetadata = {
  id: 'insertion',
  name: 'Insertion Sort',
  category: 'Insertion Sort',
  tagline: 'Builds a sorted prefix element-by-element by shifting larger values right',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  description:
    'Insertion Sort works similarly to sorting playing cards in your hand. It examines items one at a time, extracting each key element and shifting all greater elements in the sorted prefix one position to the right before inserting the key into its proper position.',
  bestCaseDescription: 'Already sorted array: takes O(n) time as each element requires exactly 1 comparison and 0 shifts.',
  worstCaseDescription: 'Reverse sorted: takes O(n²) comparisons and shifts, as every element must traverse the entire prefix.',
  pseudocode: [
    { line: 1, code: 'procedure insertionSort(A : list of sortable items)', indent: 0 },
    { line: 2, code: '  n := length(A)', indent: 0 },
    { line: 3, code: '  for i := 1 to n - 1 do', indent: 1 },
    { line: 4, code: '    key := A[i]', indent: 2 },
    { line: 5, code: '    j := i - 1', indent: 2 },
    { line: 6, code: '    while j >= 0 and A[j] > key do', indent: 2 },
    { line: 7, code: '      A[j + 1] := A[j]', indent: 3 },
    { line: 8, code: '      j := j - 1', indent: 3 },
    { line: 9, code: '    A[j + 1] := key', indent: 2 },
    { line: 10, code: '  return A', indent: 1 },
  ],
};

export function runInsertionSort(input: number[]): AlgorithmRunResult {
  const arr = [...input];
  const n = arr.length;
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0; // count shifts/swaps
  let accesses = 0;
  let stepId = 0;

  steps.push({
    id: stepId++,
    type: 'highlight',
    array: [...arr],
    indices: [0],
    explanation: `Insertion Sort initialized. Index 0 (${arr[0]}) is trivial initial sorted prefix.`,
    pseudocodeLine: 1,
    comparisons,
    swaps,
    accesses,
    sortedIndices: [0],
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    accesses++; // read key
    let j = i - 1;

    steps.push({
      id: stepId++,
      type: 'pivot',
      array: [...arr],
      indices: [i],
      pivotIndex: i,
      explanation: `Selected key = ${key} at index ${i}. Will insert it into sorted prefix [0..${i - 1}].`,
      pseudocodeLine: 4,
      comparisons,
      swaps,
      accesses,
      sortedIndices: Array.from({ length: i }, (_, k) => k),
    });

    while (j >= 0) {
      comparisons++;
      accesses++; // read arr[j]
      const valJ = arr[j];

      steps.push({
        id: stepId++,
        type: 'compare',
        array: [...arr],
        indices: [j, j + 1],
        pivotIndex: j + 1,
        explanation: `Comparing key (${key}) with sorted element at index ${j} (${valJ}). ${
          valJ > key
            ? `${valJ} > ${key}, shifting ${valJ} right to index ${j + 1}.`
            : `${valJ} <= ${key}, insertion slot found at index ${j + 1}.`
        }`,
        pseudocodeLine: 6,
        comparisons,
        swaps,
        accesses,
        sortedIndices: Array.from({ length: i }, (_, k) => k),
      });

      if (valJ > key) {
        arr[j + 1] = arr[j];
        swaps++;
        accesses++; // write arr[j+1]

        steps.push({
          id: stepId++,
          type: 'swap',
          array: [...arr],
          indices: [j, j + 1],
          explanation: `Shifted ${valJ} from index ${j} to ${j + 1}.`,
          pseudocodeLine: 7,
          comparisons,
          swaps,
          accesses,
          sortedIndices: Array.from({ length: i }, (_, k) => k),
        });

        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    accesses++; // write key

    steps.push({
      id: stepId++,
      type: 'sorted',
      array: [...arr],
      indices: [j + 1],
      explanation: `Inserted key ${key} into position ${j + 1}. Prefix [0..${i}] is now sorted.`,
      pseudocodeLine: 9,
      comparisons,
      swaps,
      accesses,
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
    });
  }

  steps.push({
    id: stepId++,
    type: 'done',
    array: [...arr],
    indices: [],
    explanation: `Insertion Sort complete! Sorted in ${comparisons} comparisons and ${swaps} shifts.`,
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

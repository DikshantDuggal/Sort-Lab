import { AlgorithmId, AlgorithmMetadata, AlgorithmRunResult } from './types';
import { bubbleSortMetadata, runBubbleSort } from './bubbleSort';
import { selectionSortMetadata, runSelectionSort } from './selectionSort';
import { insertionSortMetadata, runInsertionSort } from './insertionSort';
import { quickSortMetadata, runQuickSort } from './quickSort';
import { mergeSortMetadata, runMergeSort } from './mergeSort';

export * from './types';

export const ALGORITHM_METADATA: Record<AlgorithmId, AlgorithmMetadata> = {
  bubble: bubbleSortMetadata,
  selection: selectionSortMetadata,
  insertion: insertionSortMetadata,
  quick: quickSortMetadata,
  merge: mergeSortMetadata,
};

export const ALGORITHM_RUNNERS: Record<AlgorithmId, (arr: number[]) => AlgorithmRunResult> = {
  bubble: runBubbleSort,
  selection: runSelectionSort,
  insertion: runInsertionSort,
  quick: runQuickSort,
  merge: runMergeSort,
};

export const ALGORITHMS_LIST: AlgorithmMetadata[] = [
  bubbleSortMetadata,
  selectionSortMetadata,
  insertionSortMetadata,
  quickSortMetadata,
  mergeSortMetadata,
];

export function executeAlgorithm(id: AlgorithmId, array: number[]): AlgorithmRunResult {
  const runner = ALGORITHM_RUNNERS[id];
  if (!runner) {
    throw new Error(`Algorithm '${id}' not found`);
  }
  return runner(array);
}

export function generateArrayPreset(type: 'random' | 'nearly-sorted' | 'reversed' | 'few-unique', size: number): number[] {
  const validSize = Math.max(5, Math.min(30, size));
  switch (type) {
    case 'random':
      return Array.from({ length: validSize }, () => Math.floor(Math.random() * 85) + 10);
    case 'nearly-sorted': {
      const arr = Array.from({ length: validSize }, (_, i) => Math.floor(10 + (i * 75) / validSize));
      // swap 2 adjacent pairs
      if (arr.length > 4) {
        const idx = Math.floor(arr.length / 3);
        const temp = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = temp;
      }
      return arr;
    }
    case 'reversed':
      return Array.from({ length: validSize }, (_, i) => Math.floor(90 - (i * 75) / validSize));
    case 'few-unique': {
      const sampleSet = [15, 38, 62, 85];
      return Array.from({ length: validSize }, () => sampleSet[Math.floor(Math.random() * sampleSet.length)]);
    }
  }
}

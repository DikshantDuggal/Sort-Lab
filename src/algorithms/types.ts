export type AlgorithmId = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

export type StepType = 'compare' | 'swap' | 'overwrite' | 'pivot' | 'sorted' | 'highlight' | 'done';

export interface AlgorithmStep {
  id: number;
  type: StepType;
  array: number[];
  indices: number[]; // Active indices involved in this operation
  pivotIndex?: number;
  sortedIndices?: number[];
  explanation: string;
  pseudocodeLine: number;
  comparisons: number;
  swaps: number;
  accesses: number;
}

export interface AlgorithmMetadata {
  id: AlgorithmId;
  name: string;
  category: string;
  tagline: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
  description: string;
  bestCaseDescription: string;
  worstCaseDescription: string;
  pseudocode: { line: number; code: string; indent: number }[];
}

export interface AlgorithmRunResult {
  steps: AlgorithmStep[];
  finalArray: number[];
  totalComparisons: number;
  totalSwaps: number;
  totalAccesses: number;
}

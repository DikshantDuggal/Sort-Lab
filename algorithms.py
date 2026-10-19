"""
SortLab backend — sorting algorithms live here.

Each function:
1. Accepts a list of numbers.
2. Sorts it.
3. Records the array's state after each meaningful operation
   (using .copy() to capture a snapshot).
4. Returns the final sorted array, comparisons, swaps, and the list of recorded steps.
"""

from typing import List, Dict, Any


def bubble_sort(arr: List[int]) -> Dict[str, Any]:
    """
    Bubble Sort: repeatedly steps through the list, compares adjacent elements,
    and swaps them if they are in the wrong order.
    """
    a = arr.copy()
    n = len(a)
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            comparisons += 1
            steps.append({
                "type": "compare",
                "array": a.copy(),
                "indices": [j, j + 1]
            })

            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
                swapped = True
                steps.append({
                    "type": "swap",
                    "array": a.copy(),
                    "indices": [j, j + 1]
                })

        if not swapped:
            break

    steps.append({
        "type": "done",
        "array": a.copy(),
        "indices": []
    })

    return {
        "sorted_array": a,
        "comparisons": comparisons,
        "swaps": swaps,
        "steps": steps
    }


def selection_sort(arr: List[int]) -> Dict[str, Any]:
    """
    Selection Sort: repeatedly finds the minimum element from the unsorted portion
    and puts it at the beginning.
    """
    a = arr.copy()
    n = len(a)
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            steps.append({
                "type": "compare",
                "array": a.copy(),
                "indices": [min_idx, j]
            })
            if a[j] < a[min_idx]:
                min_idx = j

        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]
            swaps += 1
            steps.append({
                "type": "swap",
                "array": a.copy(),
                "indices": [i, min_idx]
            })

    steps.append({
        "type": "done",
        "array": a.copy(),
        "indices": []
    })

    return {
        "sorted_array": a,
        "comparisons": comparisons,
        "swaps": swaps,
        "steps": steps
    }


def insertion_sort(arr: List[int]) -> Dict[str, Any]:
    """
    Insertion Sort: builds the sorted array one item at a time, shifting larger
    elements to the right.
    """
    a = arr.copy()
    n = len(a)
    steps: List[Dict[str, Any]] = []
    comparisons = 0
    swaps = 0

    for i in range(1, n):
        j = i
        while j > 0:
            comparisons += 1
            steps.append({
                "type": "compare",
                "array": a.copy(),
                "indices": [j - 1, j]
            })
            if a[j - 1] > a[j]:
                a[j - 1], a[j] = a[j], a[j - 1]
                swaps += 1
                steps.append({
                    "type": "swap",
                    "array": a.copy(),
                    "indices": [j - 1, j]
                })
                j -= 1
            else:
                break

    steps.append({
        "type": "done",
        "array": a.copy(),
        "indices": []
    })

    return {
        "sorted_array": a,
        "comparisons": comparisons,
        "swaps": swaps,
        "steps": steps
    }

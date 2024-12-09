/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */

export const printMatrix = <T>(
  matrix: T[][],
  transformer?: (item: T) => string,
  header?: (rowIndex: number) => string,
) => {
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    const row = transformer
      ? matrix[rowIndex].map((i) => transformer(i))
      : matrix[rowIndex];
    const rowStr = row.join(" ");
    console.log(header ? header(rowIndex) : "", rowStr);
  }
};

/**
 * Utility library for 2D arrays (matrices) and maps.
 */

export const MatrixUtils = {
  // Apply a transformation function to each element of the matrix
  map<T, U>(
    matrix: T[][],
    transformer: (value: T, row: number, col: number) => U,
  ): U[][] {
    return matrix.map((row, rowIndex) =>
      row.map((value, colIndex) => transformer(value, rowIndex, colIndex)),
    );
  },

  // Transpose a matrix (swap rows and columns)
  transpose<T>(matrix: T[][]): T[][] {
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;
    const transposed: T[][] = Array.from({ length: cols }, () => Array(rows));
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        transposed[col][row] = matrix[row][col];
      }
    }
    return transposed;
  },

  // Sum all the values in a matrix
  sum(matrix: number[][]): number {
    return matrix.reduce(
      (total, row) => total + row.reduce((rowSum, val) => rowSum + val, 0),
      0,
    );
  },

  // Calculate row sums
  rowSums(matrix: number[][]): number[] {
    return matrix.map((row) => row.reduce((sum, value) => sum + value, 0));
  },

  // Calculate column sums
  columnSums(matrix: number[][]): number[] {
    if (matrix.length === 0) return [];
    const cols = matrix[0].length;
    const sums = Array(cols).fill(0);
    for (const row of matrix) {
      for (let col = 0; col < cols; col++) {
        sums[col] += row[col];
      }
    }
    return sums;
  },

  // Flatten a matrix to a single array
  flatten<T>(matrix: T[][]): T[] {
    return matrix.flat();
  },

  getDiagonals<T>(matrix: T[][], row: number, col: number): [number, number][] {
    const directions: [number, number][] = [
      [-1, -1], // Top-left
      [-1, 1], // Top-right
      [1, -1], // Bottom-left
      [1, 1], // Bottom-right
    ];

    return directions
      .map(([dRow, dCol]) => [row + dRow, col + dCol] as [number, number])
      .filter(([newRow, newCol]) => this.isInBounds(matrix, newRow, newCol));
  },

  /**
   * Get a bounded box around a given cell within a specific range.
   * The bounding box includes all valid cells in the range.
   */
  getBoundingBox<T>(
    matrix: T[][],
    row: number,
    col: number,
    range: number,
  ): [number, number][] {
    const cells: [number, number][] = [];
    for (let r = row - range; r <= row + range; r++) {
      for (let c = col - range; c <= col + range; c++) {
        if (this.isInBounds(matrix, r, c)) {
          cells.push([r, c] as [number, number]);
        }
      }
    }
    return cells;
  },

  // Get the previous cell in row-major order
  previousCell<T>(
    matrix: T[][],
    row: number,
    col: number,
  ): [number, number] | null {
    if (!matrix[row]) return null;
    if (col - 1 >= 0) {
      return [row, col - 1];
    } else if (row - 1 >= 0) {
      return [row - 1, matrix[row - 1].length - 1];
    }
    return null;
  },

  // Find the first occurrence of a value in the matrix
  find<T>(
    matrix: T[][],
    predicate: (value: T, row: number, col: number) => boolean,
  ): [number, number] | null {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (predicate(matrix[row][col], row, col)) {
          return [row, col];
        }
      }
    }
    return null;
  },

  // Fill a matrix with a value, starting from a given cell, using a flood-fill algorithm
  floodFill<T>(
    matrix: T[][],
    row: number,
    col: number,
    newValue: T,
    compareFn: (value: T, newValue: T) => boolean = (a, b) => a === b,
  ): void {
    if (!this.isInBounds(matrix, row, col)) return;
    const targetValue = matrix[row][col];
    if (compareFn(targetValue, newValue)) return;

    const queue: [number, number][] = [[row, col]];
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    while (queue.length) {
      const [currentRow, currentCol] = queue.shift()!;
      if (!this.isInBounds(matrix, currentRow, currentCol)) continue;
      if (!compareFn(matrix[currentRow][currentCol], targetValue)) continue;

      matrix[currentRow][currentCol] = newValue;

      for (const [dRow, dCol] of directions) {
        queue.push([currentRow + dRow, currentCol + dCol]);
      }
    }
  },

  // Rotate a matrix clockwise by 90 degrees
  rotateClockwise<T>(matrix: T[][]): T[][] {
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;
    const rotated: T[][] = Array.from({ length: cols }, () => Array(rows));
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        rotated[col][rows - row - 1] = matrix[row][col];
      }
    }
    return rotated;
  },

  // Rotate a matrix counterclockwise by 90 degrees
  rotateCounterclockwise<T>(matrix: T[][]): T[][] {
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;
    const rotated: T[][] = Array.from({ length: cols }, () => Array(rows));
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        rotated[cols - col - 1][row] = matrix[row][col];
      }
    }
    return rotated;
  },
  // Check if a given cell is within bounds
  isInBounds<T>(matrix: T[][], row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < matrix.length &&
      col >= 0 &&
      col < (matrix[0]?.length || 0)
    );
  },
  // Create a matrix of specified dimensions, filled with a value
  create<T>(rows: number, cols: number, initialValue: T): T[][] {
    return Array.from({ length: rows }, () => Array(cols).fill(initialValue));
  },

  // Check if two matrices are equal
  equals<T>(matrixA: T[][], matrixB: T[][]): boolean {
    if (matrixA.length !== matrixB.length) return false;
    for (let i = 0; i < matrixA.length; i++) {
      if (matrixA[i].length !== matrixB[i].length) return false;
      for (let j = 0; j < matrixA[i].length; j++) {
        if (matrixA[i][j] !== matrixB[i][j]) return false;
      }
    }
    return true;
  },
};

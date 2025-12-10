import run from "aocrunner";
import { MatrixUtils, printMatrix } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split('\n').map(l => l.split(''));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let fittings = 0;
  for (const { value, row, col } of MatrixUtils.cells(input)) {
    if (value !== '@') continue;
    const adjacent = MatrixUtils.getBoundingBox(input, row, col, 1)
      .filter(([r, c]) => !(r === row && c === col))
      .map(([r, c]) => input[r][c])
      .filter((c) => c === '@');
    if (adjacent.length < 4) {
      fittings++;
    }
  }
  return fittings;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let totalRemoved = 0;
  // this holds all accessible rolls.
  const queue: [number, number][] = [];

  for (const { value, row, col } of MatrixUtils.cells(input)) {
    if (value === '@') {
      const adj = MatrixUtils.countNeighbors(input, row, col, '@');
      if (adj < 4) queue.push([row, col]);
    }
  }
  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (input[r][c] !== '@') continue;
    if (MatrixUtils.countNeighbors(input, r, c, '@') >= 4) continue;

    input[r][c] = '.';
    totalRemoved++;

    for (const [nr, nc] of MatrixUtils.neighbors8(input, r, c)) {
      if (input[nr][nc] === '@') {
        const adj = MatrixUtils.countNeighbors(input, nr, nc, '@');
        if (adj < 4) {
          queue.push([nr, nc]);
        }
      }
    }
  }

  return totalRemoved;
};

const testInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

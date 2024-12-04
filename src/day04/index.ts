import run from "aocrunner";

const parseInput = (rawInput: string): string[][] =>
  rawInput.split("\n").map((row) => row.split(""));

const NEEDLE = "XMAS";

const isNeedleFound = (candidate: string[], needle: string): boolean =>
  [needle, needle.split("").reverse().join("")].includes(candidate.join(""));

const countOccurrences = (grid: string[][], needle: string): number => {
  const rows = grid.length;
  const cols = grid[0].length;
  let occurrences = 0;

  const checkDirections = (x: number, y: number) => {
    const vertical = Array.from({ length: needle.length }, (_, i) =>
      x + i < rows ? grid[x + i][y] : null,
    );
    if (
      vertical.every(Boolean) &&
      isNeedleFound(vertical as string[], needle)
    ) {
      occurrences++;
    }

    const horizontal = Array.from({ length: needle.length }, (_, i) =>
      y + i < cols ? grid[x][y + i] : null,
    );
    if (
      horizontal.every(Boolean) &&
      isNeedleFound(horizontal as string[], needle)
    ) {
      occurrences++;
    }

    const diagonalTLBR = Array.from({ length: needle.length }, (_, i) =>
      x + i < rows && y + i < cols ? grid[x + i][y + i] : null,
    );
    if (
      diagonalTLBR.every(Boolean) &&
      isNeedleFound(diagonalTLBR as string[], needle)
    ) {
      occurrences++;
    }

    const diagonalTRBL = Array.from({ length: needle.length }, (_, i) =>
      x + i < rows && y - i >= 0 ? grid[x + i][y - i] : null,
    );
    if (
      diagonalTRBL.every(Boolean) &&
      isNeedleFound(diagonalTRBL as string[], needle)
    ) {
      occurrences++;
    }
  };

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      checkDirections(x, y);
    }
  }

  return occurrences;
};

const isXMAS = (grid: string[][], x: number, y: number): boolean => {
  const rows = grid.length;
  const cols = grid[0].length;

  if (x - 1 < 0 || x + 1 >= rows || y - 1 < 0 || y + 1 >= cols) {
    return false;
  }

  const topLeft = grid[x - 1][y - 1];
  const topRight = grid[x - 1][y + 1];
  const bottomLeft = grid[x + 1][y - 1];
  const bottomRight = grid[x + 1][y + 1];
  const center = grid[x][y];

  const validMAS = ["MAS", "SAM"];
  const diagonal1 = topLeft + center + bottomRight;
  const diagonal2 = bottomLeft + center + topRight;

  return validMAS.includes(diagonal1) && validMAS.includes(diagonal2);
};

const countXMASPatterns = (grid: string[][]): number => {
  let count = 0;

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (isXMAS(grid, x, y)) {
        count++;
      }
    }
  }

  return count;
};

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput);
  return countOccurrences(input, NEEDLE);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return countXMASPatterns(input);
};

const testInput = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

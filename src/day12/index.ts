import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
  const start = { x: 0, y: 0 };
  const end = { x: 0, y: 0 };
  const matrix = rawInput.split("\n").map((line, y) => {
    return line.split("").map((char, x) => {
      if (char === "S") {
        start.x = x;
        start.y = y;
        char = "a";
      }
      if (char === "E") {
        end.x = x;
        end.y = y;
        char = "z";
      }
      return ALPHABET.indexOf(char);
    });
  });
  return {
    start,
    end,
    matrix,
  };
};
const getMatrixDimensions = (matrix: number[][]) => {
  return {
    height: matrix.length,
    width: matrix[0].length,
  };
};

const findPath = (
  matrix: number[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
) => {
  const { height, width } = getMatrixDimensions(matrix);
  const result: number[][] = Array(height)
    .fill(0)
    .map(() => Array(width).fill(Number.POSITIVE_INFINITY));

  result[start.y][start.x] = 0;
  const queue = [start];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const { x, y } = current;
    const currentValue = matrix[y][x];
    const currentStep = result[y][x];
    // Consider only reachable neighbors and those who are viable move (step <= currentStep + 1) and NOT visited yet
    const neighbors = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ]
      .filter((neighbor) => {
        const { x, y } = neighbor;
        return x >= 0 && x < width && y >= 0 && y < height;
      })
      .filter((neighbor) => {
        const { x, y } = neighbor;
        return matrix[y][x] <= currentValue + 1;
      })
      .filter((neighbor) => {
        const { x, y } = neighbor;
        return (
          result[y][x] === Number.POSITIVE_INFINITY ||
          result[y][x] > currentStep + 1
        ); // Higher is to avoid backtracking
      });

    neighbors.forEach((neighbor) => {
      const { x, y } = neighbor;
      result[y][x] = currentStep + 1;
      queue.push(neighbor);
    });
  }
  return result[end.y][end.x];
};

const part1 = (rawInput: string) => {
  const { start, end, matrix } = parseInput(rawInput);
  return findPath(matrix, start, end);
};

const part2 = (rawInput: string) => {
  const { start: _, end, matrix } = parseInput(rawInput);

  const possibleStarts = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === 0) {
        possibleStarts.push({ x, y });
      }
    }
  }
  return possibleStarts
    .map((start) => findPath(matrix, start, end))
    .sort((a, b) => a - b)
    .shift();
};

const testInput = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

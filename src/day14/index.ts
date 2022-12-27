import run from "aocrunner";
import { printMatrix } from "../utils/index.js";

type Coordinate = { x: number; y: number };
type Paths = { start: Coordinate; end: Coordinate }[];

const parseInput = (rawInput: string): Paths => {
  return rawInput
    .split("\n")
    .map((line) => {
      const directions = line.split("->").map((s) => {
        s.trim();
        const [x, y] = s.split(",");
        return { x: parseInt(x), y: parseInt(y) };
      });
      const paths = [];
      for (let i = 1; i < directions.length; i++) {
        const start = directions[i - 1];
        const end = directions[i];
        paths.push({ start, end });
      }
      return paths;
    })
    .flat();
};

const sandMatrixTransformer = (item: number) => {
  return item === 0 ? "." : item === 1 ? "#" : item === 2 ? "o" : "+";
};

enum Tile {
  Air = 0,
  Rock = 1,
  Sand = 2,
  Source = 100,
}
const part1 = (rawInput: string) => {
  const paths = parseInput(rawInput);
  const minX =
    paths
      .map((p) => Math.min(p.start.x, p.end.x))
      .reduce((a, b) => Math.min(a, b)) - 1;
  const minY = 0;

  const maxX = paths
    .map((p) => Math.max(p.start.x, p.end.x))
    .reduce((a, b) => Math.max(a, b));
  const maxY = paths
    .map((p) => Math.max(p.start.y, p.end.y))
    .reduce((a, b) => Math.max(a, b));

  const offsetPaths = paths.map((p) => {
    return {
      start: { x: p.start.x - minX, y: p.start.y - minY },
      end: { x: p.end.x - minX, y: p.end.y - minY },
    };
  });

  const matrix = Array.from({ length: maxY + 1 }, () =>
    Array.from({ length: maxX + 2 }, () => 0),
  );

  for (const path of offsetPaths) {
    for (let x = path.start.x; x <= path.end.x; x++) {
      for (let y = path.start.y; y <= path.end.y; y++) {
        matrix[y][x] = Tile.Rock;
      }
      for (let y = path.end.y; y <= path.start.y; y++) {
        matrix[y][x] = Tile.Rock;
      }
    }
    for (let x = path.end.x; x <= path.start.x; x++) {
      for (let y = path.start.y; y <= path.end.y; y++) {
        matrix[y][x] = Tile.Rock;
      }
      for (let y = path.end.y; y <= path.start.y; y++) {
        matrix[y][x] = Tile.Rock;
      }
    }
  }

  const origin = { x: 500 - minX, y: 0 };
  matrix[origin.y][origin.x] = Tile.Source;
  let count = 0;
  while (true) {
    count++;
    const sandPosition = { ...origin };
    let atRest = false;
    while (!atRest) {
      // down
      if (
        sandPosition.x === 0 ||
        sandPosition.x === matrix[0].length - 1 ||
        sandPosition.y === matrix.length - 1
      ) {
        printMatrix(matrix, sandMatrixTransformer);
        return count - 1;
      }
      if (matrix[sandPosition.y + 1][sandPosition.x] === Tile.Air) {
        sandPosition.y += 1;
        // down left
      } else if (matrix[sandPosition.y + 1][sandPosition.x - 1] === Tile.Air) {
        sandPosition.y += 1;
        sandPosition.x -= 1;
        // down right
      } else if (matrix[sandPosition.y + 1][sandPosition.x + 1] === Tile.Air) {
        sandPosition.y += 1;
        sandPosition.x += 1;
        // resting
      } else {
        atRest = true;
        matrix[sandPosition.y][sandPosition.x] = Tile.Sand;
      }
    }
  }
  return;
};

const part2 = (rawInput: string) => {
  const paths = parseInput(rawInput);
  const maxY =
    paths
      .map((p) => Math.max(p.start.y, p.end.y))
      .reduce((a, b) => Math.max(a, b)) + 2;
  const minX = 500 - maxY - 5;

  const offsetPaths = paths.map((p) => {
    return {
      start: { x: p.start.x - minX, y: p.start.y },
      end: { x: p.end.x - minX, y: p.end.y },
    };
  });

  const maxX =
    offsetPaths
      .map((p) => Math.max(p.start.x, p.end.x))
      .reduce((a, b) => Math.max(a, b)) + maxY;
  offsetPaths.push({
    start: { x: 0, y: maxY },
    end: { x: maxX, y: maxY },
  });

  const matrix = Array.from({ length: maxY + 1 }, () =>
    Array.from({ length: maxX + 1 }, () => 0),
  );

  for (const path of offsetPaths) {
    for (let x = path.start.x; x <= path.end.x; x++) {
      for (let y = path.start.y; y <= path.end.y; y++) {
        matrix[y][x] = Tile.Rock;
      }
      for (let y = path.end.y; y <= path.start.y; y++) {
        matrix[y][x] = Tile.Rock;
      }
    }
    for (let x = path.end.x; x <= path.start.x; x++) {
      for (let y = path.start.y; y <= path.end.y; y++) {
        matrix[y][x] = Tile.Rock;
      }
      for (let y = path.end.y; y <= path.start.y; y++) {
        matrix[y][x] = Tile.Rock;
      }
    }
  }

  const origin = { x: 500 - minX, y: 0 };
  matrix[origin.y][origin.x] = Tile.Source;
  let count = 0;
  while (matrix[origin.y][origin.x] === Tile.Source) {
    count++;
    const sandPosition = { ...origin };
    let atRest = false;
    while (!atRest) {
      // down
      if (matrix[sandPosition.y + 1][sandPosition.x] === Tile.Air) {
        sandPosition.y += 1;
        // down left
      } else if (matrix[sandPosition.y + 1][sandPosition.x - 1] === Tile.Air) {
        sandPosition.y += 1;
        sandPosition.x -= 1;
        // down right
      } else if (matrix[sandPosition.y + 1][sandPosition.x + 1] === Tile.Air) {
        sandPosition.y += 1;
        sandPosition.x += 1;
        // resting
      } else {
        atRest = true;
        matrix[sandPosition.y][sandPosition.x] = Tile.Sand;
      }
    }
  }

  printMatrix(matrix, sandMatrixTransformer);
  return count;
};

const testInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

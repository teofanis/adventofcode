import run from "aocrunner";
import { MatrixUtils } from "../../../src/utils/index.js";

interface Point {
  x: number;
  y: number;
}

const parseInput = (rawInput: string): string[][] =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const pointToString = (point: Point): string => `(${point.x},${point.y})`;

const makeCoprime = (point: Point): Point => {
  const gcd = (a: number, b: number): number =>
    b === 0 ? Math.abs(a) : gcd(b, a % b);
  const divisor = gcd(point.x, point.y);
  return {
    x: point.x / divisor,
    y: point.y / divisor,
  };
};
const calculateAntinodes = (first: Point, second: Point): [Point, Point] => {
  const antinode1 = {
    x: 2 * first.x - second.x,
    y: 2 * first.y - second.y,
  };

  const antinode2 = {
    x: 2 * second.x - first.x,
    y: 2 * second.y - first.y,
  };

  return [antinode1, antinode2];
};

const findAntinodes = (rawInput: string, includeAntennas: boolean): number => {
  const matrix = parseInput(rawInput);
  const width = matrix[0].length;
  const height = matrix.length;

  const antennas = new Map<string, Point[]>();
  MatrixUtils.map(matrix, (value, row, col) => {
    if (/[a-zA-Z0-9]/.test(value)) {
      if (!antennas.has(value)) {
        antennas.set(value, []);
      }
      antennas.get(value)!.push({ x: col, y: row });
    }
    return value;
  });

  const antinodeLocations = new Set<string>();

  for (const [frequency, points] of antennas.entries()) {
    for (let i = 0; i < points.length; i++) {
      const first = points[i];

      if (includeAntennas) {
        antinodeLocations.add(pointToString(first));
      }

      for (let j = i + 1; j < points.length; j++) {
        const second = points[j];

        const [antinode1, antinode2] = calculateAntinodes(first, second);

        if (MatrixUtils.isInBounds(matrix, antinode1.y, antinode1.x)) {
          antinodeLocations.add(pointToString(antinode1));
        }

        if (MatrixUtils.isInBounds(matrix, antinode2.y, antinode2.x)) {
          antinodeLocations.add(pointToString(antinode2));
        }

        if (includeAntennas) {
          const delta = makeCoprime({
            x: second.x - first.x,
            y: second.y - first.y,
          });

          for (const direction of [1, -1]) {
            let multiplier = direction;
            let inBounds = true;

            while (inBounds) {
              const antinode = {
                x: first.x + delta.x * multiplier,
                y: first.y + delta.y * multiplier,
              };

              if (MatrixUtils.isInBounds(matrix, antinode.y, antinode.x)) {
                antinodeLocations.add(pointToString(antinode));
              } else {
                inBounds = false;
              }

              multiplier += direction;
            }
          }
        }
      }
    }
  }

  return antinodeLocations.size;
};

const part1 = (rawInput: string): number => {
  return findAntinodes(rawInput, false);
};

const part2 = (rawInput: string) => {
  return findAntinodes(rawInput, true);
};

const testInput = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

import run from "aocrunner";

type Direction = "R" | "L" | "U" | "D";
type Input = {
  direction: Direction;
  value: number;
}[];

type Coordinates = {
  x: number;
  y: number;
};

type HeadAndTailCoordinates = {
  head: Coordinates;
  tail: Coordinates;
};

const parseInput = (rawInput: string): Input => {
  return rawInput.split("\n").map((line) => {
    const [direction, value] = line.split(" ");
    return {
      direction: direction as Direction,
      value: value ? parseInt(value, 10) : 0,
    };
  });
};

const moveTail = (coordinates: HeadAndTailCoordinates) => {
  const { head, tail } = coordinates;
  const headTouchesTail =
    Math.abs(head.x - tail.x) <= 1 && Math.abs(head.y - tail.y) <= 1;
  if (headTouchesTail) return;

  if (head.y > tail.y) {
    tail.y++;
  } else if (head.y < tail.y) {
    tail.y--;
  }

  if (head.x > tail.x) {
    tail.x++;
  } else if (head.x < tail.x) {
    tail.x--;
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const visited: Record<number, Set<number>> = { 0: new Set([0]) };

  const coordinates: HeadAndTailCoordinates = {
    head: {
      x: 0,
      y: 0,
    },
    tail: {
      x: 0,
      y: 0,
    },
  };
  for (const { direction, value } of input) {
    for (let i = 0; i < value; i++) {
      switch (direction) {
        case "R":
          coordinates.head.x++;
          break;
        case "L":
          coordinates.head.x--;
          break;
        case "U":
          coordinates.head.y++;
          break;
        case "D":
          coordinates.head.y--;
          break;
      }
      const { head, tail } = coordinates;
      moveTail(coordinates);
      if (!visited[tail.y]) {
        visited[tail.y] = new Set();
      }
      visited[tail.y].add(tail.x);
    }
  }
  return Object.values(visited).reduce((acc, row) => {
    return acc + row.size;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const visited: Record<number, Set<number>> = { 0: new Set([0]) };
  const coordinateSystem = new Array(9).fill({
    x: 0,
    y: 0,
  }) as Coordinates[];

  for (const { direction, value } of input) {
    for (let i = 0; i < value; i++) {
      const head = coordinateSystem[0];
      switch (direction) {
        case "R":
          head.x++;
          break;
        case "L":
          head.x--;
          break;
        case "U":
          head.y++;
          break;
        case "D":
          head.y--;
          break;
      }
      for (let ti = 1; ti < coordinateSystem.length; ti++) {
        moveTail({
          head: coordinateSystem[ti - 1],
          tail: coordinateSystem[ti],
        });
      }

      const tail = coordinateSystem[coordinateSystem.length - 1];

      if (!visited[tail.y]) {
        visited[tail.y] = new Set();
      }
      visited[tail.y].add(tail.x);
    }
  }

  return Object.values(visited).reduce((acc, row) => {
    return acc + row.size;
  }, 0);
};

const testInput = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 13,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 36,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

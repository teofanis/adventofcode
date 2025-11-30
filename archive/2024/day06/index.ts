import run from "aocrunner";
import { printMatrix } from "../../../src/utils/index.js";

type Position = {
  x: number;
  y: number;
};

type State = {
  position: Position;
  direction: string;
};

const parseInput = (rawInput: string): string[][] =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const GUARD = ["^", ">", "<", "v"];

const findPosition = (grid: string[][]): Position => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (GUARD.includes(grid[i][j])) {
        return { x: i, y: j };
      }
    }
  }
  throw new Error("Guard position not found.");
};

const turnRight = (direction: string): string => {
  const directions: Record<string, string> = {
    "^": ">",
    ">": "v",
    v: "<",
    "<": "^",
  };
  return directions[direction];
};

const moveForward = (
  grid: string[][],
  currentState: State,
): { grid: string[][]; state: State } => {
  const { position, direction } = currentState;

  const moves: Record<string, { dx: number; dy: number }> = {
    "^": { dx: -1, dy: 0 },
    ">": { dx: 0, dy: 1 },
    v: { dx: 1, dy: 0 },
    "<": { dx: 0, dy: -1 },
  };

  const { dx, dy } = moves[direction];
  const nextPos = { x: position.x + dx, y: position.y + dy };

  const isWithinBounds =
    nextPos.x >= 0 &&
    nextPos.x < grid.length &&
    nextPos.y >= 0 &&
    nextPos.y < grid[0].length;

  if (isWithinBounds && grid[nextPos.x][nextPos.y] === "#") {
    const newDirection = turnRight(direction);
    return {
      grid,
      state: {
        position,
        direction: newDirection,
      },
    };
  }
  if (isWithinBounds && grid[nextPos.x][nextPos.y] !== "#") {
    grid[position.x][position.y] = "X";
    grid[nextPos.x][nextPos.y] = direction;
    return {
      grid,
      state: {
        position: nextPos,
        direction,
      },
    };
  }

  const newDirection = direction;
  return {
    grid,
    state: {
      position,
      direction: newDirection,
    },
  };
};

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput);
  printMatrix(input);

  const initialPosition = findPosition(input);
  const initialState: State = {
    position: initialPosition,
    direction: input[initialPosition.x][initialPosition.y],
  };

  const visited = new Set<string>();
  const seenStates = new Set<string>();
  let grid = input;
  let currentState = initialState;

  while (
    currentState.position.x >= 0 &&
    currentState.position.x < grid.length &&
    currentState.position.y >= 0 &&
    currentState.position.y < grid[0].length
  ) {
    const stateKey = `${currentState.position.x},${currentState.position.y},${currentState.direction}`;
    if (seenStates.has(stateKey)) {
      console.error("Infinite loop detected!");
      break;
    }
    seenStates.add(stateKey);

    visited.add(`${currentState.position.x},${currentState.position.y}`);
    const { grid: newGrid, state: newState } = moveForward(grid, currentState);
    // console.log(
    //   `Moved from ${JSON.stringify(currentState)} -> ${JSON.stringify(newState)}`
    // );
    grid = newGrid;
    currentState = newState;
  }

  console.log(visited, printMatrix(grid));
  return visited.size;
};

const part2 = (rawInput: string): number => {
  const input = parseInput(rawInput);

  return 0;
};

const testInput = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 41,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

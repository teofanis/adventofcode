import run from "aocrunner";
import { chunks } from "../utils/index.js";

type Position = { x: number; y: number };
type Machine = { buttonA: Position; buttonB: Position; prize: Position };

const parseInput = (rawInput: string) => {
  const parsed = rawInput
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/(\d+)/gm);
      if (!match) {
        throw new Error("Invalid input");
      }
      return { x: parseInt(match[0], 10) ?? 0, y: parseInt(match[1], 10) };
    });
  return [...chunks(parsed, 3)].map((machine) => {
    const [buttonA, buttonB, prize] = machine;
    return {
      buttonA,
      buttonB,
      prize,
    };
  });
};

function solveForTokens(
  machine: Machine,
  maxPresses: number = 100,
): number | null {
  const { buttonA, buttonB, prize } = machine;

  let minTokens: number | null = null;

  for (let nA = 0; nA <= maxPresses; nA++) {
    for (let nB = 0; nB <= maxPresses; nB++) {
      const x = nA * buttonA.x + nB * buttonB.x;
      const y = nA * buttonA.y + nB * buttonB.y;

      if (x === prize.x && y === prize.y) {
        const tokens = 3 * nA + nB;
        if (minTokens === null || tokens < minTokens) {
          minTokens = tokens;
        }
      }
    }
  }

  return minTokens;
}

function findMinimumTokens(
  machines: Machine[],
  maxPresses: number = 100,
): number {
  let totalTokens = 0;
  let prizesWon = 0;

  for (const machine of machines) {
    const tokens = solveForTokens(machine, maxPresses);
    if (tokens !== null) {
      totalTokens += tokens;
      prizesWon++;
    }
  }

  return totalTokens;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return findMinimumTokens(input);
};

const part2 = (rawInput: string) => {
  const machines = parseInput(rawInput).map((machine) => {
    return {
      ...machine,
      prize: {
        x: parseInt(`10000000000000${machine.prize.x}`, 10),
        y: parseInt(`10000000000000${machine.prize.y}`, 10),
      },
    };
  });
  console.log(machines);
  return 0;
};

const testInput = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 480,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

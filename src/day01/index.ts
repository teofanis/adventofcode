import run from "aocrunner";

type ListRegister = {
  leftList: number[];
  rightList: number[];
};

const parseInput = (rawInput: string): ListRegister => {
  const leftList: number[] = [];
  const rightList: number[] = [];

  rawInput.trim().split("\n").forEach((line) => {
    const [left, right] = line.split(/\s+/).map(Number);
    leftList.push(left);
    rightList.push(right);
  });

  return { leftList, rightList };
};

const part1 = (rawInput: string): number => {
  const { leftList, rightList } = parseInput(rawInput);

  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);

  return leftList.reduce((totalDistance, left, index) => {
    return totalDistance + Math.abs(left - rightList[index]);
  }, 0);
};

const part2 = (rawInput: string): number => {
  const { leftList, rightList } = parseInput(rawInput);

  const occurrences = new Map<number, number>();
  for (const num of rightList) {
    occurrences.set(num, (occurrences.get(num) || 0) + 1);
  }

  return leftList.reduce((sum, num) => {
    const count = occurrences.get(num) || 0;
    return sum + num * count;
  }, 0);
};

// Test input
const testInput = `
3   4
4   3
2   5
1   3
3   9
3   3
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

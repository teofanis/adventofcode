import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput
    .split("\n")
    .map((num) => {
      const parsed = parseInt(num, 10);
      if (isNaN(parsed)) return 0;
      return parsed;
    })
    .reduce((acc, curr, currIndex) => {
      const lineIndex = currIndex === 0 ? 0 : acc.length - 1;
      const currentLineArray = acc[lineIndex] || [];
      if (curr === 0) {
        acc.push([]);
        return acc;
      }
      currentLineArray.push(curr);
      acc[lineIndex] = currentLineArray;
      return acc;
    }, new Array<Array<number>>());
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const summedCaloriesPerElf = input.map((elf) =>
    elf.reduce((acc, curr) => acc + curr, 0),
  );
  return Math.max(...summedCaloriesPerElf);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const summedCaloriesPerElf = input
    .map((elf) => elf.reduce((acc, curr) => acc + curr, 0))
    .sort((a, b) => b - a);
  return summedCaloriesPerElf.slice(0, 3).reduce((acc, curr) => acc + curr, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        5213
        1234

        4251
        4215
        73

        2313
        5000

        `,
        expected: 8539,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        5213
        1234

        4251
        4215
        73

        2313
        5000
        
        5125
        2541
        23

        3123
        1515
        `,
        expected: 23541,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

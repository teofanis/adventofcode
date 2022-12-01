import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput
    .split("\n")
    .map(Number)
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
    }, new Array<Array<Number>>());
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const summedCaloriesPerElf = input.map((elf) =>
    elf.reduce((acc, curr) => Number(acc) + Number(curr), 0),
  );
  // @ts-ignore
  return Math.max(...summedCaloriesPerElf);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const summedCaloriesPerElf = input
    .map((elf) => elf.reduce((acc, curr) => Number(acc) + Number(curr), 0))
    .sort((a, b) => Number(b) - Number(a));
  // @ts-ignore
  return  summedCaloriesPerElf
    .slice(0, 3)
    .reduce((acc, curr) => Number(acc) + Number(curr), 0) as number;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

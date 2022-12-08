import run from "aocrunner";

type Backpack = {
  compartment1: string;
  compartment2: string;
};

const parseInput = (rawInput: string): string[] => {
  return rawInput.split("\n");
};

const findCommonItems = (compartment1: string, compartment2: string) => {
  return compartment1.split("").filter((item) => compartment2.includes(item));
};

const calculatePriority = (letter: string) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let letterIndex = alphabet.indexOf(letter) + 1;
  if (!letterIndex) {
    letterIndex = alphabet.toUpperCase().indexOf(letter) + 1 + 26;
  }
  return letterIndex;
};

const part1 = (rawInput: string) => {
  const backpacks = parseInput(rawInput).map((bag) => {
    return {
      compartment1: bag.slice(0, bag.length / 2),
      compartment2: bag.slice(bag.length / 2, bag.length),
    };
  }) as Backpack[];
  const prioritySum = backpacks.reduce(
    (acc, { compartment1, compartment2 }) => {
      const [commonItem] = findCommonItems(compartment1, compartment2);
      return acc + calculatePriority(commonItem);
    },
    0,
  );
  return prioritySum;
};

const part2 = (rawInput: string) => {
  const backpacks = parseInput(rawInput);
  // chunk the backpacks into groups of 3
  const groups = backpacks.reduce((acc, backpack, index) => {
    const groupIndex = Math.floor(index / 3);
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(backpack);
    return acc;
  }, [] as string[][]);

  const prioritySum = groups.reduce((acc, group) => {
    const [compartment1, compartment2, compartment3] = group;
    const commonItems = findCommonItems(compartment1, compartment2);
    const [commonItem] = findCommonItems(compartment3, commonItems.join(""));
    return acc + calculatePriority(commonItem);
  }, 0);
  return prioritySum;
};

const testInput = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

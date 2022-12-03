import run from "aocrunner";

type Backpack = {
  compartment1: string;
  compartment2: string;
};

const parseInput = (rawInput: string) : Backpack[] => {
  return rawInput.split("\n").map((bag) => {
    return {
      compartment1:  bag.slice(0, bag.length/2),
      compartment2:  bag.slice(bag.length/2, bag.length),
    }
  });
};

const findCommonItems = (compartment1: string, compartment2: string) => {
  return compartment1.split("").filter((item) => compartment2.includes(item));
};

const calculatePriority = (letter : string) => {

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let letterIndex = alphabet.indexOf(letter) + 1;
    if (!letterIndex) {
      letterIndex = alphabet.toUpperCase().indexOf(letter) + 1 + 26;
    }
    return letterIndex;
};


const part1 = (rawInput: string) => {
  const backpacks = parseInput(rawInput);
  const prioritySum = backpacks.reduce((acc, {compartment1, compartment2}) =>  {
    const [commonItem] = findCommonItems(compartment1, compartment2)
    return acc + calculatePriority(commonItem);
  }, 0);
  return prioritySum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};


const testInput = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`
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
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const [value, numbers] = line.split(":");

    return {
      value: parseInt(value, 10),
      candidates: numbers
        .trim()
        .trimEnd()
        .split(" ")
        .map((n) => parseInt(n, 10)),
    };
  });

type Operation = (a: number, b: number) => number;
const isEquationPossible = (
  numbers: number[],
  expected: number,
  operations: Operation[],
) => {
  let resultSet: Set<number>[] = [new Set([numbers[0]])];

  for (let i = 1; i < numbers.length; i++) {
    const nextNumber = numbers[i];
    const currentSet = resultSet[i - 1];
    const nextSet = new Set<number>();

    for (const result of currentSet) {
      operations.forEach((operation) => {
        nextSet.add(operation(result, nextNumber));
      });
      nextSet.add(result + nextNumber);
      nextSet.add(result * nextNumber);
    }
    resultSet.push(nextSet);
  }
  return resultSet[resultSet.length - 1].has(expected);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const operations: Operation[] = [(a, b) => a + b, (a, b) => a * b];
  return input
    .filter((r) => isEquationPossible(r.candidates, r.value, operations))
    .reduce((acc, cur) => {
      return (acc += cur.value);
    }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const operations: Operation[] = [
    (a, b) => a + b,
    (a, b) => a * b,
    (a, b) => parseInt(`${a}${b}`, 10),
  ];
  return input
    .filter((r) => isEquationPossible(r.candidates, r.value, operations))
    .reduce((acc, cur) => {
      return (acc += cur.value);
    }, 0);
};

const testInput = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 3749,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 11387,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

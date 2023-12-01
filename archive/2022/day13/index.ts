import run from "aocrunner";

type NestedArray = number | number[] | NestedArray[];

type Signal = {
  left: NestedArray;
  right: NestedArray;
};

const parseInput = (rawInput: string): Signal[] => {
  const signals = rawInput.split("\n\n").map((signal) => {
    const [left, right] = signal.split("\n");
    return {
      left: JSON.parse(left),
      right: JSON.parse(right),
    };
  });
  return signals;
};

const compare = (left: NestedArray, right: NestedArray): number => {
  if (Array.isArray(left) && Array.isArray(right)) {
    for (let index = 0; index < left.length; index++) {
      if (index === right.length) {
        return -1;
      }
      const compared = compare(left[index], right[index]);
      if (compared !== 0) return compared;
    }
    if (left.length < right.length) return 1;
    return 0;
  }

  if (Array.isArray(left)) {
    return compare(left, [right]);
  }
  if (Array.isArray(right)) {
    return compare([left], right);
  }

  return right - left;
};

const isInRightOrder = (left: NestedArray, right: NestedArray): boolean => {
  return compare(left, right) > 0;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce(
    (acc, { left, right }, currIndex) =>
      acc + (isInRightOrder(left, right) ? currIndex + 1 : 0),
    0,
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const flattened = input.flatMap(({ left, right }) => [left, right]);
  const two = [[2]];
  const six = [[6]];
  flattened.push(two, six);
  flattened.sort((a, b) => compare(b, a));
  const twoIndex = flattened.indexOf(two) + 1;
  const sixIndex = flattened.indexOf(six) + 1;

  return twoIndex * sixIndex;
};

const testInput = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

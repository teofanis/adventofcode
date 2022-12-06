import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let previousCharacters = [];
  let firstSignal = -1;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const fourChars = new Set([...previousCharacters.slice(-3), char]);
    if (fourChars.size === 4) {
      firstSignal = i + 1;
      break;
    }
    previousCharacters.push(char);
  }

  return firstSignal;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let previousCharacters = [];
  let characterBeforeFirstMessage = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const fourChars = new Set([...previousCharacters.slice(-13), char]);
    if (fourChars.size === 14) {
      characterBeforeFirstMessage = i + 1;
      break;
    }
    previousCharacters.push(char);
  }

  return characterBeforeFirstMessage;
};

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 5,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 6,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 10,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 23,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 23,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 29,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

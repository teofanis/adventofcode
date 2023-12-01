import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).map((line) =>
    line.filter(Number).map(Number),
  );
  return input
    .map((numbers) => {
      const first = numbers[0];
      const last = numbers[numbers.length - 1];
      return parseInt([first, last].join(""), 10);
    })
    .reduce((acc, curr) => acc + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).map((line) => line.join(""));
  const numbersMap = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  const numbers = Object.values(numbersMap)
    .map((num) => num.toString())
    .join("");
  let sum = 0;
  input.forEach((word) => {
    const numbersInWord: string[] = [];
    for (let i = 0; i < word.length; i++) {
      if (numbers.includes(word[i])) {
        numbersInWord.push(word[i]);
      }
      for (let j = 3; j <= 5; j++) {
        const spelledNumber = word.substring(i, i + j);
        if (spelledNumber in numbersMap) {
          numbersInWord.push(
            numbersMap[
              spelledNumber as keyof typeof numbersMap
            ] as unknown as string,
          );
        }
      }
    }
    const first = numbersInWord[0];
    const last = numbersInWord[numbersInWord.length - 1];
    sum += parseInt([first, last].join(""), 10);
  });
  return sum;
};

const testInput1 = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`;
const testInput2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;

run({
  part1: {
    tests: [
      {
        input: testInput1,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput2,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

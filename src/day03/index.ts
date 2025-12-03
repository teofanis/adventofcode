import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const bestKDigits = (s: string, k: number): number => {
  const stack: string[] = [];
  let toRemove = s.length - k;  // how many digits we are allowed to drop

  for (let i = 0; i < s.length; i++) {
    const d = s[i];

    // Remove smaller digits from stack if beneficial
    while (toRemove > 0 && stack.length > 0 && stack[stack.length - 1] < d) {
      stack.pop();
      toRemove--;
    }

    stack.push(d);
  }

  // If still need to remove digits (e.g., monotonic descending input)
  return parseInt(stack.slice(0, k).join(""),10);
};

const part1 = (rawInput: string) => parseInput(rawInput)
  .map((v)=>bestKDigits(v,2)).reduce((a,b) => a+b,0);

const part2 = (rawInput: string) => parseInput(rawInput)
  .map((v)=>bestKDigits(v,12)).reduce((a,b) => a+b,0);

const testInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 357,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 3121910778619,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

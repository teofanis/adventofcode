import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.trim().split("\n\n");

const isFresh = (range: number[], candidate: number): boolean => ((candidate >= Math.min(...range)) && (Math.max(...range) >= candidate));

const part1 = (rawInput: string) => {
  const [rangesRaw, numbersRaw] = parseInput(rawInput);
  const ranges: number[][] = rangesRaw
    .split('\n')
    .map((r) => r.split('-').map(Number));
  const numbers = numbersRaw.split('\n').map(Number);

  return numbers.reduce((acc, v) => {
    if (ranges.some((range) => isFresh(range, v))) acc++
    return acc;
  }, 0)

};

const part2 = (rawInput: string) => {
  const [rangesRaw, _] = parseInput(rawInput);
  const ranges: number[][] = rangesRaw
    .split('\n')
    .map((r) => r.split('-').map(Number))
    .sort((a, b) => a[0] - b[0]);
  const merged = ranges.reduce<number[][]>((acc, [start, end]) => {
    if (!acc.length) return [[start, end]];
    const last = acc[acc.length - 1];
    if (start <= last[1] + 1) {
      last[1] = Math.max(last[1], end); // merge
    } else {
      acc.push([start, end]);
    }
    return acc;
  }, []);
  return merged
    .map(([start, end]) => end - start + 1) // inclusive
    .reduce((sum, len) => sum + len, 0);

};

const testInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 14,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

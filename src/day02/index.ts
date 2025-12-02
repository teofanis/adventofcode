import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(',');
const isInvalidID =  (n: number): boolean => {
  const s = String(n);
  if (s.length % 2 !== 0) return false;
  const half = s.length / 2;
  const first = s.slice(0, half);
  const second = s.slice(half);
  return first === second;
}
 const isInvalidID2 = (n: number): boolean => {
  const s = String(n);
  const L = s.length;

  // Try all possible substring lengths
  for (let d = 1; d <= L / 2; d++) {
    if (L % d !== 0) continue;   // must divide length
    const count = L / d;
    if (count < 2) continue;     // must repeat at least twice

    const part = s.slice(0, d);
    if (part.repeat(count) === s) return true;
  }
  return false;
};

const part1 = (rawInput: string) => {
  return parseInput(rawInput).reduce(
    (acc, range) => {
      const [first, last] = range.split('-').map(Number);
      for (let n = first; n <= last; n++) {
        if (isInvalidID(n)) acc += n;
      }
      return acc;
    },
    0
  );
};

const part2 = (rawInput: string) => {
  return parseInput(rawInput).reduce((acc, range) => {
    const [first, last] = range.split('-').map(Number);
    for (let n = first; n <= last; n++) {
      if (isInvalidID2(n)) acc += n;
    }
    return acc;
  }, 0);
};

const testInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 1227775554,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 4174379265,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

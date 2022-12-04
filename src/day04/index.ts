import run from "aocrunner";

type SectionRange = {
  start: number;
  end: number;
};

type PairRange = SectionRange[][];

const parseInput = (rawInput: string): PairRange => {
  return rawInput.split("\n").map((pair) => {
    const [sectionOneRange, sectionTwoRange] = pair.split(",");
    const [sectionOneStart, sectionOneEnd] = sectionOneRange
      .split("-")
      .map((n) => parseInt(n, 10));
    const [sectionTwoStart, sectionTwoEnd] = sectionTwoRange
      .split("-")
      .map((n) => parseInt(n, 10));

    return [
      {
        start: sectionOneStart,
        end: sectionOneEnd,
      },
      {
        start: sectionTwoStart,
        end: sectionTwoEnd,
      },
    ];
  });
};

const checkForSectionOverlap = (
  sectionOne: SectionRange,
  sectionTwo: SectionRange,
): boolean => {
  const sectionOneIncluded =
    sectionOne.start >= sectionTwo.start && sectionOne.end <= sectionTwo.end;
  const sectionTwoIncluded =
    sectionTwo.start >= sectionOne.start && sectionTwo.end <= sectionOne.end;
  return sectionOneIncluded || sectionTwoIncluded;
};

const part1 = (rawInput: string) => {
  const pairRanges = parseInput(rawInput);
  const inclusivePairs = pairRanges.filter(([sectionOne, sectionTwo]) =>
    checkForSectionOverlap(sectionOne, sectionTwo),
  );
  return inclusivePairs.length;
};

const part2 = (rawInput: string) => {
  const pairRanges = parseInput(rawInput);
  const intersectionPairs = pairRanges.filter(([sectionOne, sectionTwo]) => {
    const sectionOneIsSmaller = sectionOne.start <= sectionTwo.start;
    const sectionOneIntersects = sectionOneIsSmaller
      ? sectionOne.end >= sectionTwo.start
      : sectionOne.start <= sectionTwo.end;
    const sectionTwoIntersects = sectionOneIsSmaller
      ? sectionOne.end >= sectionTwo.start
      : sectionOne.start <= sectionTwo.end;
    return sectionOneIntersects || sectionTwoIntersects;
  });
  return intersectionPairs.length;
};

const testInput = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

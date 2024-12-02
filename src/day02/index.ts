import run from "aocrunner";

type Report = number[];

const parseInput = (rawInput: string): Report[] =>
  rawInput
    .split("\n")
    .map((line) => line.split(" ").map((i) => parseInt(i, 10)));

const FLUCTUATION_LIMIT = 3;

const isSafe = (from: number, to: number) => {
  return Math.abs(from - to) <= FLUCTUATION_LIMIT;
};

const getAdjacentValues = (index: number, report: Report) => {
  return index === 0
    ? [null, report[index + 1]]
    : index === report.length - 1
    ? [report[index - 1], null]
    : [report[index - 1], report[index + 1]];
};

const isFluctuatingNormally = (report: Report) => {
  return report.every((value, i) => {
    const [prev, next] = getAdjacentValues(i, report);
    if (!prev && next) {
      return isSafe(value, next);
    } else if (prev && !next) {
      return isSafe(value, prev);
    } else if (prev && next) {
      return isSafe(value, prev) && isSafe(value, next);
    } else {
      return false;
    }
  });
};

const isIncreasing = (report: Report, tolerance: number = 0) => {
  let errors = 0;
  return report.every((value, index, array) => {
    if (index === 0) return true;
    if (value <= array[index - 1]) errors++;
    return errors <= tolerance;
  });
};

const isDecreasing = (report: Report, tolerance: number = 0) => {
  let errors = 0;
  return report.every((value, index, array) => {
    if (index === 0) return true;
    if (value >= array[index - 1]) errors++;
    return errors <= tolerance;
  });
};

const debugFormat = (reports: Report[], tolerance = 0) => {
  reports.forEach((value) => {
    console.log(`Running scan on ${value}`);
    value.forEach((number, i) => {
      const [prev, next] = getAdjacentValues(i, value);
      console.log(
        `Current number is : ${number} with previous ${prev} and next ${next}`,
      );
    });
    const result = isReportSafe(value);
    const output = result ? "Safe" : "Unsafe";
    console.log(`Report ${value} is : ${result ? "Safe" : "Unsafe"}`);
    const fluctuation = isFluctuatingNormally(value);
    const decreases = isDecreasing(value, tolerance);
    const increases = isIncreasing(value, tolerance);
    console.log(
      `Report was dimmed ${output} because it is fluctuation was ${
        fluctuation ? "normal" : "wrong"
      } and all the values are ${
        decreases ? "decreasing" : increases ? "increasing" : "wtf"
      }`,
    );
    console.log("------------------------------------");
  });
};

const isReportSafe = (report: Report) =>
  isFluctuatingNormally(report) &&
  (isDecreasing(report) || isIncreasing(report));

const isReportSafeWithDampening = (report: Report) => {
  if (isReportSafe(report)) return true;

  for (let i = 0; i < report.length; i++) {
    const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
    if (
      isFluctuatingNormally(modifiedReport) &&
      (isDecreasing(modifiedReport) || isIncreasing(modifiedReport))
    ) {
      return true;
    }
  }

  return false;
};
const part1 = (rawInput: string) => {
  const reports = parseInput(rawInput);
  return reports.filter(isReportSafe).length;
};

const part2 = (rawInput: string) => {
  const reports = parseInput(rawInput);
  return reports.filter(isReportSafeWithDampening).length;
};

const testInput = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
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
  onlyTests: true,
});

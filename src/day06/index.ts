import run from "aocrunner";

const parseInput = (rawInput: string) => {
const lines = rawInput.trim().split('\n').map(line => 
    line.trim().split(/\s+/) 
  );
  const operants = lines.pop() as string[];
  const numbers: number[][] = lines.map(row => row.map(Number));
  return { numbers, operants };
};

const part1 = (rawInput: string) => {
  const { numbers, operants } = parseInput(rawInput);
  const numCols = numbers[0].length;

  const results = Array(numCols).fill(0).map((_, col) => {
    const colValues = numbers.map(row => row[col]);
    const op = operants[col];
    if (op === '*') return colValues.reduce((a, b) => a * b, 1);
    if (op === '+') return colValues.reduce((a, b) => a + b, 0);
    throw new Error(`Unknown operator: ${op}`);
  });

  return results.reduce((acc, v) => acc+v,0);
};

const parseCephalopodInput = (rawInput: string) => {
  const lines = rawInput.trimEnd().split('\n');
  const opLine = lines.pop()!;
  const operants = opLine.trim().split(/\s+/);
  const numCols = operants.length;

  const columns: number[][] = Array.from({ length: numCols }, () => []);

  for (const row of lines) {
    let colIndex = 0;
    let i = 0;
    while (colIndex < numCols && i < row.length) {
      while (i < row.length && row[i] === ' ') i++;
      let numStr = '';
      while (i < row.length && row[i] !== ' ') {
        numStr += row[i];
        i++;
      }
      columns[colIndex].push(Number(numStr));
      colIndex++;
    }
  }

  return { numbers: columns, operants };
};


const part2 = (rawInput: string) => {
  const { numbers, operants } = parseCephalopodInput(rawInput);
  const reconstructed = numbers.map(col =>
    col.reduce((acc, d) => acc * 10 + d, 0)
  );

  const results = reconstructed.map((num, i) => {
    const op = operants[i];
    if (op === '+') return num;
    if (op === '*') return num;
    throw new Error(`Unknown operator: ${op}`);
  });

  return results.reduceRight((acc, val) => acc + val, 0);
};


const testInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   + `;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 4277556,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 3263827,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

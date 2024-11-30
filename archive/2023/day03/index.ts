import run from "aocrunner";

type BaseEntity = {
  x: number;
  y: number;
  token: string;
};
type NumberEntity = BaseEntity & {
  type: 'number';
  value: number;
};
type SymbolEntity = BaseEntity & {
  type: 'symbol';
};
type Entity =  NumberEntity | SymbolEntity;
const parseInput = (rawInput: string) => {
  const entities: Entity[] = [];
  rawInput.split("\n").forEach((line, y) => {
    Array.from(line.matchAll(/\d+/g)).forEach(m => {
      entities.push({ type: 'number', x: m.index, y, value: parseInt(m[0]), token: m[0] });
    });
    Array.from(line.matchAll(/[^0-9\.]/g)).forEach(m => {
      entities.push({ type: 'symbol', x: m.index, y, token: m[0] });
    });
  });
  return entities;
};

const isAdjacent = (numEntity: NumberEntity, symEntity: SymbolEntity) => {
  const numX0 = numEntity.x;
  const numX1 = numEntity.x + numEntity.value.toString().length - 1;
  const numY = numEntity.y;

  return (
    symEntity.y >= numY - 1 && symEntity.y <= numY + 1 &&
    symEntity.x >= numX0 - 1 && symEntity.x <= numX1 + 1
  );
};
const part1 = (rawInput: string) => {
  const entities = parseInput(rawInput);
  const numbers = entities.filter(e => e.type === 'number') as NumberEntity[];
  const symbols = entities.filter(e => e.type === 'symbol') as SymbolEntity[];

  const sum = numbers
    .filter(n => symbols.some(s => isAdjacent(n, s)))
    .reduce((acc, curr) => acc + curr.value, 0);

  return sum;
};


const part2 = (rawInput: string) => {
  const entities = parseInput(rawInput);
  const numbers = entities.filter(e => e.type === 'number') as NumberEntity[];
  const symbols = entities.filter(e => e.type === 'symbol') as SymbolEntity[];
  return symbols
  .filter(s => s.token === '*')
  .map(s => {
    const adjacentNumbers = numbers.filter(n => isAdjacent(n, s)).map(n => n.value)
    return adjacentNumbers.length === 2 ? adjacentNumbers[0] * adjacentNumbers[1] : 0
  })
  .reduce((a, b) => a + b, 0)
};

const testInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

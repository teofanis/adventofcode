import run from "aocrunner";

type CrateStacks = string[][];
type Procedure = string[][];

type ParsedInput = {
  crateStacks: CrateStacks;
  procedures: Procedure;
};

const parseInput = (rawInput: string): ParsedInput => {
  const procedureRegex = /([a-z]+\s+\d+)/g;
  const crateRegex = /([A-Z])/g;

  const crateSize = "[A]".length;
  const [cratesRaw, proceduresRaw] = rawInput.split("\n\n");
  const procedures = proceduresRaw
    .split("\n")
    .map((procedure) => procedure.match(procedureRegex) || null)
    .filter(Boolean) as Procedure;
  const crateStacks: CrateStacks = [];

  cratesRaw
    .split("\n")
    .filter((line) => new RegExp(crateRegex).test(line))
    .forEach((crateRow) => {
      for (let col = 0; col < crateRow.length; col += crateSize + 1) {
        const start = col;
        const end = start + crateSize;
        const crate = crateRow.substring(start, end);

        const stackIndex = Math.floor(col / (crateSize + 1));
        if (!crateStacks[stackIndex]) {
          crateStacks[stackIndex] = [];
        }
        if (crate.trim() !== "") {
          crateStacks[stackIndex].push(crate.substring(1, 2));
        }
      }
    });

  return {
    crateStacks: crateStacks,
    procedures,
  };
};

const applyProcedure = (
  procedure: string[],
  stacks: CrateStacks,
  alwaysOneByOne: boolean = true,
) => {
  const [actionProcedure, sourceInfo, destinationInfo] = procedure;
  const [_action, amount] = actionProcedure.split(" ");
  const [_source, stackIndex] = sourceInfo.split(" ");
  const [_destination, destinationIndex] = destinationInfo.split(" ");

  const sourceStackIndex = parseInt(stackIndex, 10) - 1;
  const destinationStackIndex = parseInt(destinationIndex, 10) - 1;
  const sourceStack = stacks[sourceStackIndex];
  const destinationStack = stacks[destinationStackIndex];

  if (alwaysOneByOne) {
    for (let i = 0; i < parseInt(amount, 10); i++) {
      const crate = sourceStack.shift();
      if (crate) {
        destinationStack.unshift(crate);
      }
    }
  } else {
    const crates = sourceStack.splice(0, parseInt(amount, 10));
    destinationStack.unshift(...crates);
  }

  return stacks.map((stack, index) => {
    if (index === sourceStackIndex) {
      return sourceStack;
    }
    if (index === destinationStackIndex) {
      return destinationStack;
    }
    return stack;
  });
};

const part1 = (rawInput: string) => {
  const cargo = parseInput(rawInput);
  const { crateStacks, procedures } = cargo;
  const rearrangedStacks = procedures.reduce((acc, procedure) => {
    return applyProcedure(procedure, acc);
  }, crateStacks);
  return rearrangedStacks.map((stack) => stack[0]).join("");
};

const part2 = (rawInput: string) => {
  const cargo = parseInput(rawInput);
  const { crateStacks, procedures } = cargo;
  const rearrangedStacks = procedures.reduce((acc, procedure) => {
    return applyProcedure(procedure, acc, false);
  }, crateStacks);
  return rearrangedStacks.map((stack) => stack[0]).join("");
};

const testInput = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2

`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: true,
});

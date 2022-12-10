import run from "aocrunner";

type Operation = "addx" | "noop";
type Command = {
  operation: Operation;
  value: number;
};
type Commands = Command[];

type QueuedOperation = {
  command: Command;
  executeAtCycle: number;
};

const parseInput = (rawInput: string): Commands => {
  return rawInput.split("\n").map((line) => {
    const [operation, value] = line.split(" ");
    if (!["addx", "noop"].includes(operation)) {
      throw new Error("Invalid operation");
    }
    return {
      operation: operation as Operation,
      value: value ? parseInt(value, 10) : 0,
    };
  });
};

const part1 = (rawInput: string) => {
  const commands = parseInput(rawInput);
  let X = 1;
  let cycle = 0;

  let signalStrength = 0;
  const operationQueue: QueuedOperation[] = commands.map((command) => {
    if (command.operation === "addx") {
      return {
        command,
        executeAtCycle: 2,
      };
    }
    if (command.operation === "noop") {
      return {
        command,
        executeAtCycle: 1,
      };
    }
    throw new Error("Invalid operation");
  });

  let executeAtCycle = undefined;
  while (cycle <= 260) {
    const operation = operationQueue[0];
    executeAtCycle ??= operation?.executeAtCycle + cycle;
    cycle++;
    if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
      signalStrength += X * cycle;
    }
    if (executeAtCycle === cycle) {
      const { command } = operationQueue.shift()!;
      X += command.value;
      executeAtCycle = undefined;
    }
  }
  return signalStrength;
};

const part2 = (rawInput: string) => {
  const commands = parseInput(rawInput);
  let X = 1;
  let cycle = 0;
  const crt = new Array(6).fill(0).map(() => new Array(40).fill("."));
  const pixels = new Array(241).fill(0);

  for (const command of commands) {
    if (command.operation === "addx") {
      cycle += 2;
      pixels[cycle - 1] = X;
      pixels[cycle] = X;
      X += command.value;
    } else {
      cycle += 1;
      pixels[cycle] = X;
    }
  }
  for (let i = 1; i < pixels.length; i++) {
    const row = Math.floor((i - 1) / 40);
    const col = (i - 1) % 40;
    const draw = Math.abs(col - pixels[i]) <= 1 ? "#" : ".";
    crt[row][col] = draw;
  }

  console.log(crt.map((row) => row.join("")).join("\n"));
  return;
};

const testInput = `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

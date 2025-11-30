import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const getModifiers = (commands: string) => {
  const regex = /(don't\(\))|(do\(\))/gm;
  const matches = commands.matchAll(regex);
  const modifiers = [...matches].map((result) => {
    const [operation] = result;
    const activeFrom = result.index;
    return {
      operation,
      activeFrom,
    };
  });

  return [
    {
      operation: "do()",
      activeFrom: 0,
    },
    ...modifiers,
  ];
};

const checkShouldApplyOperation = (
  modifiers: { operation: string; activeFrom: number }[],
  cursorPosition: number,
) => {
  const activeModifier = [
    ...modifiers.filter((modifier) => modifier.activeFrom <= cursorPosition),
  ].pop();
  if (!activeModifier) {
    throw new Error(`Reached an impossible state`);
  }
  return activeModifier?.operation === "do()";
};
const compile = (commands: string) => {
  const regex = /mul\(\d+,\d+\)/gm;
  const matches = commands.matchAll(regex);
  const modifiers = getModifiers(commands);

  const operations = [...matches].map((command, index) => {
    const [operation] = command;
    const isEnabled = checkShouldApplyOperation(modifiers, command.index);
    const matches = operation.matchAll(/(\d+),(\d+)/gm);
    return [...matches].map((result) => {
      const [_, operantOne, operantTwo] = result;
      const command = result.input.split("(")?.[0];
      return {
        command,
        arguments: [parseInt(operantOne, 10), parseInt(operantTwo, 10)],
        isEnabled,
      };
    });
  });
  return operations.flat();
};
const compileWithStack = (commands: string) => {
  const regex = /(do\(\)|don't\(\)|mul\(\d+,\d+\))/g;
  const matches = commands.matchAll(regex);

  const stack: string[] = ["do()"];
  const operations = [];

  for (const match of matches) {
    const [command] = match;

    if (command === "do()" || command === "don't()") {
      stack.push(command);
    } else if (command.startsWith("mul(")) {
      const [_, operantOne, operantTwo] = command.match(/(\d+),(\d+)/)!;
      operations.push({
        command: "mul",
        arguments: [parseInt(operantOne, 10), parseInt(operantTwo, 10)],
        isEnabled: stack[stack.length - 1] === "do()",
      });
    }
  }

  return operations;
};
const performOperation = (operation: string, args: number[]) => {
  const operationMap: Record<string, (...args: number[]) => number> = {
    mul: (...args: number[]) => args.reduce((product, num) => product * num, 1),
  };
  if (operation in operationMap === false) {
    throw new Error(`Invalid operation ${operation}`);
  }
  return operationMap[operation](...args);
};
const part1 = (rawInput: string) => {
  const parsedOperations = compile(parseInput(rawInput));
  return parsedOperations.reduce((acc, curr) => {
    return acc + performOperation(curr.command, curr.arguments);
  }, 0);
};

const part2 = (rawInput: string) => {
  const parsedOperations = compile(parseInput(rawInput)).filter(
    (operation) => operation.isEnabled,
  );
  return parsedOperations.reduce((acc, curr) => {
    return acc + performOperation(curr.command, curr.arguments);
  }, 0);
};

const testInput = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

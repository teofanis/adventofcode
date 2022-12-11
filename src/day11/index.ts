import run from "aocrunner";

type Monkey = {
  monkey: number;
  items: number[];
  test: number;
  operation: [string, number | "old"];
  trueThrow: number;
  falseThrow: number;
};

type ParsedInput = Monkey[];

type InspectedItems = {
  [key: number]: number;
};
const parseInput = (rawInput: string): ParsedInput => {
  const regExp =
    /^(?:Monkey.(\d)):\n(?:\s+Starting items:.(\d+.+))(?:\s+Operation:.(.*))(?:\s+Test:.divisible by (\d+))(?:\s+\D+(\d+))(?:\s+\D+(\d+))/;
  const operationRegex = new RegExp(/([(\*|\+|\-|\/)]).(\d+|old)$/, "gm");
  const regex = new RegExp(regExp, "gm");
  const matches = [...rawInput.matchAll(regex)];
  return matches.map((match) => {
    const [_, monkey, startingItems, operation, test, trueThrow, falseThrow] =
      match;

    const [mathOperation, number] = operation
      .match(operationRegex)![0]
      .split(" ");

    return {
      monkey: parseInt(monkey, 10),
      items: startingItems.split(",").map((item) => parseInt(item, 10)),
      operation: [
        mathOperation,
        number === "old" ? number : parseInt(number, 10),
      ],
      test: parseInt(test, 10),
      trueThrow: parseInt(trueThrow, 10),
      falseThrow: parseInt(falseThrow, 10),
    };
  });
};

const calculateWorryLevel = (
  operation: string,
  number: number,
  old: number,
) => {
  switch (operation) {
    case "*":
      return old * number;
    case "+":
      return old + number;
    case "-":
      return old - number;
    case "/":
      return old / number;
    default:
      throw new Error("Invalid operation");
  }
};

const calculateMonkeyBusiness = (totalItemsInspected: InspectedItems) => {
  const [firstLargest, secondLargest] = Object.values(totalItemsInspected)
    .sort((a, b) => b - a)
    .slice(0, 2);
  return firstLargest * secondLargest;
};
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let rounds = 0;
  let worryLevel = 1;
  const totalItemsInspected: InspectedItems = {};
  let monkeyBusiness = 0;
  while (rounds <= 20) {
    for (const monkey of input) {
      while (monkey.items.length > 0) {
        const item = monkey.items.shift();
        if (!item) {
          break;
        }
        worryLevel = item;
        const [operation, number] = monkey.operation;
        if (number === "old") {
          worryLevel = calculateWorryLevel(operation, worryLevel, worryLevel);
        } else {
          worryLevel = calculateWorryLevel(operation, number, worryLevel);
        }
        worryLevel = Math.floor(worryLevel / 3);
        if (!totalItemsInspected[monkey.monkey]) {
          totalItemsInspected[monkey.monkey] = 1;
        } else {
          totalItemsInspected[monkey.monkey] += 1;
        }
        let lookForMonkey =
          worryLevel % monkey.test === 0 ? monkey.trueThrow : monkey.falseThrow;
        const nextMonkey = input.find(
          (monkey) => monkey.monkey === lookForMonkey,
        );
        if (nextMonkey) {
          nextMonkey.items.push(worryLevel);
          input[lookForMonkey] = nextMonkey;
        }
      }
    }
    rounds++;

    if (rounds === 20) {
      monkeyBusiness = calculateMonkeyBusiness(totalItemsInspected);
      break;
    }
  }
  return monkeyBusiness;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let rounds = 0;
  let worryLevel = 1;
  const totalItemsInspected: InspectedItems = {};
  let monkeyBusiness = 0;

  const productOfDivisors = input.reduce(
    (acc, monkey) => (acc *= monkey.test),
    1,
  );

  while (rounds <= 10500) {
    for (const monkey of input) {
      while (monkey.items.length >= 0) {
        const item = monkey.items.shift();
        if (!item) {
          break;
        }
        worryLevel = item;
        const [operation, number] = monkey.operation;

        if (number === "old") {
          worryLevel = calculateWorryLevel(operation, worryLevel, worryLevel);
        } else {
          worryLevel = calculateWorryLevel(operation, number, worryLevel);
        }

        if (!totalItemsInspected[monkey.monkey]) {
          totalItemsInspected[monkey.monkey] = 1;
        } else {
          totalItemsInspected[monkey.monkey] += 1;
        }
        worryLevel %= productOfDivisors;
        let lookForMonkey =
          worryLevel % monkey.test === 0 ? monkey.trueThrow : monkey.falseThrow;

        input[lookForMonkey].items.push(worryLevel);
      }
    }
    rounds++;

    if (rounds === 10000) {
      monkeyBusiness = calculateMonkeyBusiness(totalItemsInspected);
      break;
    }
  }
  return monkeyBusiness;
};

const testInput = `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

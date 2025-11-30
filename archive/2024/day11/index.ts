import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(" ");

const blink = (stone: string) => {
  if (stone === "0") {
    return "1";
  }
  const numericStone = parseInt(stone, 10);
  if (stone.length % 2 === 0) {
    const left = stone.slice(0, stone.length / 2);
    const right = stone.slice(stone.length / 2, stone.length);
    return [left, right].map((i) => parseInt(i, 10)).map((i) => i.toString());
  }
  return `${numericStone * 2024}`;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const MAX_BLINKS = 25;
  let stones = input;
  for (let i = 0; i < MAX_BLINKS; i++) {
    stones = stones.map(blink).flat();
  }
  return stones.length;
};

type LinkedList = {
  value: number;
  next: LinkedList | null;
};

const toLinkedList = (input: number[]): LinkedList => {
  let head: LinkedList = { value: input[0], next: null };
  let current = head;
  for (let index = 1; index < input.length; index++) {
    current.next = { value: input[index], next: null };
    current = current.next;
  }
  return head;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const MAX_BLINKS = 30;
  let stones = input;
  for (let i = 0; i < MAX_BLINKS; i++) {
    console.log(`Blinks`, i);
    stones = stones.map(blink).flat();
  }
  return stones.length;
};

const testInput = `125 17`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 55312,
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

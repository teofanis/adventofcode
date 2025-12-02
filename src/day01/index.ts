import run from "aocrunner";

const DIAL_START=0;
const DIAL_END=99;
const DIAL_SIZE = DIAL_END - DIAL_START + 1;

type Direction = 'L' | 'R';

type Rotation = {
  direction: Direction;
  distance: number;
}
type Position = number;

const normalize = (pos: Position): Position =>  ((pos % DIAL_SIZE) + DIAL_SIZE) % DIAL_SIZE;
const parseInput = (rawInput: string) => rawInput.split("\n").map((v) => {
  const [direction, ...distance] = v.trim().split("")
  return {direction, distance: parseInt(distance.join(''),10)} as Rotation
});

const dialBackwards = (currentPosition: Position, distance: number): Position => {
  return normalize(currentPosition - distance)
}

const dialForward = (currentPosition: Position, distance: number): Position => {
  return normalize(currentPosition + distance)
}

const rotate = (rotation: Rotation, currentPosition: Position = 50): Position => {
  const { direction, distance } = rotation;
  switch(direction) {
    case 'L':
      return dialBackwards(currentPosition, distance);
    case 'R':
      return  dialForward(currentPosition, distance);
    default:
      throw new Error(`Unknown direction ${direction}`)
  }
}
const part1 = (rawInput: string) => {
  const rotations = parseInput(rawInput);
  let pos = 50;
  let count = 0;
  rotations.forEach((rotation) => {
    pos = rotate(rotation, pos);
    if(pos ===0) count++;
  })
  return count;
};

const countZerosDuringRotation = (pos: Position, rotation: Rotation): number => {
  const { direction, distance } = rotation;
  const N = DIAL_SIZE;

  let distNextZero: number;

  if (direction === 'R') {
    distNextZero = pos === 0 ? N : N - pos;
  } else {
    distNextZero = pos === 0 ? N : pos;
  }

  if (distance < distNextZero) return 0;

  return 1 + Math.floor((distance - distNextZero) / N);
};

const part2 = (rawInput: string) => {
 const rotations = parseInput(rawInput);
  let pos = 50;
  let count = 0;

  for (const rotation of rotations) {
    count += countZerosDuringRotation(pos, rotation);
    pos = rotate(rotation, pos);
  }

  return count;
};

const testInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

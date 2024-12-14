import run from "aocrunner";

type Robot = {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
};

const IS_TEST = true;
const parseInput = (rawInput: string): Robot[] =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => {
      const [posPart, velPart] = line.split(" ");
      const [px, py] = posPart.replace("p=", "").split(",").map(Number);
      const [vx, vy] = velPart.replace("v=", "").split(",").map(Number);
      return { position: { x: px, y: py }, velocity: { x: vx, y: vy } };
    });

const simulate = (
  robots: Robot[],
  seconds: number,
  width: number,
  height: number,
): Robot[] => {
  return robots.map(({ position, velocity }) => {
    const x = (((position.x + velocity.x * seconds) % width) + width) % width; // Ensure positive wrapping
    const y =
      (((position.y + velocity.y * seconds) % height) + height) % height; // Ensure positive wrapping
    return {
      position: { x, y },
      velocity,
    };
  });
};

const countQuadrants = (
  robots: Robot[],
  width: number,
  height: number,
): number => {
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  const quadrants = [0, 0, 0, 0];

  robots.forEach(({ position }) => {
    const { x, y } = position;
    if (x === midX || y === midY) return; // Exclude robots on middle row/column
    if (x < midX && y < midY) quadrants[0]++; // Top-left
    else if (x >= midX && y < midY) quadrants[1]++; // Top-right
    else if (x < midX && y >= midY) quadrants[2]++; // Bottom-left
    else if (x >= midX && y >= midY) quadrants[3]++; // Bottom-right
  });

  return quadrants.reduce((product, count) => product * count, 1);
};

const part1 = (rawInput: string) => {
  const robots = parseInput(rawInput);
  const width = IS_TEST ? 11 : 101;
  const height = IS_TEST ? 7 : 103;
  const seconds = 100;

  const movedRobots = simulate(robots, seconds, width, height);
  return countQuadrants(movedRobots, width, height);
};

const part2 = (rawInput: string) => {
  let robots = parseInput(rawInput);

  console.log(robots);
};
const testInput = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 12,
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
  onlyTests: IS_TEST,
});

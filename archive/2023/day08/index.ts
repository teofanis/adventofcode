import run from "aocrunner";
import { start } from "repl";

type NodeCharacters = '1' | '2'| '3' | '4' | '5' | '6' | '7' | '8'| '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
type Repeat<T extends string> = `${T}${T}${T}`;
type Node = Repeat<NodeCharacters>;
type Direction = {
  left: Node,
  right: Node,
}
type DirectionCharacters = 'L' | 'R';
type NodeNetwork = Record<Node, Direction>;
type NodeNetworkMapTuple = [Array<DirectionCharacters>, NodeNetwork];

const parseInput = (rawInput: string) => {
  const [rawDirections, rawNodeNetwork] = rawInput.split('\n\n');
  const directions = rawDirections.split('') as Array<DirectionCharacters>;
  const nodeNetwork = rawNodeNetwork.split('\n').reduce((acc, line) => {
    const rawNode = line.split(' = ')[0];
    const [rawLeft, rawRight] = line.split(' = ')[1].split(', ');
    const node = rawNode as Node;
    const left = rawLeft.replace(/\(|\)/, '') as Node;
    const right = rawRight.replace(/\(|\)/, '') as Node;
    acc[node] = { left, right };
    return acc;
  }, {} as NodeNetwork);

  return [directions, nodeNetwork] as NodeNetworkMapTuple;
}

const isEnd = (node: Node): boolean => node === 'ZZZ';

const move = (direction: DirectionCharacters, node: Node, nodeNetwork: NodeNetwork): Node => {
  const { left, right } = nodeNetwork[node];
  if (direction === 'L') {
    return left;
  } else {
    return right;
  }
};
 

const getDirection = (directions: Array<DirectionCharacters>): DirectionCharacters => {
  const direction  = directions.shift();
  if (!direction) {
    // should never happen
    throw new Error('No more directions');
  }
  directions.push(direction);
  return direction;
}; 

const navigate = (startingNode: Node, directions: Array<DirectionCharacters>, nodeNetwork: NodeNetwork, pt2:boolean =false): number => {
  let iteration = 0;
  while(true) {
    const direction = getDirection(directions);
    startingNode = move(direction, startingNode, nodeNetwork);
    if (pt2 ? startingNode.endsWith('Z') : isEnd(startingNode)) {
      return iteration + 1;
    }
    iteration++;
  }
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [directions, nodeNetwork] = input;
  let startingNode = 'AAA' as Node;
  return navigate(startingNode, directions, nodeNetwork);

};
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
}

const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b);
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [directions, nodeNetwork] = input;
  const startingNodes = Object.keys(nodeNetwork).filter(node => node.endsWith('A'));

  const steps = startingNodes.map(node => navigate(node as Node, [...directions], nodeNetwork, true));
  return steps.reduce((acc, steps) => lcm(acc, steps), 1);
};


const testInput = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const testInput2 =`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 6
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput2,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

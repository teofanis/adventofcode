import run from "aocrunner";
import { MatrixUtils } from "../utils/index.js";
import { bfs, Graph } from "../utils/graph.js";

const parseInput = (rawInput: string) => rawInput.split('\n').map(l => l.split(''));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const HEIGHT = input.length;
  const WIDTH = input[0].length;
  const graph = new Graph(input);

  const pos = MatrixUtils.find(input, (v) => v === "S");
  if (!pos) throw new Error("No starting point found");
  const [x, y] = pos;


  for (const row of graph.nodes) {
    for (const node of row) {
      const r = node.x
      const c = node.y
      const v = node.data

      const down = r + 1
      if (down >= HEIGHT) continue;
      if (v === '.' || v === 'S') {
        node.addNeighbor(graph.nodes[down][c]);
      }

      if (v === '^') {
        if (c - 1 >= 0) {
          node.addNeighbor(graph.nodes[down][c - 1]);
        }
        if (c + 1 < WIDTH) {
          node.addNeighbor(graph.nodes[down][c + 1]);
        }
      }
    }
  }

  const startNode = graph.nodes[x + 1][y];
  const countSplits = bfs(startNode, (node) => node.data === '^')

  return countSplits;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const HEIGHT = input.length;
  const WIDTH = input[0].length;
  const graph = new Graph(input);

  const pos = MatrixUtils.find(input, (v) => v === "S");
  if (!pos) throw new Error("No starting point found");
  const [x, y] = pos;

  const memo = new Map<string, number>();
  const key = (r: number, c: number) => `${r},${c}`;
  const countTimelines = (r: number, c: number): number => {
    if (r >= HEIGHT) return 1;
    if (c < 0 || c >= WIDTH) return 1;

    const k = key(r, c);
    if (memo.has(k)) return memo.get(k)!;

    const v = input[r][c];
    let result = 0;

    if (v === "." || v === "S") {
      result = countTimelines(r + 1, c);
    } else if (v === "^") {
      result =
        countTimelines(r + 1, c - 1) +
        countTimelines(r + 1, c + 1);
    } else {
      result = countTimelines(r + 1, c);
    }
    memo.set(k, result);
    return result;
  };

  return countTimelines(x + 1, y);

};

const testInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 40,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

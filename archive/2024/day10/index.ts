import run from "aocrunner";
import { Graph, Node, recursiveDFS } from "../../../src/utils/graph.js";

class Trailhead extends Node<number> {
  getRating(): number {
    const countPaths = (
      node: Node<number>,
      visited: Set<Node<number>>,
    ): number => {
      if (visited.has(node)) return 0;
      visited.add(node);
      if (node.data === 9) {
        visited.delete(node);
        return 1;
      }
      let paths = 0;
      for (const neighbor of node.neighbors) {
        paths += countPaths(neighbor, visited);
      }

      // Un-visit to allow other paths to explore it
      visited.delete(node);

      return paths;
    };

    return countPaths(this, new Set());
  }

  getScore() {
    return recursiveDFS(this, (node) => node.data === 9);
  }
}
class MapGraph extends Graph<number> {
  constructor(matrix: number[][]) {
    super(matrix);
    this.linkNeighbors((current, neighbor) => neighbor === current + 1);
  }

  getTrailHeads(): Trailhead[] {
    return this.flatten()
      .filter((node) => node.data === 0)
      .map((node) => {
        const head = new Trailhead(node.x, node.y, node.data);
        head.neighbors = node.neighbors;
        return head;
      });
  }
}

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split("").map(Number));

const part1 = (rawInput: string) => {
  const matrix = parseInput(rawInput);
  const graph = new MapGraph(matrix);

  return graph
    .getTrailHeads()
    .reduce((sum, trailhead) => sum + trailhead.getScore(), 0);
};

const part2 = (rawInput: string) => {
  const matrix = parseInput(rawInput);
  const graph = new MapGraph(matrix);
  return graph
    .getTrailHeads()
    .reduce((sum, trailhead) => sum + trailhead.getRating(), 0);
};

const testInput = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

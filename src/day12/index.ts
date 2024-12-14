import run from "aocrunner";
import { Graph, Node } from "../utils/graph.js";
 
const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((i) => i.split(""));
const calculatePerimeter = (
  node: Node<string>,
  graph: Graph<string>,
  visited: Set<Node<string>>,
): number => {
  let perimeter = 0;

  const directions = [
    { dx: -1, dy: 0 }, // up
    { dx: 1, dy: 0 }, // down
    { dx: 0, dy: -1 }, // left
    { dx: 0, dy: 1 }, // right
  ];

  for (const { dx, dy } of directions) {
    const nx = node.x + dx;
    const ny = node.y + dy;

    if (
      nx < 0 ||
      ny < 0 ||
      nx >= graph.nodes.length ||
      ny >= graph.nodes[0].length ||
      graph.nodes[nx][ny].data !== node.data
    ) {
      perimeter++;
    } else {
      const neighbor = graph.nodes[nx][ny];
      if (!visited.has(neighbor) && neighbor.data !== node.data) {
        perimeter++;
      }
    }
  }

  return perimeter;
};
const exploreRegion = (
  startNode: Node<string>,
  graph: Graph<string>,
  visited: Set<Node<string>>,
): { area: number; perimeter: number } => {
  const stack = [startNode];
  let area = 0;
  let perimeter = 0;

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (!visited.has(node)) {
      visited.add(node);
      area++;
      perimeter += calculatePerimeter(node, graph, visited);

      for (const neighbor of node.neighbors) {
        if (!visited.has(neighbor) && neighbor.data === node.data) {
          stack.push(neighbor);
        }
      }
    }
  }

  return { area, perimeter };
};
 


const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const graph = new Graph(input);
  graph.linkNeighbors((current, neighbor) => current === neighbor);

  const visited = new Set<Node<string>>();
  let totalCost = 0;

  for (const node of graph.flatten()) {
    if (!visited.has(node)) {
      const { area, perimeter } = exploreRegion(node, graph, visited);
      const price = area * perimeter;
      totalCost += price;
    }
  }

  return totalCost;
};


const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
   
}

const testInput = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 1930,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 1206,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

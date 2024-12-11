class Node<T = any> {
  x: number;
  y: number;
  data: T;
  neighbors: Node[];

  constructor(x: number, y: number, data: T) {
    this.x = x;
    this.y = y;
    this.data = data;
    this.neighbors = [];
  }

  addNeighbor(node: Node) {
    this.neighbors.push(node);
  }
}

class Graph<T = any> {
  nodes: Node<T>[][];

  constructor(matrix: T[][]) {
    this.nodes = matrix.map((row, x) =>
      row.map((data, y) => new Node(x, y, data)),
    );
  }

  linkNeighbors(isNeighbor: (current: T, neighbor: T) => boolean) {
    const directions = [
      { dx: -1, dy: 0 }, // up
      { dx: 1, dy: 0 }, // down
      { dx: 0, dy: -1 }, // left
      { dx: 0, dy: 1 }, // right
    ];

    for (const row of this.nodes) {
      for (const node of row) {
        for (const { dx, dy } of directions) {
          const nx = node.x + dx;
          const ny = node.y + dy;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < this.nodes.length &&
            ny < this.nodes[0].length &&
            isNeighbor(node.data, this.nodes[nx][ny].data)
          ) {
            node.addNeighbor(this.nodes[nx][ny]);
          }
        }
      }
    }
  }

  flatten(): Node<T>[] {
    return this.nodes.flat();
  }
}

const iterativeDFS = <T>(
  start: Node<T>,
  visitFn: (node: Node<T>) => boolean,
): number => {
  const visited = new Set<Node<T>>();
  const stack = [start];
  let result = 0;

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (!visited.has(node)) {
      visited.add(node);
      if (visitFn(node)) {
        result++;
      }
      stack.push(...node.neighbors);
    }
  }

  return result;
};

const bfs = <T>(
  start: Node<T>,
  visitFn: (node: Node<T>) => boolean,
): number => {
  const visited = new Set<Node<T>>();
  const queue: Node<T>[] = [start];
  let result = 0;

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (!visited.has(node)) {
      visited.add(node);
      if (visitFn(node)) {
        result++;
      }
      queue.push(...node.neighbors);
    }
  }

  return result;
};

const recursiveDFS = <T>(
  node: Node<T>,
  visitFn: (node: Node<T>) => boolean,
  visited = new Set<Node<T>>(),
): number => {
  if (visited.has(node)) {
    return 0;
  }

  visited.add(node);
  let result = visitFn(node) ? 1 : 0;

  for (const neighbor of node.neighbors) {
    result += recursiveDFS(neighbor, visitFn, visited);
  }

  return result;
};

export { Node, Graph, iterativeDFS, recursiveDFS, bfs };

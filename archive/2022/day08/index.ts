import run from "aocrunner";

const parseInput = (rawInput: string): number[][] => {
  return rawInput.split("\n").map((line) =>
    line
      .trim()
      .split("")
      .map((char) => parseInt(char, 10)),
  );
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const visibleTrees = [];
  const edges = [];

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (row === 0 || row === input.length - 1) {
        edges.push(input[row][col]);
      } else if (col === 0 || col === input[row].length - 1) {
        edges.push(input[row][col]);
      }
    }
  }
  for (let row = 1; row < input.length - 1; row++) {
    for (let col = 1; col < input[row].length - 1; col++) {
      const tree = input[row][col];

      const treesAbove = [];
      const treesAfter = [];
      const treesBelow = [];
      const tressBefore = [];

      for (let row2 = 0; row2 < row; row2++) {
        treesAbove.push(input[row2][col]);
      }

      for (let row2 = row + 1; row2 < input.length; row2++) {
        treesBelow.push(input[row2][col]);
      }

      for (let col2 = 0; col2 < col; col2++) {
        tressBefore.push(input[row][col2]);
      }

      for (let col2 = col + 1; col2 < input[row].length; col2++) {
        treesAfter.push(input[row][col2]);
      }

      const isVisibleAbove = Math.max(...treesAbove) < tree;
      const isVisibleAfter = Math.max(...treesAfter) < tree;
      const isVisibleBelow = Math.max(...treesBelow) < tree;
      const isVisibleBefore = Math.max(...tressBefore) < tree;

      const isVisible =
        isVisibleAbove || isVisibleAfter || isVisibleBelow || isVisibleBefore;

      if (isVisible) {
        visibleTrees.push(tree);
      }
    }
  }

  return visibleTrees.length + edges.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const scenicScores = [];
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      const tree = input[row][col];
      const treesAbove = [];
      const treesBelow = [];
      const treesAfter = [];
      const treesBefore = [];

      for (let row2 = row - 1; row2 >= 0; row2--) {
        if (input[row2][col] >= tree) {
          treesAbove.push(input[row2][col]);
          break;
        } else {
          treesAbove.push(input[row2][col]);
        }
      }

      for (let row2 = row + 1; row2 < input.length; row2++) {
        if (input[row2][col] >= tree) {
          treesBelow.push(input[row2][col]);
          break;
        } else {
          treesBelow.push(input[row2][col]);
        }
      }

      for (let col2 = col - 1; col2 >= 0; col2--) {
        if (input[row][col2] >= tree) {
          treesBefore.push(input[row][col2]);
          break;
        } else {
          treesBefore.push(input[row][col2]);
        }
      }

      for (let col2 = col + 1; col2 < input[row].length; col2++) {
        if (input[row][col2] >= tree) {
          treesAfter.push(input[row][col2]);
          break;
        } else {
          treesAfter.push(input[row][col2]);
        }
      }

      const scores = [
        treesAbove.length,
        treesAfter.length,
        treesBelow.length,
        treesBefore.length,
      ];
      const scenicScore = scores.reduce((a, b) => a * b, 1);
      scenicScores.push(scenicScore);
    }
  }
  return Math.max(...scenicScores);
};

const testInput = `
30373
25512
65332
33549
35390
`;

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
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

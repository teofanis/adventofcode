import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [rulesRaw, pagesRaw] = rawInput.split("\n\n").map((i) => i.split("\n"));

  const rules = rulesRaw.reduce((map, rule) => {
    const [left, right] = rule.split("|").map((n) => parseInt(n, 10));
    if (!map.has(left)) {
      map.set(left, [right]);
      return map;
    }
    map.get(left)?.push(right);
    return map;
  }, new Map<Number, Number[]>());

  const pages = pagesRaw.map((p) => p.split(",").map((n) => parseInt(n, 10)));

  return {
    rules,
    pages,
  };
};

const isInCorrectOrder = (rules: Map<Number, Number[]>, pages: number[]) => {
  return pages.every((page, index) => {
    const previousPages = rules.get(page) ?? [];
    for (let i = index + 1; i < pages.length; i++) {
      if (!previousPages.includes(pages[i])) {
        return false;
      }
    }
    return true;
  });
};

const orderPages = (rules: Map<Number, Number[]>, pages: number[]) => {
  const compare = (a: number, b: number) => {
    const aRules = rules.get(a) ?? [];
    if (aRules.includes(b)) return -1;
    const bRules = rules.get(b) ?? [];
    if (bRules.includes(a)) return 1;
    return 0;
  };
  return pages.slice().sort(compare);
};

const getMiddleElement = <T>(array: T[]): T => {
  const length = array.length;
  const middleIndex = Math.floor(length / 2);
  return array[middleIndex];
};

const part1 = (rawInput: string) => {
  const { rules, pages } = parseInput(rawInput);
  return pages
    .filter((p) => isInCorrectOrder(rules, p))
    .reduce((acc, curr) => {
      return acc + getMiddleElement(curr);
    }, 0);
};

const part2 = (rawInput: string) => {
  const { rules, pages } = parseInput(rawInput);
  return pages
    .filter((p) => !isInCorrectOrder(rules, p))
    .map((p) => orderPages(rules, p))
    .reduce((acc, curr) => {
      return acc + getMiddleElement(curr);
    }, 0);
};

const testInput = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

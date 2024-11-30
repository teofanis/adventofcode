import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n").map((card) => card.split(":")[1].trim().split( " | ").map((row) => row.split(" ").map((num) => parseInt(num.trim(), 10)).filter(Number)));

const calculatePoints = (matches: number[]) : number => matches.length === 0 ? 0 : matches.length === 1 ? 1 :2 * calculatePoints(matches.slice(1));

const part1 = (rawInput: string) => {
  const cards = parseInput(rawInput);

  let totalPoints = 0;
  cards.forEach((card) => {
    const matches:number[] = [];
    const [winningNumber, cardNumbers] = card;
    winningNumber.forEach((number) => {
      if (cardNumbers.includes(number)) {
        matches.push(number);
      }
    });
    totalPoints += calculatePoints(matches);
  });
   
  return totalPoints;
};

const getMatches = (card1: number[], card2: number[]) : number => {
  const matches:number[] = [];
  card1.forEach((number) => {
    if (card2.includes(number)) {
      matches.push(number);
    }
  });
  return matches.length;
}; 
  
function countFinalCards(cards: number[][][]) {
  let i = 1;
  const tmp = [...cards];
  const cardCount: Record<string, number> = {};
  while (i < cards.length + 1) {
    const card = tmp[i - 1];
    const [winningNumber, cardNumbers] = card;
    const matchingNumbers = getMatches(winningNumber, cardNumbers);
    cardCount[i.toString()] = cardCount[i.toString()] ?? 1;
    for (let j = 0; j < matchingNumbers; j++) {
      const nextCardIndex = i + j + 1;
      cardCount[nextCardIndex.toString()] = (cardCount[nextCardIndex.toString()] ?? 1) + 1 * cardCount[i.toString()];
    }
    i++;
  }
  delete cardCount[i.toString()];
  const totalScore = Object.values(cardCount).reduce((acc, curr) => acc + curr, 0);
  return totalScore;
}
 
const part2 = (rawInput: string) => {
  return countFinalCards(parseInput(rawInput));
 };



const testInput = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

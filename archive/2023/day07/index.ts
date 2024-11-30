import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n").map((line) => line.split(" ")).map(([card, bid]) => ({ hand: card.split(''), bid: parseInt(bid, 10) }));

const getNumberOfOccurrences = (hand: Hand) => {
  const occurrences = hand.reduce((acc, curr) => {
    acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.values(occurrences).sort((a, b) => a - b);
}

const isHighCard = (hand: Hand, withWildCard: boolean) => !withWildCard && (new Set(hand)).size === hand.length;
const isOnePair = (hand: Hand, withWildCard: boolean) => {
  if (withWildCard) {
    const occurrences = getNumberOfOccurrences(hand.filter(card => card !== 'J'));
    const jokerCount = withWildCard ? hand.filter(card => card === 'J').length : 0;
    // return (occurrences.length === 4 && occurrences.includes(2)) ||
    //   (withWildCard && jokerCount === 1 && occurrences.some(count => count === 1));
    return occurrences.length === 4 || (withWildCard && jokerCount === 1 && occurrences.some(count => count === 1));
  } else {
    const occurrences = getNumberOfOccurrences(hand);
    return occurrences.length === 4 && occurrences[0] === 1 && occurrences[1] === 1 && occurrences[2] === 1 && occurrences[3] === 2;
  }
};

const isTwoPair = (hand: Hand, withWildCard: boolean) => {
  if (withWildCard) {
    const occurrences = getNumberOfOccurrences(hand.filter(card => card !== 'J'));
    const jokerCount = withWildCard ? hand.filter(card => card === 'J').length : 0;
    // return (occurrences.length === 3 && occurrences.filter(count => count === 2).length === 2);
    return occurrences.length === 3 && occurrences.includes(2) || 
         (withWildCard && jokerCount === 1 && occurrences.includes(2));
  } else {
    const occurrences = getNumberOfOccurrences(hand);
    return occurrences.length === 3 && occurrences[0] === 1 && occurrences[1] === 2 && occurrences[2] === 2
  }
}

const isThreeOfAKind = (hand: Hand, withWildCard: boolean) => {
  if (withWildCard) {
    const occurrences = getNumberOfOccurrences(hand.filter(card => card !== 'J'));
    const jokerCount = withWildCard ? hand.filter(card => card === 'J').length : 0;
    // return (occurrences.includes(3) && !withWildCard) ||
    //   (jokerCount === 1 && occurrences.includes(2));
    return occurrences.includes(3) || (withWildCard && jokerCount === 1 && occurrences.includes(2));

  } else {
    const occurrences = getNumberOfOccurrences(hand);
    return (occurrences.length === 3 && occurrences[0] === 1 && occurrences[1] === 1 && occurrences[2] === 3)
  }
};

const isFourOfAKind = (hand: Hand, withWildCard: boolean) => {
  if (withWildCard) {
    const occurrences = getNumberOfOccurrences(hand.filter(card => card !== 'J'));
    const jokerCount = withWildCard ? hand.filter(card => card === 'J').length : 0;
    return (occurrences.includes(4)) ||
      (jokerCount === 1 && occurrences.includes(3)) ||
      (jokerCount === 2 && occurrences.includes(2));
  } else {
    const occurrences = getNumberOfOccurrences(hand);
    return (occurrences.length === 2 && occurrences[0] === 1 && occurrences[1] === 4)
  }
};

const isFullHouse = (hand: Hand, withWildCard: boolean) => {
  if (withWildCard) {
    const occurrences = getNumberOfOccurrences(hand.filter(card => card !== 'J'));
    const jokerCount = withWildCard ? hand.filter(card => card === 'J').length : 0;
    // return (occurrences.includes(3) && occurrences.includes(2) && !withWildCard) ||
    //   (jokerCount === 1 && occurrences.includes(3));
    return (occurrences.includes(3) && occurrences.includes(2)) || 
    (withWildCard && jokerCount === 1 && occurrences.includes(3));
  } else {
    const occurrences = getNumberOfOccurrences(hand);
    return occurrences.length === 2 && occurrences[0] === 2 && occurrences[1] === 3
  }
};

const isFiveOfAKind = (hand: Hand, withWildCard: boolean) => {

  if (withWildCard) {
    const occurrences = getNumberOfOccurrences(hand.filter(card => card !== 'J'));
    const jokerCount = withWildCard ? hand.filter(card => card === 'J').length : 0;
    // A four of a kind with a joker turns into a five of a kind.
    // return withWildCard && jokerCount > 0 && occurrences.includes(4);
    return withWildCard && jokerCount === 1 && occurrences.includes(4);

  } else {
    const occurrences = getNumberOfOccurrences(hand);
    return occurrences.length === 1 && occurrences[0] === 5
  }
};
const typeValues = {
  highCard: 0,
  onePair: 1,
  twoPair: 2,
  threeOfAKind: 3,
  fullHouse: 4,
  fourOfAKind: 5,
  fiveOfAKind: 6
} as const;

type HandType = keyof typeof typeValues;
type HandTypeValue = typeof typeValues[HandType];
type Hand = string[];
type Hands = { hand: Hand, bid: number, handType: HandType, handTypeValue: HandTypeValue }[]
type HandStrength = Record<HandType, Hands>;
type ScoreMap = Record<string, number>;
const determineHandStrength = (hand: Hand, bid: number, handleStrengths: HandStrength, withWildCard = false) => {
  const handTypes: Record<string, HandType> = {
    isFiveOfAKind: 'fiveOfAKind',
    isFourOfAKind: 'fourOfAKind',
    isFullHouse: 'fullHouse',
    isThreeOfAKind: 'threeOfAKind',
    isTwoPair: 'twoPair',
    isOnePair: 'onePair',
    isHighCard: 'highCard',
  };

  for (const [key, handType] of Object.entries(handTypes)) {
    if (key === 'isHighCard' && isHighCard(hand, withWildCard)) {
      handleStrengths[handType].push({ hand, bid, handType, handTypeValue: typeValues[handType] });
      break;
    } else if (key === 'isOnePair' && isOnePair(hand, withWildCard)) {
      handleStrengths[handType].push({ hand, bid, handType, handTypeValue: typeValues[handType] });
      break;
    } else if (key === 'isTwoPair' && isTwoPair(hand, withWildCard)) {
      handleStrengths[handType].push({ hand, bid, handType, handTypeValue: typeValues[handType] });
      break;
    } else if (key === 'isThreeOfAKind' && isThreeOfAKind(hand, withWildCard)) {
      handleStrengths[handType].push({ hand, bid, handType, handTypeValue: typeValues[handType] });
      break;
    } else if (key === 'isFullHouse' && isFullHouse(hand, withWildCard)) {
      handleStrengths[handType].push({ hand, bid, handType, handTypeValue: typeValues[handType] });
      break;
    } else if (key === 'isFourOfAKind' && isFourOfAKind(hand, withWildCard)) {
      handleStrengths[handType].push({ hand, bid, handType, handTypeValue: typeValues[handType] });
      break;
    } else if (key === 'isFiveOfAKind' && isFiveOfAKind(hand, withWildCard)) {
      handleStrengths[handType].push({ hand, bid, handType, handTypeValue: typeValues[handType] });
      break;
    }
  }

  return handleStrengths;
};

const sortAndCalculateWinnings = (handleStrengths: HandStrength, scoreMap: ScoreMap) => {

  const allHands = Object.values(handleStrengths).flat();

  allHands.sort((a, b) => {
    if (a.handTypeValue !== b.handTypeValue) {
      return a.handTypeValue - b.handTypeValue;
    } else {
      // handle hands of same type
      const aScores = a.hand.map(card => scoreMap[card as keyof typeof scoreMap]);
      const bScores = b.hand.map(card => scoreMap[card as keyof typeof scoreMap]);
      for (let i = 0; i < a.hand.length; i++) {
        if (aScores[i] !== bScores[i]) {
          return aScores[i] - bScores[i];
        }
      }
      return 0;
    }
  });
  let totalWinnings = 0;
  allHands.forEach((hand, index) => {
    const winnings = hand.bid * (index + 1);
    totalWinnings += winnings;
  });
  
  return totalWinnings;
};


const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const scoreMap = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    3: 3,
    2: 2,
  };

  const handleStrengths: HandStrength = input.reduce((acc, curr) => {
    return determineHandStrength(curr.hand, curr.bid, acc);
  }, {
    onePair: [],
    twoPair: [],
    threeOfAKind: [],
    fourOfAKind: [],
    fiveOfAKind: [],
    fullHouse: [],
    highCard: [],
  } as HandStrength);


  return sortAndCalculateWinnings(handleStrengths, scoreMap);

};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const scoreMap = {
    A: 14,
    K: 13,
    Q: 12,
    T: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    3: 3,
    2: 2,
    J: 1,
  };

  const handleStrengths: HandStrength = input.reduce((acc, curr) => {
    return determineHandStrength(curr.hand, curr.bid, acc, true);
  }, {
    onePair: [],
    twoPair: [],
    threeOfAKind: [],
    fourOfAKind: [],
    fiveOfAKind: [],
    fullHouse: [],
    highCard: [],
  } as HandStrength);
  return sortAndCalculateWinnings(handleStrengths, scoreMap);

};

const testInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

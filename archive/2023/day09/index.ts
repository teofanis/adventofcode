import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map((line) => line.split(' ').map(Number));
  
const predictNextNumber = (input: number[]) => {
  const history = [];
  let currentInput = [...input];

  while (true) {
    const values = new Set(currentInput);
    if (values.size === 1 && values.has(0)) {
      return [Array.from(new Set(history[history.length - 1]))[0] || 0, history];
    }

    history.push([...currentInput]);

    const newInput = [];
    for (let i = 1; i < currentInput.length; i++) {
      newInput.push(currentInput[i] - currentInput[i - 1]);
    }

    if (newInput.length === 0) {
      break;
    }

    currentInput = newInput;
  }

  return [0, history];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const result = input.map(line => predictNextNumber(line)).map(([nextValue, history]) => {
    // @ts-ignore
    return history.reverse().reduce((acc, curr, index) => {
      if(index===0) {
        return acc + nextValue;
      }
      const lastKnownNumber = curr.pop()
      if(!lastKnownNumber) {
        return acc
      }
      return acc + lastKnownNumber 
    }, 0);
  }).reduce((acc, curr) => acc + curr, 0);
 
  return result;
};
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const result = input.map(line => {
    const history = [line];
    let currentInput = [...line];

    while (true) {
      const newInput = [];
      for (let i = 1; i < currentInput.length; i++) {
        newInput.push(currentInput[i] - currentInput[i - 1]);
      }
      if (newInput.every(val => val === 0)) {
        break;
      }

      history.push(newInput);
      currentInput = newInput;
    }

    let previousValue = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      previousValue = history[i][0] - previousValue;
    }

    return previousValue;
  }).reduce((acc, curr) => acc + curr, 0);

  return result;
};

const testInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

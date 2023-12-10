import run from "aocrunner";
import { get } from "http";

const extractNumbers = (input: string): number[] => {
  const regex = /\d+/g;
  const matches = input.match(regex);
  if (matches) {
      return matches.map(num => parseInt(num));
  } else {
      return [];
  }
}


const parseInput = (rawInput: string) =>  rawInput.split("\n").map(extractNumbers);




const getNumberOfWinningStrategies = (time: number, distance: number) => {
  let winningStrategies = 0;

  for(let i =time; i > 0; i--) {
    const buttonHoldTime = time - i;
    const millimeterPerMillisecond =  buttonHoldTime * 1;

    const distanceForTime = millimeterPerMillisecond * i;
    if(distanceForTime > distance) {
      winningStrategies++;
    }
  }
  return winningStrategies;
};
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const winningStrategies: number[]= [];
  
  const [time, distance] = input; 
  const raceLength = time.length;
  for(let round=0; round < raceLength; round++) {
    winningStrategies.push(getNumberOfWinningStrategies(time[round], distance[round]));
  }
  
  return winningStrategies.reduce((acc, curr) => acc * curr, 1);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [time, distance] = input;
  const raceTime = parseInt(time.reduce((acc, curr) => acc += curr, ''),10);
  const raceDistance = parseInt(distance.reduce((acc, curr) => acc += curr, ''),10);
  return getNumberOfWinningStrategies(raceTime, raceDistance);
};

const testInput = `Time:      7  15   30
Distance:  9  40  200`;
 
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

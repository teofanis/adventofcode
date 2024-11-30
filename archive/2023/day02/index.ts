import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const regex = /(\d+)\s*(\w+)/gm;
  const games = input.map((game) => {
    let [gameIdMatch, gameRounds] = game.split(':');
    gameIdMatch = gameIdMatch.split(' ')[1];
    let match = regex.exec(gameRounds);
    const rounds = [];
    while (match) {
      rounds.push({ count: parseInt(match[1]), color: match[2] });
      match = regex.exec(gameRounds);
    }
    return {
      game: parseInt(gameIdMatch, 10),
      rounds
    };
  });
  const availableCubes = {
    red: 12,
    blue: 14,
    green: 13,
  };
  const possibleGames = games.filter((game) => {
    const impossibleRedMove = game.rounds.some((round) => round.color === "red" && round.count > availableCubes.red);
    const impossibleBlueMove = game.rounds.some((round) => round.color === "blue" && round.count > availableCubes.blue);
    const impossibleGreenMove = game.rounds.some((round) => round.color === "green" && round.count > availableCubes.green);
   return !impossibleRedMove && !impossibleBlueMove && !impossibleGreenMove;
  });

  return possibleGames.reduce((acc, {game}) => acc + game, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const regex = /(\d+)\s*(\w+)/gm;
  const games = input.map((game) => {
    let [gameIdMatch, gameRounds] = game.split(':');
    gameIdMatch = gameIdMatch.split(' ')[1];
    let match = regex.exec(gameRounds);
    const rounds = [];
    while (match) {
      rounds.push({ count: parseInt(match[1]), color: match[2] });
      match = regex.exec(gameRounds);
    }
    return {
      game: parseInt(gameIdMatch, 10),
      rounds
    };
  });

  const powerSet = games.map((game) => {
    const { rounds } = game;
    const green = rounds.filter((round) => round.color === 'green').map((round) => round.count);
    const blue = rounds.filter((round) => round.color === 'blue').map((round) => round.count);;
    const red = rounds.filter((round) => round.color === 'red').map((round) => round.count);
    return {
      green: Math.max(...green),
      blue: Math.max(...blue),
      red: Math.max(...red)
    }
  });
  return powerSet.reduce((acc, {green, blue, red}) => acc += (green * blue * red), 0);
};

const testInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const testInput2 = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput2,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

import run from "aocrunner";

const part1ColumnTwoMap = {
  X: "Rock",
  Y: "Paper",
  Z: "Scissors",
} as const;

const encryptedGamePlayMap = {
  A: "Rock",
  B: "Paper",
  C: "Scissors",
  ...part1ColumnTwoMap,
} as const;

const GamePlayScoreMap = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
} as const;

const playRules = {
  Rock: "Scissors",
  Paper: "Rock",
  Scissors: "Paper",
};

type EncryptedGamePlay = keyof typeof encryptedGamePlayMap;
type GamePlay = typeof encryptedGamePlayMap[EncryptedGamePlay];

type Round = {
  opponentPlay: GamePlay;
  myPlay: GamePlay;
};

type GameRounds = Round[];

type GamePlayScore = typeof GamePlayScoreMap[GamePlay];

type ScoreBoard = {
  opponentScore: number;
  myScore: number;
};

type RoundOutcome = {
  result: "opponent" | "my" | "tie";
  gamePlayScore: {
    opponent: GamePlayScore;
    me: GamePlayScore;
  };
};

type DesiredRoundOutcome = "win" | "lose" | "tie";

const WINNING_SCORE = 6;
const DRAW_SCORE = 3;
const LOSING_SCORE = 0;

const getGamePlay = (
  encryptedGamePlay: EncryptedGamePlay | string,
): GamePlay => {
  if (!encryptedGamePlayMap.hasOwnProperty(encryptedGamePlay)) {
    throw new Error(`Invalid encrypted game play: ${encryptedGamePlay}`);
  }
  return encryptedGamePlayMap[encryptedGamePlay as EncryptedGamePlay];
};

const getRoundWinner = (
  opponentPlay: GamePlay,
  myPlay: GamePlay,
): RoundOutcome["result"] => {
  return opponentPlay === myPlay
    ? "tie"
    : playRules[opponentPlay] === myPlay
    ? "opponent"
    : ("my" as RoundOutcome["result"]);
};

const getRoundOutcome = (round: Round): RoundOutcome => {
  const { opponentPlay, myPlay } = round;
  const opponentScore = GamePlayScoreMap[opponentPlay];
  const myScore = GamePlayScoreMap[myPlay];
  const result = getRoundWinner(opponentPlay, myPlay);
  return {
    result: result,
    gamePlayScore: {
      opponent: opponentScore,
      me: myScore,
    },
  };
};

const getScoreBoard = (gameRounds: GameRounds): ScoreBoard => {
  return gameRounds.reduce(
    (scoreBoard, round) => {
      const { result, gamePlayScore } = getRoundOutcome(round);
      const { opponentScore, myScore } = scoreBoard;
      const { opponent, me } = gamePlayScore;
      switch (result) {
        case "opponent":
          return {
            opponentScore: opponentScore + opponent + WINNING_SCORE,
            myScore: myScore + me + LOSING_SCORE,
          };
        case "my":
          return {
            opponentScore: opponentScore + LOSING_SCORE,
            myScore: myScore + me + WINNING_SCORE,
          };
        case "tie":
          return {
            opponentScore: opponentScore + opponent + DRAW_SCORE,
            myScore: myScore + me + DRAW_SCORE,
          };
      }
    },
    { opponentScore: 0, myScore: 0 } as ScoreBoard,
  );
};

const determinePlay = (
  opponentPlay: GamePlay,
  desiredOutcome: DesiredRoundOutcome,
): GamePlay => {
  type Play = keyof typeof playRules;
  const losingPlay = playRules[opponentPlay] as Play;
  const winningPlay = playRules[losingPlay];
  const correctPlay =
    desiredOutcome === "win"
      ? winningPlay
      : desiredOutcome === "lose"
      ? losingPlay
      : opponentPlay;
  return correctPlay as GamePlay;
};

const parseRounds = (rounds: string[]): GameRounds => {
  return rounds.map((round) => {
    const [opponentPlay, myPlay] = round.split(" ");
    return {
      opponentPlay: getGamePlay(opponentPlay),
      myPlay: getGamePlay(myPlay),
    };
  });
};
const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const rounds = parseInput(rawInput);
  const gameRounds = parseRounds(rounds);
  const scoreBoard = getScoreBoard(gameRounds);
  return scoreBoard.myScore;
};

const part2 = (rawInput: string) => {
  const rounds = parseInput(rawInput);
  const gameRounds = rounds.map((round) => {
    const [opponentPlay, myPlay] = round.split(" ");
    const opponentGameplay = getGamePlay(opponentPlay);
    const desiredOutcome =
      myPlay === "X" ? "lose" : myPlay === "Y" ? "tie" : "win";
    return {
      opponentPlay: opponentGameplay,
      myPlay: determinePlay(opponentGameplay, desiredOutcome),
    };
  });
  const scoreBoard = getScoreBoard(gameRounds);
  return scoreBoard.myScore;
};

run({
  part1: {
    tests: [
      {
        input: `
        A Y
        B X
        C Z
        `,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        A Y
        B X
        C Z
        `,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

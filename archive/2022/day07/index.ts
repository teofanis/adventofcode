import run from "aocrunner";

type Command = {
  command: "cd" | "ls";
  args: string[];
  type: "command";
};

type File = {
  name: string;
  size: number;
  type: "file" | "dir";
};

type Input = (Command | File)[];

type DirSizeMap = {
  [key: string]: number;
};
const isCommand = (line: string): boolean => {
  return line.startsWith("$");
};

const isDir = (line: string): boolean => {
  return line.startsWith("dir");
};

const parseCommand = (line: string): Command => {
  const [command, ...args] = line.slice(1).trim().split(" ");
  if (command !== "cd" && command !== "ls") {
    throw new Error(`Command ${command} is not valid`);
  }
  return { command, args, type: "command" };
};

const parseLine = (line: string): File => {
  const lineArray = line.split(" ");
  if (isDir(line)) {
    const [_, name] = lineArray;
    return { name, size: 0, type: "dir" };
  }
  const [size, name] = lineArray;

  return { name, size: parseInt(size), type: "file" };
};

const getDirSizeMap = (input: Input): DirSizeMap => {
  let currentDir = "";
  let dirSize: DirSizeMap = {};
  input.forEach((item) => {
    if (item.type === "command") {
      if (item.command === "cd") {
        const [dir] = item.args;
        if (dir === "..") {
          currentDir = currentDir.split("/").slice(0, -1).join("/") || "root";
        } else {
          currentDir =
            dir === "/"
              ? dir
              : currentDir === "/"
              ? currentDir + dir
              : `${currentDir}/${dir}`;
        }
        if (!dirSize.hasOwnProperty(currentDir)) {
          dirSize[currentDir] = 0;
        }
      } else if (item.command === "ls") {
        return;
      }
    } else {
      dirSize[currentDir] = dirSize[currentDir] + item.size;
    }
  });

  Object.keys(dirSize).forEach((key) => {
    const keyArray = key.split("/");
    for (let i = 1; i < keyArray.length; i++) {
      const parentKey = keyArray.slice(0, i).join("/") || "root";
      if (dirSize.hasOwnProperty(parentKey)) {
        dirSize[parentKey] = dirSize[parentKey] + dirSize[key];
      }
    }
  });

  return dirSize;
};

const parseInput = (rawInput: string): Input => {
  return rawInput
    .split("\n")
    .map((line) => (isCommand(line) ? parseCommand(line) : parseLine(line)));
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const MAX_DIR_SIZE = 100000;
  const dirSize = getDirSizeMap(input);
  const result = Object.keys(dirSize).reduce((acc, key) => {
    if (dirSize[key] <= MAX_DIR_SIZE) {
      return acc + dirSize[key];
    }
    return acc;
  }, 0);
  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const TOTAL_FILESYSTEM_SIZE = 70000000;
  const UPDATE_SIZE = 30000000;
  const dirSize = getDirSizeMap(input);
  const TOTAL_SIZE_USED = dirSize.root;

  const AVAILABLE_SPACE = TOTAL_FILESYSTEM_SIZE - TOTAL_SIZE_USED;
  const SIZE_TO_FREE = UPDATE_SIZE - AVAILABLE_SPACE;
  const closest = Object.values({ ...dirSize, "/": 0 })
    .filter((size) => size >= SIZE_TO_FREE)
    .sort((a, b) => {
      return Math.abs(SIZE_TO_FREE - a) - Math.abs(SIZE_TO_FREE - b);
    });

  return closest.shift() || 0;
};

const testInput = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

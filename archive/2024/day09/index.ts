import run from "aocrunner";
type DiskEntry = [number, number];
type DiskBlock = ("." | number)[];

type ParsedInput = DiskEntry[];

const decompressDiskMap = (compressed: ParsedInput): DiskBlock => {
  const result: DiskBlock = [];
  compressed.forEach(([file, space], index) => {
    for (let i = 0; i < file; i++) {
      result.push(index);
    }
    for (let i = 0; i < space; i++) {
      result.push(".");
    }
  });
  return result;
};

const compactDisk = (diskArray: DiskBlock): DiskBlock => {
  let firstEmptyIndex = 0;
  let lastBlockIndex = diskArray.length - 1;

  // Move blocks one at a time
  while (firstEmptyIndex < lastBlockIndex) {
    // Find the first free space
    while (
      diskArray[firstEmptyIndex] !== "." &&
      firstEmptyIndex < diskArray.length
    ) {
      firstEmptyIndex++;
    }

    // Find the last non-free block
    while (diskArray[lastBlockIndex] === "." && lastBlockIndex >= 0) {
      lastBlockIndex--;
    }

    if (firstEmptyIndex < lastBlockIndex) {
      diskArray[firstEmptyIndex] = diskArray[lastBlockIndex];
      diskArray[lastBlockIndex] = ".";
    }
  }

  return diskArray;
};

const calculateChecksum = (diskArray: DiskBlock): number => {
  return diskArray.reduce((checksum, block, position) => {
    return block === "."
      ? checksum
      : Number(checksum) + position * (block as number);
  }, 0) as number;
};

const parseInput = (rawInput: string): ParsedInput => {
  const digits = rawInput.split("").map(Number);
  const pairs: ParsedInput = [];
  for (let i = 0; i < digits.length; i += 2) {
    if (i + 1 < digits.length) {
      pairs.push([digits[i], digits[i + 1]]);
    } else {
      pairs.push([digits[i], 0]);
    }
  }
  return pairs;
};

const compactDiskPart2 = (
  diskArray: DiskBlock,
  parsedInput: ParsedInput,
): DiskBlock => {
  const files = parsedInput.map(([file]) => file);
  const blocks = files.slice();
  const empties = parsedInput.map(([, space]) => space);

  for (let findex = files.length - 1; findex >= 0; findex--) {
    const fileSize = files[findex];
    const eindex = empties.findIndex(
      (empty, idx) => empty >= fileSize && idx < findex,
    );

    if (eindex === -1) {
      continue;
    }

    const emptyStart =
      blocks.slice(0, eindex + 1).reduce((acc, size) => acc + size, 0) +
      empties.slice(0, eindex).reduce((acc, size) => acc + size, 0);

    const fileStart =
      blocks.slice(0, findex).reduce((acc, size) => acc + size, 0) +
      empties.slice(0, findex).reduce((acc, size) => acc + size, 0);

    for (let i = 0; i < fileSize; i++) {
      diskArray[emptyStart + i] = diskArray[fileStart + i];
      diskArray[fileStart + i] = ".";
    }

    empties[eindex] -= fileSize;
    blocks[eindex] += fileSize;
  }

  return diskArray;
};

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput);
  const diskArray = decompressDiskMap(input);
  const compactedArray = compactDisk(diskArray);
  const checksum = calculateChecksum(compactedArray);
  return checksum;
};

const part2 = (rawInput: string): number => {
  const input = parseInput(rawInput);
  const diskArray = decompressDiskMap(input);
  const compactedArray = compactDiskPart2(diskArray, input);
  const checksum = calculateChecksum(compactedArray);
  return checksum;
};
const testInput = `2333133121414131402`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

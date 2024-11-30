import run from "aocrunner";

type AlmanacMap = {
  destinationStart: number,
  sourceStart: number,
  rangeLength: number 
}
type Almanac = {
  seeds: number[],
  seedSoil : AlmanacMap[],
  soilFertilizer: AlmanacMap[],
  fertilizerWater: AlmanacMap[],
  waterLight: AlmanacMap[],
  lightTemperature: AlmanacMap[],
  temperatureHumidity: AlmanacMap[],
  humidityLocation: AlmanacMap[]
};

type MapTypes =  keyof Almanac;

const parseInput = (rawInput: string) => {
  const almanacMaps :Record<string, MapTypes> = {
    'seeds': 'seeds',
    'seed-to-soil map': 'seedSoil',
    'soil-to-fertilizer map': 'soilFertilizer',
    'fertilizer-to-water map': 'fertilizerWater',
    'water-to-light map': 'waterLight',
    'light-to-temperature map': 'lightTemperature',
    'temperature-to-humidity map': 'temperatureHumidity',
    'humidity-to-location map': 'humidityLocation'
  };

  const almanac : Almanac = {
    seeds: [],
    seedSoil : [],
    soilFertilizer: [],
    fertilizerWater: [],
    waterLight: [],
    lightTemperature: [],
    temperatureHumidity: [],
    humidityLocation: []
  };

  
  rawInput.split('\n\n').forEach((section) => {
    const[sectionName, numberSequence] =section.split(':');
    const almanacKey  = almanacMaps[sectionName];
    if(almanacKey === 'seeds') {
      almanac[almanacKey] = numberSequence.trim().split(' ').map((num) => parseInt(num, 10));
    } else {
      numberSequence.trim().split('\n').forEach((line) => {
        const [destinationStart, sourceStart, range] = line.split(' ').map((num) => parseInt(num, 10));
 
        almanac[almanacKey].push({
          destinationStart,
          sourceStart,
          rangeLength: range,
        });
      });
    }
  
  });

  return almanac;
};

const findDestinationLocation = (sourceId:number, map: AlmanacMap[]):number => {
  const mapEntry = map.find((entry) => {
    const { sourceStart, rangeLength } = entry;
    return  sourceId < sourceStart + rangeLength && sourceId >= sourceStart;
  });
  if(!mapEntry) return sourceId;
  const { destinationStart, sourceStart } = mapEntry;
  const relativeSourceId = sourceId - sourceStart;
  return relativeSourceId + destinationStart;

}
const findLocation = (seed: number, almanac: Almanac):number => {
  const soilId = findDestinationLocation(seed, almanac.seedSoil);
  const fertilizerId = findDestinationLocation(soilId, almanac.soilFertilizer);
  const waterId = findDestinationLocation(fertilizerId, almanac.fertilizerWater);
  const lightId = findDestinationLocation(waterId, almanac.waterLight);
  const temperatureId = findDestinationLocation(lightId, almanac.lightTemperature);
  const humidityId = findDestinationLocation(temperatureId, almanac.temperatureHumidity);
  const locationId = findDestinationLocation(humidityId, almanac.humidityLocation);

  return locationId;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const { seeds} = input;
  let lowestLocation:number|null = null;
  seeds.forEach((seed) => {
    const seedLocation = findLocation(seed, input)
    if(lowestLocation === null || seedLocation < lowestLocation) {
      lowestLocation = seedLocation;
    }
  });
  return lowestLocation ?? 0;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const { seeds } = input;
  let lowestLocation:number|null = null;
  for(let i =0; i< seeds.length; i++) {
    for(let j = seeds[i]; j< seeds[i] + seeds[i+1]; j++) {
      const seedLocation = findLocation(j, input)
      if(lowestLocation === null || seedLocation < lowestLocation) {
        lowestLocation = seedLocation;
      }
    }
    i++;
  }
  return lowestLocation ?? 0;
};

const testInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected:35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

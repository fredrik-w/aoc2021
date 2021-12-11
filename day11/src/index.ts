import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n').map(l => l.split('').map(s => +s));

const getAdjacent = (map: number[][], row: number, col: number): Array<number[]> => {
  let adjacent: Array<number[]> = [];
  row > 0 && col > 0 && adjacent.push([row - 1, col - 1]);
  row > 0 && adjacent.push([row - 1, col]);
  row > 0 && col < map[row].length - 1 && adjacent.push([row - 1, col + 1]);
  col > 0 && adjacent.push([row, col - 1]);
  col < map[row].length - 1 && adjacent.push([row, col + 1]);
  row < map.length - 1 && col > 0 && adjacent.push([row + 1, col - 1]);
  row < map.length - 1 && adjacent.push([row + 1, col]);
  row < map.length - 1 && col < map[row].length - 1 && adjacent.push([row + 1, col + 1]);
  return adjacent;
}

const includes = (collection: number[][], value: number[]): boolean => collection.find(([x, y]) => value[0] === x && value[1] === y) !== undefined;

const simulate = (map: number[][], steps: number, breakOnAllFlashes: boolean=false): number => {
  let flashes: number = 0;
  for (let i = 0; i < steps; i++) {
    let flashed: number[][] = [];
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        let inspect: number[][] = [[row, col]];
        while (inspect.length) {
          let [x, y] = inspect.shift()!;
          if (!includes(flashed, [x, y])) {
            if (++map[x][y] > 9) {
              flashed.push([x, y]) && flashes++;
              inspect.push(...getAdjacent(map, x, y)) && (map[x][y] = 0);
            }
          }
        }
      }
    }
    if (breakOnAllFlashes && flashed.length === map.length * map[0].length) {
      return i+1;
    }
  }
  return flashes;
}

export const part1 = (map: number[][]): number => {
  return simulate(map, 100);
}


export const part2 = (map: number[][]): number => {
  return simulate(map, Infinity,true);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

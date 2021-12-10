import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

const valueAt = (lines: string[], row: number, col: number): number => +lines[row].charAt(col);
const isLowPoint = (lines: string[], char: number, adjacent: Array<number[]>): boolean => {
  let values = adjacent.map(([row, col]) => valueAt(lines, row, col));
  return !values.includes(char) && Math.min(char, ...values) === char;
}

const getAdjacent = (lines: string[], row: number, col: number): Array<number[]> => {
  let adjacent: Array<number[]> = [];
  col > 0 && adjacent.push([row, col - 1]);
  row > 0 && adjacent.push([row - 1, col]);
  col < lines[row].length-1 && adjacent.push([row, col + 1]);
  row < lines.length-1 && adjacent.push([row + 1, col]);
  return adjacent;
}

export const part1 = (lines: string[]): number => {
  let lowPoints: number[] = [];
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      let char = +lines[row].charAt(col);
      isLowPoint(lines, char, getAdjacent(lines, row, col)) && lowPoints.push(char + 1);
    }
  }
  return lowPoints.reduce((sum, val) => sum + val);
}

const exploreBasin = (lines: string[], adjacent: Array<number[]>): Array<number[]> => {
  const includes = (collection: Array<number[]>, value: number[]): boolean => {
    return collection.find(([x, y]) => value[0] === x && value[1] === y) !== undefined;
  }

  let points: Array<number[]> = [];
  let inspect: Array<number[]> = adjacent;
  while(inspect.length > 0) {
    let [row, col] = inspect.pop()!;
    if (valueAt(lines, row, col) < 9) {
      !includes(points, [row,col]) && points.push([row, col]);
      let newPoints = getAdjacent(lines, row, col).filter(point => !includes(points, point) && valueAt(lines, point[0], point[1]) < 9);
      inspect.push(...newPoints);
    }
  }
  return points;
}

export const part2 = (lines: string[]): number => {
  let basins = []

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      let char = +lines[row].charAt(col);
      const adjacent = getAdjacent(lines, row, col);
      if (isLowPoint(lines, char, adjacent)) {
        basins.push(exploreBasin(lines, adjacent));
      }
    }
  }
  basins.sort((a, b) => a.length > b.length ? 1 : -1);
  return basins.slice(-3).map(basin => basin.length).reduce((sum, val) => sum * val);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

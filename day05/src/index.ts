import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n').map(l => l.split(' -> ')).flatMap(s => ({start: createCoordinate(s[0]), end: createCoordinate(s[1])}));

type Coordinate = { x: number, y: number }
type Line = { start: Coordinate, end: Coordinate };
const createCoordinate = (proto: string): Coordinate => {
  let [x, y] = proto.split(',').map(s => parseInt(s));
  return {x, y}
}

const createMap = (coordinates: Line[]): number[][] => {
  let maxX = 0, maxY = 0;
  coordinates.forEach(c => {
    c.end.x > maxX && (maxX = c.end.x);
    c.end.y > maxY && (maxY = c.end.y);
  });
  const size = Math.max(maxX, maxY)+1;
  return new Array(size).fill(0).map(_ => new Array(size).fill(0));
}

const getPoints = function*(line: Line) {
  const { start, end } = line;
  let { x, y } = start;
  while (x !== end.x && y !== end.y) {
    start.x !== end.x && (x += 1 * (start.x <= end.x ? 1 : -1))
    start.y !== end.y && (y += 1 * (start.y <= end.y ? 1 : -1))
    yield [x, y];
  }
}

const calculate = (coordinates: Line[]): number => {
  let ventMap: number[][] = createMap(coordinates);
  coordinates.forEach(line => {
    for (let [x, y] of getPoints(line)) {
      ventMap[y][x] += 1;
    }
  });
  return ventMap.flat().filter(v => v > 1).length;
}

export const part1 = (input: Line[]): number => calculate(input.filter(c => c.start.x === c.end.x || c.start.y === c.end.y));

export const part2 = (coordinates: Line[]): number => calculate(coordinates);

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

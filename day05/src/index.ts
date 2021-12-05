import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n').map(l => l.split(' -> ')).flatMap(s => ({start: toCoord(s[0]), end: toCoord(s[1])}));

type Coordinate = { x: number, y: number }
type Coordinates = { start: Coordinate, end: Coordinate }[];
const toCoord = (proto: string): Coordinate => {
  let [x, y] = proto.split(',').map(s => parseInt(s));
  return {x, y}
}

const visualize = (ventMap: number[][]): void => {
  ventMap.forEach(l => console.log(l.map(v => v === 0 ? '.' : v.toString()).join('')));
}

export const part1 = (input: Coordinates): number => {
  const coordinates = input.map(c => c.start.x > c.end.x || c.start.y > c.end.y ? {start: c.end, end: c.start} : c).filter(c => c.start.x === c.end.x || c.start.y === c.end.y); // part1
  let maxX = 0, maxY = 0;
  coordinates.forEach(c => {
    c.end.x > maxX && (maxX = c.end.x);
    c.end.y > maxY && (maxY = c.end.y);
  });
  let ventMap: number[][] = new Array(maxX + 1).fill(0).map(_ => new Array(maxY + 1).fill(0));

  for (let c of coordinates) {
    for (let y = c.start.y; y <= c.end.y; y++) {
      for (let x = c.start.x; x <= c.end.x; x++) {
        ventMap[x][y] += 1;
      }
    }
  }

  return ventMap.flat().filter(v => v > 1).length;
}

export const part2 = (coordinates: Coordinates): number => {
  return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

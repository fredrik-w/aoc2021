import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');
const TOP = 'a';
const TOP_LEFT = 'b';
const TOP_RIGHT = 'c';
const MIDDLE = 'd';
const BOTTOM_LEFT = 'e';
const BOTTOM = 'f';
const BOTTOM_RIGHT = 'g';

const digitsSegments = new Map<number, string[]>([
  [0, [TOP, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT]],
  [1, [TOP_RIGHT, BOTTOM_RIGHT]],
  [2, [TOP, TOP_RIGHT, MIDDLE, BOTTOM_LEFT, BOTTOM_RIGHT]],
  [3, [TOP, TOP_RIGHT, MIDDLE, BOTTOM, BOTTOM_RIGHT]],
  [4, [TOP_LEFT, TOP_RIGHT, MIDDLE, BOTTOM]],
  [5, [TOP, TOP_LEFT, MIDDLE, BOTTOM, BOTTOM_RIGHT]],
  [6, [TOP, TOP_LEFT, MIDDLE, BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT]],
  [7, [TOP, TOP_RIGHT, BOTTOM]],
  [8, [TOP, TOP_LEFT, TOP_RIGHT, MIDDLE, BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT]],
  [9, [TOP, TOP_LEFT, TOP_RIGHT, MIDDLE, BOTTOM, BOTTOM_RIGHT]],
]);

const analyzeOccurrenceByLength = (scrambled: string[]): number => {
  const byLength = (length: number) => scrambled.filter(wires => wires.length === length).length;
  return byLength(digitsSegments.get(1)!.length) +
     byLength(digitsSegments.get(4)!.length) +
     byLength(digitsSegments.get(7)!.length)+
     byLength(digitsSegments.get(8)!.length);
}

export const part1 = (lines: string[]): number => {
  return lines.map(l => {
    const [ , scrambledSegments] = l.split(' | ');
    return analyzeOccurrenceByLength(scrambledSegments.split(' '))
  }).reduce((sum, count) => sum + count);
}

export const part2 = (lines: string[]): number => {
  /*
  lines.forEach(l => {
    const { scrambledWires, scrambledSegments } = l.split(' | ');
    analyzeOccurrenceByLength(scrambledWires);
  })
  */
  return -1
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

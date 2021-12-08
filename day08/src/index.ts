import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');


const original = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];
const originalMapping = original.map(v => ({wire: v, segment: v}));

const analyzeOccurrenceByLength = (scrambled: string[]): number => {
  const byLength = (length: number) => scrambled.filter(wires => wires.length === length).length;
  return byLength(original[1].length) + byLength(original[4].length) + byLength(original[7]!.length) + byLength(original[8]!.length);
}

export const part1 = (lines: string[]): number => {
  return lines.map(l => {
    const [, scrambledSegments] = l.split(' | ');
    return analyzeOccurrenceByLength(scrambledSegments.split(' '))
  }).reduce((sum, count) => sum + count);
}

export const part2 = (lines: string[]): number => {
  //lines.map()
  /*
  lines.forEach(l => {
    const { scrambledWires, scrambledSegments } = l.split(' | ');
    analyzeOccurrenceByLength(scrambledWires);
  })
  */
  return -1
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

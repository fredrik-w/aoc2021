import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

const valid_chunks: string[] = ['()', '{}', '<>', '[]'];
const containsChunk = (line: string): boolean => valid_chunks.some(chunk => line.includes(chunk));
const incomplete = (line: string): boolean => !valid_chunks.some(chunk => line.includes(chunk.charAt(1)));
const points: Map<string, number[]> = new Map<string, number[]>([[')', [3, 1]], [']', [57, 2]], ['}', [1197, 3]], ['>', [25137, 4]]]);
const firstIllegalBracket = (line: string): number => Math.min(...[...points.keys()].map(bracket => line.indexOf(bracket)).filter(idx => idx >= 0));

const removeCorrectPairs = (lines: string[]): string[] => {
  return lines.map(line => {
    while (containsChunk(line)) {
      valid_chunks.every(chunk => line = line.replaceAll(chunk, ''));
    }
    return line;
  })
}

export const part1 = (lines: string[]): number => {
  return removeCorrectPairs(lines)
    .filter(line => !incomplete(line))
    .map(corrupt => corrupt.charAt(firstIllegalBracket(corrupt)))
    .map(bracket => points.get(bracket)![0])
    .reduce((sum, val) => sum + val);
}


export const part2 = (lines: string[]): number => {
  const calculatePoints = (chars: string[]): number => chars.reduce((sum, char) => sum * 5 + points.get(char)![1], 0);

  const scores: number[] = removeCorrectPairs(lines)
    .filter(line => incomplete(line))
    .map(l => l.split('').reverse())
    .map(brackets => brackets.map(opening => valid_chunks.find(c => c.startsWith(opening))!.charAt(1)))
    .map(chars => calculatePoints(chars))
    .sort((a, b) => a > b ? 1 : -1);
  return scores[Math.floor(scores.length/2)];
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

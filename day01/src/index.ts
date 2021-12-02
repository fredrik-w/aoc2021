import * as fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n').map((v) => parseInt(v));

export const part1 = (lines: number[]): number => {
  return lines.reduce((sum, val, idx, arr) => {
    return sum + (val > arr[idx - 1] ? 1 : 0);
  }, 0);
};

export const part2 = (lines: number[]): number => {
  return part1(lines.map((val, idx, arr) => {
    return (idx + 2 >= arr.length) ? -1 : val + arr[idx + 1] + arr[idx + 2];
  }));
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

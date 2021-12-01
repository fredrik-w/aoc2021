import * as fs from 'fs';

export const readFile = (filename: string) => fs
  .readFileSync(filename)
  .toString()
  .trim()
  .split('\n')
  .map((v) => parseInt(v));

export const part1 = (lines: number[]): number => {
  return lines.reduce((sum, val, idx, arr) => {
    return sum + (val > arr[idx - 1] ? 1 : 0);
  }, 0);
};

const part = process.env.part || 'part1';

if (require.main === module) {
  let result: unknown;
  if (part === 'part1') {
    result = part1(readFile('input.txt'));
  } else {
    result = -1
  }
  console.log(result);
}

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

export const part2 = (lines: number[]): number => {
  const sliding_window = lines.map((val, idx, arr) => {
    if (idx + 2 >= arr.length) {
      return -1;
    }
    return val + arr[idx + 1] + arr[idx + 2];
  });

  return part1(sliding_window);
}

const part = process.env.part || 'part1';
const numbers = readFile('input.txt');


if (require.main === module) {
  let result: unknown;
  if (part === 'part1') {
    result = part1(numbers);
  } else {
    result = part2(numbers)
  }
  console.log(result);
}

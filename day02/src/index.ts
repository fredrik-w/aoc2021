import * as fs from 'fs';

export const readFile = (filename: string) => fs
  .readFileSync(filename)
  .toString()
  .trim()
  .split('\n');

export const part1 = (lines: string[]): number => {
  const products = {x: 0, y: 0};
  lines.forEach((v) => {
    v.startsWith('forward')
      ? products.x += parseInt(v.split(' ')[1])
      : products.y += parseInt(v.split(' ')[1]) * (v.startsWith('up') ? -1 : 1);
  });
  return products.x * products.y;
};

export const part2 = (lines: string[]): number => {
  return -1;
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

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
  const products = {x: 0, y: 0, z: 0};
  lines.forEach((v) => {
    const [command, value] = v.split(' ');
    products.x += command !== 'forward' ? 0 : parseInt(value);
    products.y += command !== 'forward' ? 0 : products.z * parseInt(value);
    products.z += command === 'forward' ? 0 : parseInt(value) * (command === 'up' ? -1 : 1);
  });
  return products.x * products.y;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

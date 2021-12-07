import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split(',').map(s => +s);

export const part1 = (crabs: number[]): number => {
  const sortedCrabs = crabs.sort((a, b) => a > b ? 1 : -1);
  const desiredPosition = sortedCrabs[Math.abs(sortedCrabs.length/2)]
  return sortedCrabs.reduce((fuel, position) => fuel += Math.abs(position-desiredPosition), 0);
}

export const part2 = (crabs: number[]): number => {
  return -1
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

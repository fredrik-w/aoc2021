import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split(',').map(s => +s).sort((a, b) => a > b ? 1 : -1);

export const part1 = (crabs: number[]): number => {
  return crabs.reduce((fuel, position) => fuel += Math.abs(position - crabs[Math.abs(crabs.length / 2)]), 0);
}

export const part2 = (crabs: number[]): number => {
  const sortedCrabs = crabs;
  const desiredPosition = sortedCrabs.length / 2;
  const fuelCalculator = (position: number, desiredPosition: number): number => {
    const diff = Math.abs(position - desiredPosition);
    let sum = 0;
    for (let i=0; i <= diff; i++) {
      sum += i;
    }
    return sum;
  }

  return sortedCrabs.reduce((fuel, position) => fuel += fuelCalculator(position, desiredPosition), 0)
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

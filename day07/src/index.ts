import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split(',').map(s => +s).sort((a, b) => a > b ? 1 : -1);

export const part1 = (crabs: number[]): number => crabs.reduce((fuel, position) => fuel + Math.abs(position - crabs[crabs.length / 2]), 0);

export const part2 = (crabs: number[]): number => {
  const fuelCalculator = (desiredPosition: number): number => desiredPosition * (desiredPosition+1) / 2;

  let costMap = new Map<number,number>();
  for (let [i, iMax] = [Math.min(...crabs), Math.max(...crabs)]; i<=iMax; i++) {
    costMap.set(i, crabs.reduce((sum, pos) => sum + fuelCalculator(Math.abs(pos - i)), 0));
  }
  return Math.min(...costMap.values());
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

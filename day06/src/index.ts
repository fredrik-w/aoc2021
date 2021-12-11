import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split(',').map(v => +v);

const lanternFishSimulator = (initial: number[], days: number): number => {
  let lanternFish: number[] = new Array(9).fill(0);
  initial.forEach(n => lanternFish[n]++);

  for (let day = 0; day < days; day++) {
    lanternFish.push(lanternFish.shift() as number);
    lanternFish[6] += lanternFish[8];
  }
  return lanternFish.reduce((sum, v) => sum + v);
}

export const part1 = (initial: number[]): number => lanternFishSimulator(initial, 80);

export const part2 = (initial: number[]): number => lanternFishSimulator(initial, 256);


require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split(',').map(v => +v);

const lanternFishSimulator = (initial: number[], days: number): number => {
  let lanternFish: number[] = new Array(9).fill(0);
  initial.forEach(n => lanternFish[n]++);

  for (let day = 0; day < days; day++) {
    let newFish: number = lanternFish[0];
    for (let i = 0; i <= 7; i++) {
      lanternFish[i] = lanternFish[i+1];
    }
    lanternFish[8] = newFish;
    lanternFish[6] += newFish;
  }
  return lanternFish.reduce((sum, v) => sum + v);
}

export const part1 = (initial: number[]): number => {
  return lanternFishSimulator(initial, 80);
}

export const part2 = (initial: number[]): number => {
  return lanternFishSimulator(initial, 256);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

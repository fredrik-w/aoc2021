import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split(',').map(v => +v);

export const part1 = (initial: number[]): number => {
  let lanternFish: Map<number, number> = new Map<number, number>();
  for (let i = 0; i <= 8; i++) {
    lanternFish.set(i, 0);
  }
  initial.forEach(n => {
      lanternFish.set(n, lanternFish.get(n) as number + 1);
    }
  );

  for (let day = 0; day < 80; day++) {
    let newFish: number = lanternFish.get(0) as number;
    for (let i = 0; i <= 7; i++) {
      lanternFish.set(i, +(lanternFish.get(i + 1) as number));
    }
    lanternFish.set(8, newFish);
    lanternFish.set(6, (lanternFish.get(6) as number) + newFish);
  }
  return [...lanternFish.values()].reduce((sum, v) => sum + v);
}

export const part2 = (initial: number[]): number => {
  return -1
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

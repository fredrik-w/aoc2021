import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim();

const parseTarget = (input: string) => {
  const x = input.substring(15, input.indexOf(',')).split('..').map(v => +v);
  const y = input.substring(input.indexOf(',')+4).split('..').map(v => +v);
  return { x, y }
}

const anyStepHitsTarget = (target: { x: number[], y: number[] }, positions: number[][]): boolean => {
  return positions.some(([posX, posY]) => posX >= target.x[0] && posX <= target.x[1] && posY >= target.y[0] && posY <= target.y[1]);
}

const overshoot = (target: { x: number[], y: number[] }, x: number, y: number): boolean => x > target.x[1] || y < target.y[1];

const simulate = (target: {x:number[], y:number[]}, x: number, y: number) =>  {
  let positions: number[][] = [];
  let posX = 0;
  let posY = 0;
  positions.push([posX, posY]);
  while(!overshoot(target, posX, posY)) {
    positions.push([(posX+=x), (posY+=y)]);
    x > 0 ? x-- : x < 0 ? x++ : 0;
    y--;
  }
  return positions;
}

export const part1 = (input: string): number => {
  const target = parseTarget(input);
  let values: Map<number[], number> = new Map();
  for (let x=1; x<=target.x[1]+1; x++) {
    for (let y=1; y<=Math.abs(target.y[0])*2; y++) {
      const steps = simulate(target, x, y);
      if (anyStepHitsTarget(target, steps)) {
        values.set([x, y], steps.map(s => s[1]).reduce((max, v) => v > max ? v : max, 0));
      }
    }
  }
  return [...values.entries()].reduce((prev, cur) => cur[1] > prev[1] ? cur : prev)[1];
};


export const part2 = (input: string): number => {
return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));


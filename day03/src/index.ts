import * as fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

function diagnostic(lines: string[]) {
  const counter: number[] = new Array(lines[0].length).fill(0);
  const bits: number[][] = new Array(lines[0].length).fill([]);
  lines.map(s => {
    let b = new Array<number>(...(s.split('').map(v => parseInt(v))));
    bits.push(b)
    b.forEach((v, idx) => {
      counter[idx] += v;
    });
  })
  console.log(counter, bits);
  return counter;
}

export const part1 = (lines: string[]): number => {
  const counter = diagnostic(lines);
  const gamma = counter.map(v => {
    return v > lines.length / 2 ? 1 : 0
  }).join('');
  const epsilon = gamma.replace(/\d/g, (s) => (parseInt(s) ^ 1).toString())
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

export const part2 = (lines: string[]): number => {
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

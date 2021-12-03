import * as fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

function toBitList(lines: string[]): number[][] {
  return lines.map(s => new Array<number>(...(s.split('').map(v => parseInt(v)))));
}

function occurrences(bits: number[][]): number[] {
  const counter: number[] = new Array(bits[0].length).fill(0);
  bits.forEach(b => b.forEach((v, idx) => counter[idx] += v));
  return counter;
}

export const part1 = (lines: string[]): number => {
  const counter = occurrences(toBitList(lines));
  const gamma = counter.map(v => v > lines.length / 2 ? 1 : 0).join('');
  const epsilon = gamma.replace(/\d/g, (s) => (parseInt(s) ^ 1).toString())
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

const part2Filter = (bits: number[][], filter: (x: number, y: number) => number) => {
  let filteredData: number[][] = bits;
  for (let i = 0; i < bits[0].length && filteredData.length > 1; i++) {
    filteredData = filteredData.filter((v) => v[i] === filter(occurrences(filteredData)[i], filteredData.length));
  }
  return filteredData[0];
}

export const part2 = (lines: string[]): number => {
  const bits = toBitList(lines);
  const oxygen = part2Filter(bits, (x, y) => x >= y / 2 ? 1 : 0);
  const scrubber = part2Filter(bits, (x, y) => x < y / 2 ? 1 : 0);

  return parseInt(oxygen.join(''), 2) * parseInt(scrubber.join(''), 2);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

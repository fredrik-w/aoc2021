import * as fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n').map(s => new Array<number>(...(s.split('').map(v => parseInt(v)))));

function occurrences(bits: number[][]): number[] {
  const counter: number[] = new Array(bits[0].length).fill(0);
  bits.forEach(b => b.forEach((v, idx) => counter[idx] += v));
  return counter;
}

export const part1 = (bits: number[][]): number => {
  const counter = occurrences(bits);
  const gamma = counter.map(v => v > bits.length / 2 ? 1 : 0).join('');
  const epsilon = gamma.replace(/\d/g, (s) => (parseInt(s) ^ 1).toString())
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

export const part2 = (bits: number[][]): number => {
  const filter = (b: number[][], condition: (x: number, y: number) => number) => {
    let filteredData: number[][] = b;
    for (let i = 0; i < b[0].length && filteredData.length > 1; i++) {
      filteredData = filteredData.filter((v) => v[i] === condition(occurrences(filteredData)[i], filteredData.length));
    }
    return filteredData[0];
  }
  return parseInt(filter(bits, (x, y) => x >= y / 2 ? 1 : 0).join(''), 2) * parseInt(filter(bits, (x, y) => x < y / 2 ? 1 : 0).join(''), 2);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

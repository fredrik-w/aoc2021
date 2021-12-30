import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

export const explode = (pairs: string): string => {
  const chars = ['[', ']', ','];

  const explodeNumber = (pairs: string, index: number, valueToAdd: number): string => {
    let start: number = index;
    let end: number = index;
    while (!chars.includes(pairs.charAt(--start)) && start > 0);
    start > 1 && start++;
    while (!chars.includes(pairs.charAt(++end)) && end < pairs.length);

    let currentNumber = pairs.substring(start, end);
    return pairs.substring(0, start) + (+currentNumber + valueToAdd).toString() + pairs.substring(start + currentNumber.length);
  }

  let prevNumber = -1;
  let counter = 0;
  for (let i=0; i<pairs.length; i++) {
    if (pairs.charAt(i) === '[') {
      counter++;
    } else if (pairs.charAt(i) === ']') {
      counter--;
    } else if (pairs.charAt(i) !== ',') {
      prevNumber = i;
    }
    if (counter > 4) {
      const explodingPair = pairs.substring(i+1, pairs.indexOf(']', i)).split(',');
      let newPairs = pairs.substring(0, i) + '0' + pairs.substring(pairs.indexOf(']', i)+1);
      while (++i < newPairs.length && chars.includes(newPairs.charAt(i)));
      i < newPairs.length && (newPairs = explodeNumber(newPairs, i, +explodingPair[1]));
      prevNumber !== -1 && (newPairs = explodeNumber(newPairs, prevNumber, +explodingPair[0]));
      return newPairs;
    }
  }
  return pairs;
}

export const split = (pairs: string): string => {
  const splitNumber = (number: number): string => `[${Math.floor(number/2)},${Math.ceil(number/2)}]`;
  const numbers = [...pairs.matchAll(/\b\d{1,}\b/g)];
  for (const n of numbers) {
    if (+n[0] > 9) {
      return pairs.substring(0, n.index!) + splitNumber(+n[0]) + pairs.substring(n.index! + n[0].length);
    }
  }

  return pairs;
}
export const reduce = (pairs: string, pairs2: string): string => {
  let reduced: string = `[${pairs},${pairs2}]`;
  while (true) {
    let temp = reduced;
    temp = explode(reduced);
    if (temp.length !== reduced.length) {
      reduced = temp;
      continue;
    }
    temp = split(reduced);
    if (temp.length !== reduced.length) {
      reduced = temp;
      continue;
    }
    break;
  }

  return reduced;
}

export const magnitude = (pairs: string): number => {
  const calculateMagnitude = (pair: string): number => {
    let numbers = pair.substring(1, pair.length-1).split(',').map(v => +v);
    return (3 * numbers[0]) + (2 * numbers[1]);
  }

  let value = pairs;
  while (value.includes('[')) {
    for (const m of [...(value.matchAll(/\[\d{1,},\d{1,}]/g))].reverse()) {
      value = value.substring(0, m.index!) + calculateMagnitude(m[0]) + value.substring(m.index! + m[0].length);
    }
  }
  return +value;
}

export const addition = (input: string[]): string => {
  let output: string = input[0];
  for (let i = 1; i < input.length; i++) {
    output = reduce(output, input[i]);
  }
  return output;
}

export const part1 = (input: string[]): number => magnitude(addition(input));



export const part2 = (input: string[]): number => {
  return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
